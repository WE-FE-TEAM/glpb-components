
/**
 * 请求注册相关的后端API的封装类
 * Created by 王半仙 on 16/6/13.
 */

'use strict';



const ServiceBase = require('../service-base');


const adapters = {};


const apiConf = {

    /* 注册 获取手机验证码 */

    register: {
        url: '/mo/passport/register/doRegister',
        method: 'POST',
        dataType: 'json'
    },

    smsCode: {
        url: '/mo/passport/register/getSmsCode',
        method: 'POST',
        dataType: 'json'
    },

    verifySmsCode: {
        url: '/mo/passport/register/verifySmsCode',
        method: 'GET',
        dataType: 'json'
    },

    /**获取signature*/
    getWxSignature: {
        url: '/mo/passport/wx/signature',
        method: 'GET',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;