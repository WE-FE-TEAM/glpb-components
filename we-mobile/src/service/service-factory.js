/**
 * 维护所有的service的工厂
 * Created by 王半仙 on 16/6/13.
 */





const passportService = require('./sub/passport-service');
const utilService = require('./sub/util-service');

const fundService = require('./sub/fund-service.js');
const exchangeService = require('./sub/exchange-service.js');
const fofService = require('./sub/fof-service.js');

let serviceMap = {
    passport : passportService,
    util : utilService,
    fund : fundService,
    exchange : exchangeService,
    fof:fofService

};

let singleton = {

    getService : function(name){
        return serviceMap[name];
    }

};



module.exports = singleton;