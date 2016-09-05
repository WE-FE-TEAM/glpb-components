/**
 * 交易所(定期理财)产品的列表
 * Created by jess on 16/9/5.
 */


'use strict';

const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

require('./exchange-item-list.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;

const exchangeService = serviceFactory.getService('exchange');


const tpl = `<div><ul class="glpb-exchange-list"></ul></div>`;

const ExchangeItemList = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_exchange_item_list',
        componentNameZh : '交易所产品列表',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.MOBILE
    },
    {
        getDefaultStyle : function(){
            return {

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
            let $el = $(tpl).addClass( cssClass );
            let $content = $('.glpb-exchange-list', $el);
            $content.css( cssStyle );
            this.$el = $el;
            this.$content = $content;

            
        },

        updateCSSStyle : function(style){

            this.$content.css( style );
        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};
            let exchangeIdList = data.exchangeIdList || [];
            if( ! this.isEditMode() && ! this.eventBinded && exchangeIdList.length > 0 ){
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
            return `<li class="glpb-exchange-list-item" data-exchange-id="${obj.id}">
                        
                </li>`;
        }
    }
);


module.exports = ExchangeItemList;