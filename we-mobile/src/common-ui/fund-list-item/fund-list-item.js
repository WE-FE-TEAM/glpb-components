/**
 *  渲染基金列表中的一个基金
 * Created by jess on 2016/10/25.
 */


const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

const bridgeXXX = require('../../bridgeXXX/bridgeXXX.js');

require('./fund-list-item.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utilService = serviceFactory.getService('util');


function FundListItem(args){

    this.source = args.source || '';

    this.fundData = null;

    this.$el = null;

}


$.extend( FundListItem.prototype, {

    $getElement : function(){
        return this.$el;
    },

    render : function(){

        let $el = $('<div class="glpb-ui-fund-list-item"></div>');

        this.$el = $el;
    },

    setFundData : function( data ){

        if( ! data ){
            return;
        }

        this.fundData = data;

        let fundName = data.fundName || '';
        if( fundName.length > 10 ){
            fundName = fundName.substr(0, 10) + '...';
        }

        let remarkList = data.remarkList || [];
        let tag = '';
        if( remarkList && remarkList.length > 0 ){
            tag = remarkList[0];
        }

        if( ! tag ){
            tag = data.remark || '';
        }


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

        this.$el.html( html ).addClass('glpb-fund-sug-theme-2').show();
    },

    bindEvent : function(){

        this.$el.on('click', () => {
            this.buyFund();
        });
    },

    buyFund(){

        let fundData = this.fundData;

        if( ! fundData ){
            return;
        }

        let fundCode = fundData.fundCode;

        utilService.recordLog({
            source : 'zhinang',
            subsource : fundCode
        }).finally( () => {
            bridgeXXX.showFundDetailPage(fundCode);
        });
    },

    destroy(){

        this.$el.off();
        this.$el.remove();
        this.$el = null;
    }


} );



module.exports = FundListItem;

