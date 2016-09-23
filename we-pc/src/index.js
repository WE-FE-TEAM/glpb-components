/**
 * Created by jess on 16/8/19.
 */




const glpbCommon = require('glpb-components-common');

const BaseComponent = glpbCommon.BaseComponent;

const DataManager = require('./common/data-manager/data-manager.js');

const ExchangeItemList = require('./components/exchange-item-list/exchange-item-list.js');

const LandingPageHeader = require('./components/lp-header/lp-header.js');

const LandingPageRegisterBox = require('./components/lp-register-box/lp-register-box.js');

const LandingPageRegisterRow = require('./components/lp-register-row/lp-register-row.js');







module.exports = {
    DataManager,
    ExchangeItemList,
    LandingPageHeader,
    LandingPageRegisterBox,
    LandingPageRegisterRow
};