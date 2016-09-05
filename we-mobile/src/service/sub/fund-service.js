/**
 * 基金相关的异步接口
 * Created by jess on 16/6/29.
 */



"use strict";



const ServiceBase = require('./../service-base');


const adapters = {};

const MOBILE_URL_PREFIX = '/mo';

const apiConf = {

    getFundDetail: {
        url: `${MOBILE_URL_PREFIX}/fund/fund/product/detail`,
        method: 'GET',
        dataType: 'json',
        data : {

        }
    }

};


let utilService = new ServiceBase( apiConf, adapters);

module.exports = utilService;
