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

        //是否是  货币基金
        let isMoneyFund = false;

        let fundType = data.fundType;

        isMoneyFund = fundType === '4' || fundType === 'FUND_MONEY';

        let fundName = data.abbrev || data.fundName || '';
        if( fundName.length > 6 ){
            fundName = fundName.substr(0, 6) + '...';
        }

        let remarkList = data.remarkList || [];
        let tag = '';
        if( remarkList && remarkList.length > 0 ){
            tag = remarkList.join(',');
        }

        if( ! tag ){
            tag = data.remark || '';
        }

        let extraClass = '';

        let rateYearCon = '--';
        let navCon = '--';
        let label1 = '年涨跌幅';
        let label2 = '净值(元)';
        let isNewFund = true;


        if( isMoneyFund ){
            label1 = '七日年化收益率';
            label2 = '万份收益(元)';

            if( data.rate7day ){
                isNewFund = false;
                rateYearCon = `${data.rate7day}<span class="year-rise-span">%</span>`;

                let rate7day = parseFloat( data.rate7day );
                if( rate7day < 0 ){
                    extraClass = 'fund-item-bad';
                }
            }

            if( data.profit10k ){
                isNewFund = false;
                navCon = `${data.profit10k}<span class="year-net-span"></span>`;
            }



        }else{

            if( data.rateYear ){
                isNewFund = false;
                rateYearCon = `${data.rateYear}<span class="year-rise-span">%</span>`;
                
                let rateYear = parseFloat( data.rateYear );
                if( rateYear < 0 ){
                    extraClass = 'fund-item-bad';
                }
            }
            if( data.nav ){
                isNewFund = false;
                navCon = `${data.nav}<span class="year-net-span"></span>`;
            }
            
        }

        let btnText = '申购';

        if( isNewFund ){
            btnText = '认购';
            extraClass += ' fund-item-new';
        }


        let html = `<h1 class="fund-name ">${fundName}<span class="fund-code">(${data.fundCode})</span><span class="fund-span">${ tag }</span></h1>
                <ul class="fund-content fn-clear ${extraClass}">
                    <li class="fund-info info1">
                        <p class="year-rise">${ rateYearCon }</p>
                        <p class="rise-text">${ label1 }</p>
                    </li>
                    <li class="fund-info info2">
                        <p class="year-net">${ navCon }</p>
                        <p class="rise-text">${ label2 }</p>
                    </li>
                </ul>
                <div class="fund-buy-btn" id="gio-trick-${data.fundCode}">${btnText}</div>
                `;

        this.$el.html( html ).addClass('glpb-fund-sug-theme-3').show();
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
            source : this.source,
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

