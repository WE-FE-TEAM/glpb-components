/**
 * Created by jess on 16/8/19.
 */




const glpbCommon = require('glpb-components-common');

const BaseComponent = glpbCommon.BaseComponent;

const DataManager = require('./common/data-manager/data-manager.js');

const ExchangeItemList = require('./components/exchange-item-list/exchange-item-list.js');

const LandingPageHeader = require('./components/lp-header/lp-header.js');







module.exports = {
    DataManager,
    ExchangeItemList,
    LandingPageHeader
};