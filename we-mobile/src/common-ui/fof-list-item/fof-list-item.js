/**
 *  渲染组合基金列表中的一个基金
 * Created by qiangran on 2016/12/07.
 */


const glpbCommon = require('glpb-components-common');

const serviceFactory = require('../../service/service-factory.js');

const bridgeXXX = require('../../bridgeXXX/bridgeXXX.js');

require('./fof-list-item.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utilService = serviceFactory.getService('util');


function FofListItem(args){

    this.source = args.source || '';

    this.fofData = null;

    this.$el = null;

}


$.extend( FofListItem.prototype, {

    $getElement : function(){
        return this.$el;
    },

    render : function(){

        let $el = $('<div class="glpb-ui-fof-list-item"></div>');

        this.$el = $el;
    },

    setFofData : function( data ){

        if( ! data ){
            return;
        }
        this.fofData = data;
        let riskText="未评测",textClass;


        let riskLevel = data.riskLevel;

        let yearlyReturn = data.yearlyReturn;

        let poStatus = data.poStatus;

        if(1 == riskLevel){
            riskText = "保守型";
        }else if(2 == riskLevel){
            riskText = "稳健型";
        }else if(3 == riskLevel){
            riskText = "积极型";
        }

        yearlyReturn = yearlyReturn?parseFloat(yearlyReturn).toFixed(2):"--";
        if(yearlyReturn>0){
            textClass=" year-rate year-rate-rise";
        }else{
           textClass="year-rate year-rate-sub";
        }

        let html =`<div class="glpb-ui-title">
                        <div class="type">${riskText}</div> <div class="name">${data.poName}</div>
                    </div>
                    <div class="glpb-ui-content">
                         <div class="year-rate-wrp">
                                <div class="${textClass}">${yearlyReturn}<span>%</span></div>
                                <div class="year-rate-text">年化收益率</div>
                         </div>
                         <div class="desc-wrp">
                                <div class="desc-big">${data.copy_desc_long}</div>
                                <div class="desc-small">${data.copy_desc_short}</div>
                         </div>
                     </div>
                     <div class="button">申购</div>

                    `;

        this.$el.html( html ).addClass('glpb-fund-sug-theme-3').show();
    },

    bindEvent : function(){

        this.$el.on('click', () => {
            this.buyFof();
        });
    },

    buyFof(){

        let fofData = this.fofData;

        if( ! fofData ){
            return;
        }

        let poCode = fofData.poCode;

        utilService.recordLog({
            source : this.source,
            subsource : poCode
        }).finally( () => {
            bridgeXXX.showFundDetailPage(poCode);
        });
    },

    destroy(){

        this.$el.off();
        this.$el.remove();
        this.$el = null;
    }


} );



module.exports = FofListItem;

