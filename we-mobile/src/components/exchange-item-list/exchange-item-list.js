/**
 * 交易所(定期理财)产品的列表
 * Created by jess on 16/9/5.
 */




const moment = require('moment');

const numeral = require('numeral');

const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

const bridgeXXX = require('../../bridgeXXX/bridgeXXX.js');

require('./exchange-item-list.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;

const exchangeService = serviceFactory.getService('exchange');


const tpl = `<div><ul class="glpb-exchange-list"></ul></div>`;

const editorPlaceHolderImage = '//m.we.com/cms/577cdedf61e15053267301af/glpb-we/exchange-list-item.png';

const ExchangeItemList = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_exchange_item_list',
        componentNameZh : '交易所产品列表',
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
                    backgroundColor : '#f0f0f0'
                },
                padding : '0',
                margin : '0.24rem 0 0'
            };
        },

        getDefaultData : function(){
            return {
                "exchangeIdList_$$comment" : '输入要显示的多个交易所ID',
                exchangeIdList : []
            };
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
            this.eventBinded = false;
            //交易所列表对应的详细数据
            this.listDetailData = null;
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );;
            let $content = $('.glpb-exchange-list', $el);

            this.$el = $el;
            this.$content = $content;

            if( ! this.isProductionMode() ){
                //编辑模式, 显示一个图片占位
                $(`<li><img class="editor-place-holder-img" src="${editorPlaceHolderImage}" title="交易所资产列表占位图片(非真实数据)" /></li>`).appendTo( $content );
            }
        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};
            let exchangeIdList = data.exchangeIdList || [];
            if( this.isProductionMode() && ! this.eventBinded && exchangeIdList.length > 0 ){
                //正式环境才绑定事件, 并且Ajax请求每个交易所的详情数据
                this.$content.on('click', '.glpb-exchange-list-item', function(e){
                    let $target = $(e.currentTarget);
                    let exchangeId = $target.attr('data-exchange-id');
                    that.openExchangeDetail( exchangeId );
                });
                
                this.querySign = utils.generateQuerySign();
                let reqData = {
                    ids : exchangeIdList
                };
                exchangeService.getListBatchDetail( reqData )
                    .then( ( reqResult ) => {
                        if( reqResult.requestStatus === exchangeService.STATUS.SUCCESS ){
                            let result = reqResult.data;
                            if( result.status === 0 ){
                                that.setListDetailData( result.data );
                                return;
                            }
                            return Promise.reject(new Error(result.message));
                        }
                        return Promise.reject( new Error('获取定义理财数据异常!'));
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
         * 调用APP的bridge, 打开APP的交易所详情页
         * @param exchangeId {string} 交易所ID
         */
        openExchangeDetail : function(exchangeId){
            bridgeXXX.showExchangeDetailPage( exchangeId );
        },
        
        setListDetailData : function( list ){
            list = list || [];
            this.listDetailData = list;
            if( ! list || list.length < 1 ){
                return this.hide();
            }

            let html = '';
            for( let i = 0, len = list.length; i < len; i++ ){
                html += this._renderExchangeItem( list[i] );
            }

            if( html ){
                this.$content.html( html );
            }else{
                this.hide();
            }
        },

        _renderExchangeItem : function( obj ){

            let nameEscaped = utils.escapeHTML( obj.productName );
            let sourceEscaped = utils.escapeHTML( obj.projectSource );
            
            let startSellDate = '';
            let endSellDate = '';

            if( obj.startSellingTime ){
                startSellDate = moment( parseInt( obj.startSellingTime, 10) ).format('MM.DD');
            }
            if( obj.endSellingTime ){
                endSellDate = moment( parseInt( obj.endSellingTime, 10) ).format('MM.DD');
            }

            let startAmount = '';
            if( obj.startAmount ){
                startAmount = numeral( obj.startAmount ).format('0,0') + '元起';
            }

            return `<li class="glpb-exchange-list-item" data-exchange-id="${obj.productNo}">
                        <h2 class="exchange-item-title">${nameEscaped}</h2>
                        <div class="exchange-item-info-main clearfix">
                            <div class="info-box year-rate-box">
                                <div class="product-year-rate highlight"><span class="num-family">${obj.annualRate}</span>%</div>
                                <div class="info">预期年收益</div>
                            </div>
                            <div class="info-box product-period-box">
                                <div class="product-period"><span class="num-family">${obj.productPeriod}</span>天</div>
                                <div class="info">期限</div>
                            </div>
                            <div class="info-box product-status-box">
                                <div class="buy-btn">抢 购</div>
                            </div>
                        </div>
                        <div class="exchange-item-info-footer">
                            <span class="buy-duration">产品募集期：${startSellDate} - ${endSellDate}</span>
                            <span class="start-amount">${startAmount}</span>
                        </div>
                </li>`;
        }
    }
);


module.exports = ExchangeItemList;