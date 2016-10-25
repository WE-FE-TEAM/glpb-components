/**
 * 渲染基金列表页的  一个基金    条目
 * Created by jess on 2016/10/25.
 */



const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

const bridgeXXX = require('../../bridgeXXX/bridgeXXX.js');

const UIFundListItem = require('../../common-ui/fund-list-item/fund-list-item.js');

require('./fund-list-item.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;
const fundService = serviceFactory.getService('fund');



const tpl = `<div class="glpb-fn-animate-item"><div class="glpb-content"></div></div>`;

const editorPlaceHolderImage = '//m.we.com/cms/577cdedf61e15053267301af/glpb-we/fund-list-item.png';


const FundListItem = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_fund_list_item',
        componentNameZh : '基金列表的一条',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.MOBILE,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                background : {
                    backgroundColor : '#fff'
                },
                padding : '0',
                margin : '0'
            };
        },

        getDefaultData : function(){
            return {
                "fundCode_$$comment" : '输入要显示的 1个 基金ID',
                fundCode : '',
                "source_$$comment" : '购买时发送给后端的统计来源',
                source : 'zhinang'
            };
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
            this.eventBinded = false;
            //基金列表对应的详细数据
            this.fundData = null;
            //单个基金渲染的视图
            this.fundItemView = null;
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );;
            let $content = $('.glpb-content', $el);

            this.$el = $el;
            this.$content = $content;

            if( ! this.isProductionMode() ){
                //编辑模式, 显示一个图片占位
                $(`<img class="editor-place-holder-img" src="${editorPlaceHolderImage}" title="基金资产列表占位图片(非真实数据)" />`).appendTo( $content );
            }else{
                let fundView = new UIFundListItem({
                    source : data.source || ''
                });
                fundView.render();
                this.$content.append( fundView.$getElement() );
                this.fundItemView = fundView;
            }
        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};
            let fundCode = data.fundCode;
            if( this.isProductionMode() && ! this.eventBinded && fundCode ){

                this.fundItemView.bindEvent();

                this.eventBinded = true;

                this.querySign = utils.generateQuerySign();
                let reqData = {
                    code : fundCode
                };
                fundService.getFundDetail( reqData )
                    .then( ( reqResult ) => {
                        if( reqResult.requestStatus === fundService.STATUS.SUCCESS ){
                            let result = reqResult.data;
                            if( result.status === 0 ){
                                that.setFundData( result.data );
                                return;
                            }
                            return Promise.reject(new Error(result.message));
                        }
                        return Promise.reject( new Error('获取基金数据异常!'));
                    })
                    .catch( (e) => {
                        alert(e.message);
                        that.hide();
                    });
            }
        },

        componentWillUnmount : function(){
            this.$content = null;
            if( this.fundItemView ){
                this.fundItemView.destroy();
                this.fundItemView = null;
            }
        },

        setFundData : function( data ){
            this.fundItemView.setFundData( data );
        }
    }
);


module.exports = FundListItem;
