/**
 * fof相关的异步接口
 * Created by qiangran on 16/12/07.
 */







const ServiceBase = require('./../service-base');


const adapters = {};

const MOBILE_URL_PREFIX = '/mo';

const apiConf = {

    getFofDetail: {
        url: `${MOBILE_URL_PREFIX}/fof/fof/product/detail`,
        method: 'GET',
        dataType: 'json',
        data : {

        }
    },



};


let utilService = new ServiceBase( apiConf, adapters);

module.exports = utilService;
