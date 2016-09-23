/**
 * 负责请求并缓存页面级的通用后端数据
 * Created by jess on 2016/9/22.
 */


const glpbCommon = require('glpb-components-common');

const $ = glpbCommon.$;

const Promise = window.Promise;

const serviceFactory = require('../../service/service-factory.js');

const userService = serviceFactory.getService('user');

function DataManager(initData){

    let data = {};

    //如果没有传, 从window上获取
    initData = initData || window.glpbTplData;

    if( initData ){
        //随着页面返回的一些后端数据
        data = $.extend( data, initData );
    }

    this._data = data;
}

$.extend( DataManager.prototype, {

    //获取当前登录用户的信息
    getUser : function(){
        let data = this._data;
        if( data.hasOwnProperty('user') ){
            return Promise.resolve( data.user );
        }
        data.user = userService.getUserInfo()
            .then( ( out ) => {
                if( out.requestStatus === userService.STATUS.SUCCESS ){
                    let res = out.data;
                    if( res.status === 0 ){
                        data.user = res.data;
                        return data.user;
                    }
                    return Promise.reject( new Error(res.message) );
                }
                return Promise.reject( new Error('请求用户信息异常') );
            } )
            .catch( (e) => {
                data.user = null;
                return Promise.reject( e );
            });
        return data.user;
    }

} );


let instance = null;

module.exports = {

    getInstance : function( initData ){
        if( instance ){
            return instance;
        }
        instance = new DataManager( initData );
        return instance;
    }

};


