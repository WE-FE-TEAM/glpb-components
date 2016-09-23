/**
 * 获取用户相关的异步接口
 * Created by jess on 16/6/29.
 */







const ServiceBase = require('./../service-base');


const adapters = {};

const MOBILE_URL_PREFIX = '/pc';

const apiConf = {

    //获取单个交易所的详情
    getUserInfo: {
        url: `${MOBILE_URL_PREFIX}/ppb/user/info`,
        method: 'GET',
        dataType: 'json',
        data : {

        }
    }

};


let service = new ServiceBase( apiConf, adapters);

module.exports = service;
