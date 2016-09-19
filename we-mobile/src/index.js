/**
 * Created by jess on 16/8/19.
 */




const glpbCommon = require('glpb-components-common');

const BaseComponent = glpbCommon.BaseComponent;

const bridgeXXX = require('./bridgeXXX/bridgeXXX.js');

const Swiper = require('./lib/swiper/swiper.js');

const ExchangeItemList = require('./components/exchange-item-list/exchange-item-list.js');

const FundItemList = require('./components/fund-item-list/fund-item-list.js');

const SwiperItem = require('./components/swiper-item/swiper-item.js');

const SwiperContainer = require('./components/swiper-container/swiper-container.js');







module.exports = {
    bridgeXXX,
    Swiper,
    ExchangeItemList,
    FundItemList,
    SwiperItem,
    SwiperContainer
};