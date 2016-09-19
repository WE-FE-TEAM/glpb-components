/**
 * 渲染移动端的一个 基金列表 区域
 * Created by jess on 16/9/8.
 */




const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

const bridgeXXX = require('../../bridgeXXX/bridgeXXX.js');

require('./fund-item-list.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;
const fundService = serviceFactory.getService('fund');


const tpl = `<div><ul class="glpb-fund-list"></ul></div>`;

const editorPlaceHolderImage = '//m.we.com/cms/577cdedf61e15053267301af/glpb-we/fund-item-list.png';

const FundItemList = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_fund_item_list',
        componentNameZh : '基金产品列表',
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
                    backgroundColor : '#e8eaec'
                },
                padding : '0',
                margin : '0'
            };
        },

        getDefaultData : function(){
            return {
                "fundIdList_$$comment" : '输入要显示的多个基金ID',
                fundIdList : []
            };
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
            this.eventBinded = false;
            //基金列表对应的详细数据
            this.listDetailData = null;
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );;
            let $content = $('.glpb-fund-list', $el);

            this.$el = $el;
            this.$content = $content;

            if( ! this.isProductionMode() ){
                //编辑模式, 显示一个图片占位
                $(`<li><img class="editor-place-holder-img" src="${editorPlaceHolderImage}" title="基金资产列表占位图片(非真实数据)" /></li>`).appendTo( $content );
            }
        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};
            let fundIdList = data.fundIdList || [];
            if( this.isProductionMode() && ! this.eventBinded && fundIdList.length > 0 ){
                //正式环境才绑定事件, 并且Ajax请求每个基金的详情数据
                this.$content.on('click', '.glpb-fund-list-item', function(e){
                    let $target = $(e.currentTarget);
                    let fundId = $target.attr('data-fund-id');
                    that.openFundDetail( fundId );
                });

                this.querySign = utils.generateQuerySign();
                let reqData = {
                    ids : fundIdList
                };
                fundService.getListBatchDetail( reqData )
                    .then( ( reqResult ) => {
                        if( reqResult.requestStatus === fundService.STATUS.SUCCESS ){
                            let result = reqResult.data;
                            if( result.status === 0 ){
                                that.setListDetailData( result.data );
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
        },

        /**
         * 调用APP的bridge, 打开APP的基金详情页
         * @param fundCode {string} 基金ID
         * @param fundName {string} 基金名
         */
        openFundDetail : function(fundCode, fundName){
            bridgeXXX.showFundDetailPage( fundCode, fundName );
        },

        setListDetailData : function( list ){
            list = list || [];
            this.listDetailData = list;
            if( ! list || list.length < 1 ){
                return this.hide();
            }

            let html = '';
            for( let i = 0, len = list.length; i < len; i++ ){
                html += this._renderItem( list[i] );
            }

            if( html ){
                this.$content.html( html );
            }else{
                this.hide();
            }
        },

        _renderItem : function( data ){

            let fundName = data.fundName || '';
            if( fundName.length > 10 ){
                fundName = fundName.substr(0, 10) + '...';
            }

            let tag = data.remark || '';

            let html = `<h1 class="fund-name">${fundName}（${data.fundCode}）<span class="fund-span">${ tag }</span></h1>
                <ul class="fund-content fn-clear">
                    <li class="fund-info info1">
                        <p class="year-rise">${data.rateYear}<span class="year-rise-span">%</span></p>
                        <p class="rise-text">年涨跌幅</p>
                    </li>
                    <li class="fund-info info2">
                        <p class="year-net">${data.nav}<span class="year-net-span">元</span></p>
                        <p class="rise-text">净值</p>
                    </li>
                    <li class="fund-order-wrap"><div class="fund-order" id="gio-trick-${data.fundCode}">申购</div></li>
                    <li class="split-line"></li>
                </ul>
                `;

            return `<li class="glpb-fund-list-item" id="gio-li-trick-${data.fundCode}" data-fund-id="${data.fundCode}">${html}</li>`;
        }
    }
);


module.exports = FundItemList;

