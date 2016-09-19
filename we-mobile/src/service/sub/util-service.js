/**
 * 工具类服务接口封装
 * Created by wangcheng on 16/6/16.
 */





const ServiceBase = require('./../service-base');


const adapters = {};

const MOBILE_URL_PREFIX = '/3.0';

const apiConf = {

    recordLog: {
        url: `${MOBILE_URL_PREFIX}/about/recordlog`,
        method: 'GET',
        dataType: 'json',
        data : {
            t : ( new Date()).getTime(),
            version : '2.0',
            clientVersion : '30200'
        }
    }

};


let utilService = new ServiceBase( apiConf, adapters);

module.exports = utilService;
