/**
 * 基金相关的异步接口
 * Created by jess on 16/6/29.
 */







const ServiceBase = require('./../service-base');


const adapters = {};

const MOBILE_URL_PREFIX = '/pc';

const apiConf = {

    getFundDetail: {
        url: `${MOBILE_URL_PREFIX}/fund/fund/product/detail`,
        method: 'GET',
        dataType: 'json',
        data : {

        }
    },

    //批量获取多个基金的详情, 用于基金列表页的显示
    getListBatchDetail : {
        url: `${MOBILE_URL_PREFIX}/fund/fund/listBatchDetail`,
        method: 'GET',
        dataType: 'json',
        data : {

        }
    }

};


let utilService = new ServiceBase( apiConf, adapters);

module.exports = utilService;
