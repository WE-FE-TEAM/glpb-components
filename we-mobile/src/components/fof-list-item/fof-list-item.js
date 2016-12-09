/**
 * 渲染组合基金列表页的  一个基金    条目
 * Created by qiangran on 2016/12/07.
 */



const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

const bridgeXXX = require('../../bridgeXXX/bridgeXXX.js');

const UIFofListItem = require('../../common-ui/fof-list-item/fof-list-item.js');

require('./fof-list-item.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;
const fofService = serviceFactory.getService('fof');



const tpl = `<div class="glpb-fn-animate-item"><div class="glpb-content"></div></div>`;

const editorPlaceHolderImage = '//m.we.com/cms/577cdedf61e15053267301af/glpb-we/fund-list-item.png';


const FofListItem = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_fof_list_item',
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
                "poCode_$$comment" : '输入要显示的 1个 组合ID',
                poCode : '',
                "source_$$comment" : '购买时发送给后端的统计来源',
                source : 'zhinang'
            };
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
            this.eventBinded = false;
            //组合基金对应的详细数据
            this.fofData = null;
            //单个组合基金渲染的视图
            this.fofItemView = null;
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

                let fofView = new UIFofListItem({
                    source : data.source || ''
                });
                fofView.render();
                  console.log("fofView.render");
                this.$content.append( fofView.$getElement() );
                this.fofItemView = fofView;
            }
        },

        bindComponentEvent : function(){
        console.log("bindComponentEvent");
            let that = this;
            let data = this.data || {};
             console.log("data=="+data);
             console.log("data-json=="+JSON.stringify(data));
            let poCode = data.poCode;
            console.log("poCode=="+poCode);
            if( this.isProductionMode() && ! this.eventBinded && poCode ){

                this.fofItemView.bindEvent();

                this.eventBinded = true;

                this.querySign = utils.generateQuerySign();
                let reqData = {
                    poCode : poCode
                };
                fofService.getFofDetail( reqData )
                    .then( ( reqResult ) => {
                        if( reqResult.requestStatus === fofService.STATUS.SUCCESS ){
                            let result = reqResult.data;
                             console.log("result=="+JSON.stringify(result));
                            if( result.status === 0 ){
                                that.setFofData( result.data );
                                return;
                            }
                            return Promise.reject(new Error(result.message));
                        }
                        return Promise.reject( new Error('获取组合基金数据异常!'));
                    })
                    .catch( (e) => {
                        alert(e.message);
                        that.hide();
                    });
            }
        },

        componentWillUnmount : function(){
            this.$content = null;
            if( this.fofItemView ){
                this.fofItemView.destroy();
                this.fofItemView = null;
            }
        },

        setFofData : function( data ){
            this.fofItemView.setFofData( data );
        }
    }
);


module.exports = FofListItem;
