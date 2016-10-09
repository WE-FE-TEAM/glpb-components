/**
 * 用于 hybrid 中,和 native 通信的封装
 * Created by jess on 16/1/28.
 */




var _ = require('underscore');


function noop(){}

var bridge = null;

//是否已经绑定了native的事件
var isReadyBind = false;
//是否已经和native首次注册成功的
var isBridgeReady = false;
var readyCallbackQueue = [];

let userAgent = navigator.userAgent || '';
let out = /WEAPP\/(\d+)/i.exec(userAgent);
let isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
let isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

//是否在WE理财APP内
let isWeAPP = false;
//当前WE理财APP的版本号
let weAppVersion = 0;

if( out ){
    weAppVersion = parseInt( out[1], 10  );
    isWeAPP = true;
}


function bridgeReady( handle ){
    isBridgeReady = true;
    bridge = handle;

    //处理ready队列中的所有回调
    while( readyCallbackQueue.length > 0 ){
        var callback = readyCallbackQueue.shift();
        callback();
    }
}


var bridgeXXX = {

    //当前页面是否在 WE理财APP 内部加载
    isInWeAPP : function(){
        return isWeAPP;
    },

    getAppVersion : function(){
        return weAppVersion;
    },

    init : function(){

        var callback = noop;

        //IOS 4.3以上版本需要执行以下初始化代码
        if(weAppVersion >= 40300 && isIOS){
            if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
            if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }

            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
        }
        bridgeXXX.ready( noop );
    },

    ready : function( callback ){

        if( ! _.isFunction(callback) ){
            return;
        }

        if( isBridgeReady ){
            return callback();
        }

        readyCallbackQueue.push( callback );

        if( window.WebViewJavascriptBridge ){
            bridgeReady( window.WebViewJavascriptBridge );
        }else if( ! isReadyBind ){
            isReadyBind = true;
            //注册native触发的事件
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                bridgeReady( window.WebViewJavascriptBridge );
            }, false);
        }

    },

    /**
     * 初始化页面的分享功能,需要提前把分享的所有图片地址传给native,让native开始提前下载好
     * @param data {Array}  [ 'xxx', 'http:/ssss.jpg' ]
     */
    setShareData : function( data ){
        if( ! _.isArray(data) ){
            console.error('bridgeXXX.setShareData 参数必须是 Array ');
            return;
        }
        bridgeXXX.ready( function(){
            try{
                bridge.callHandler('clientShareImg', JSON.stringify( data ));
            }catch(e){

            }
        } );
    },

    //打开APP的注册页
    showRegisterPage : function(){
        try {
            return bridge.callHandler('clientRegister');
        } catch (_error) {}
    },

    //打开APP的登陆页
    showLoginPage : function(){
        try {
            return bridge.callHandler('clientLogin');
        } catch (_error) {}
    },

    //打开Home
    showHomePage : function(){
        try {
            return bridge.callHandler('clientHome');
        } catch (_error) {}
    },

    /**
     * 通过APP分享
     * @param data {Object}
     * @param data.title {String}
     * @param data.desc {String}
     * @param data.img_url {String} 分享出去的小图片URL
     * @param data.link {String} 分享的链接
     * @returns {*}
     */
    share : function( data ){
        try {
            return bridge.callHandler('clientShare', JSON.stringify({
                title: data.title,
                desc: data.desc,
                img: data.img_url,
                url: data.link
            }));
        } catch (_error) {
            return false;
        }
    },

    /**
     * 通过APP分享,这个是带回调的，避免对旧版本app产生影响，新加一个方法
     * @param data {Object}
     * @param data.title {String}
     * @param data.desc {String}
     * @param data.img_url {String} 分享出去的小图片URL
     * @param data.link {String} 分享的链接
     * @returns {*}
     */
    shareWithCallback : function( data , callback ){
        try {
            return bridge.callHandler('clientShare', JSON.stringify({
                title: data.title,
                desc: data.desc,
                img: data.img_url,
                url: data.link
            }),function(response){
                if(typeof callback === 'function'){
                    callback(response);
                }
            });
        } catch (_error) {
            return false;
        }
    },


    /**
     * 打开 基金列表页
     * @returns {*}
     */
    showFundListPage : function(){
        try {
            return bridge.callHandler('jumpAPPViewModule', JSON.stringify({
                module: "QJFund",
                page: "list"
            }));
        } catch (_error) {}
    },

    /**
     * 打开 基金详情页
     * @param fundCode {String} 基金code
     * @returns {*}
     */
    showFundDetailPage : function( fundCode ,name ){
        name = name || "基金详情";
        try {
            return bridge.callHandler('jumpAPPViewModule', JSON.stringify({
                module: "QJFund",
                page: "detail",
                parameter: {code:fundCode,name:name}
            }));
        } catch (_error) {}
    },

    /**
     * 设置APP 顶部横条的标题
     * @param title {String} 标题
     * @returns {*}
     */
    setAppTitle : function( title ){
        title = title || "标题";
        try {
            return bridge.callHandler('setTitle', title);
        } catch (_error) {
            console.log(_error);
            alert(_error);
        }
    },

    /**
     * 调用APP 右上角完成按钮
     * @returns {*}
     */
    setTapComplete : function( ){
        try {
            return bridge.callHandler('tapComplete');
        } catch (_error) {
            console.log(_error);
        }
    },

    setRiskLevel : function (data) {
        try {
            return bridge.callHandler('setRiskLevel',
                JSON.stringify([
                    data.riskLevel.toString(),
                    data.questionTag,
                    data.score1.toString(),
                    data.score2.toString(),
                    data.answer
                ])
            );
        } catch (_error) {
            console.log(_error);
        }
    },

    /**
     * 打开APP的交易所详情页
     * @param productId {string} 交易所资产ID
     */
    showExchangeDetailPage : function( productId ){
        let url = 'renrendaiInvestment://app.we.com/exchange/detail?productNo=' + encodeURIComponent( productId );
        location.href = url;
    },

    /**
     * 打开APP的U计划列表页
     * @returns {*}
     */
    showUplanListPage : function(){
        let url = 'renrendaiInvestment://app.we.com/uplan/list';
        location.href = url;
    },

    /**
     * 打开APP的U计划详情页
     * @param productId {string} U计划ID
     * @returns {*}
     */
    showUplanDetailPage : function( productId ){
        let url = 'renrendaiInvestment://app.we.com/uplan/detail?fid=' + encodeURIComponent( productId );
        location.href = url;
    },


    /**
     * 打开APP的保险列表页
     * @returns {*}
     */
    showInsuranceListPage : function(){
        let url = 'renrendaiInvestment://app.we.com/insurance/list';
        location.href = url;
    },

    /**
     * 打开APP的保险详情页
     * @param productId {string} 保险ID
     * @returns {*}
     */
    showInsuranceDetailPage : function( productId ){
        let url = 'renrendaiInvestment://app.we.com/insurance/detail?showProductId=' + encodeURIComponent( productId );
        location.href = url;
    },

    /**
     * 打开APP的保险角色选择页
     * @returns {*}
     */
    showInsuranceRoleSelectPage : function(){
        let url = 'renrendaiInvestment://app.we.com/insurance/role';
        location.href = url;
    },

    /**
     * 打开APP的保险推荐列表页
     * @returns {*}
     */
    showInsuranceRecommendListPage : function(){
        let url = 'renrendaiInvestment://app.we.com/insurance/recommend';
        location.href = url;
    },

    /**
     * 打开APP的新手专区页
     * @returns {*}
     */
    showNewAreaPage : function(){
        let url = 'renrendaiInvestment://app.we.com/newArea';
        location.href = url;
    }

};



module.exports = bridgeXXX;