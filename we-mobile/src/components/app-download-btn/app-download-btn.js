/**
 * 移动端的 APP 下载按钮, 可以设置 :hover 的样式
 * 如果本地已经安装了APP, 直接打开; 否则跳转到对应的应用市场
 * Created by jess on 2016/10/8.
 */


const glpbCommon = require('glpb-components-common');


const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;


require('./app-download-btn.scss');


const tpl = `<div class="glpb-fn-animate-item"><span class="glpb-content"></span></div>`;


var ua = navigator.userAgent;

var platform = {
    // android终端或者uc浏览器
    android: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
    androidVersion : 0,
    // 是否为iPhone或者QQHD浏览器
    iPhone: ua.indexOf('iPhone') > -1 ,
    // 是否iPad
    iPad: ua.indexOf('iPad') > -1,
    //ios version
    iosVersion : 0,
    //windows phone
    wPhone: ua.indexOf('Windows Phone') > -1,
    //是否在 微信 客户端内
    isWeixin : ua.indexOf('MicroMessenger') > -1
};

var out = /iPhone OS (\d+)/.exec(ua);

if(  out ){
    platform.iosVersion = parseInt(out[1], 10);
}else if( out = /Android (\d+)/.exec(ua) ){
    platform.androidVersion = parseInt( out[1], 10 );
}

var browserHidden = function () {
    if (typeof document.hidden !== 'undefined') {
        return document.hidden;
    } else if (typeof document.mozHidden !== 'undefined') {
        return document.mozHidden;
    } else if (typeof document.msHidden !== 'undefined') {
        return document.msHidden;
    } else if (typeof document.webkitHidden !== 'undefined') {
        return document.webkitHidden;
    }

    return false;
};

//下面代码来自网络,创建一个iframe,延迟后判断是否页面跳转了
function callNative(url, callback){
    if (!url) {
        return;
    }
    var node = document.createElement('iframe');
    node.style.display = 'none';
    var body = document.body;
    var timer;
    var clear = function(evt, isTimeout) {
        (typeof callback==='function') &&  callback(isTimeout);
        window.removeEventListener('pagehide', hide, true);
        //                window.removeEventListener('pageshow', hide, true);
        if (!node) {
            return;
        }

        node.onload = null;
        body.removeChild(node);
        node = null;

    };
    var hide = function(e){
        clearTimeout(timer);
        //alert('page hide');
        clear(e, false);
    };
    window.addEventListener('pagehide', hide, true);

    if( platform.iosVersion >= 9 ){
        node = null;
        location.href = url;

    }else{
        //                window.addEventListener('pageshow', hide, true);
        node.onload = clear;
        node.src = url;
        body.appendChild(node);
    }


    var now = +new Date();

    timer = setTimeout(function(){
        timer = setTimeout(function(){
            var newTime = +new Date();
            var duration = newTime - now;
            //                    alert('间隔时间:' + duration + '; browserHidden:' + browserHidden() );
            if( duration > 3000){
                clear(null, false);
            }else if( ! browserHidden() ){

                clear(null, true);
            }

        }, 1200);
    }, 60);
}

//Android下,异步获取APK下载地址并跳转
function downloadAndroid(){
    var xhr = new XMLHttpRequest();
    var seachconf = utils.getSearchConf();
    var ccName = seachconf.ccName || 'rrdweb';

    xhr.open('GET', '/3.0/about/geturl?ccName='+ encodeURIComponent(ccName) +'&version=2.0');
    xhr.onreadystatechange = function(){
        if( xhr.readyState === 4 ){
            if( xhr.status === 200 ){
                try{
                    var out = JSON.parse(xhr.responseText);
                }catch(e){
                    out = {
                        status : -1,
                        msg : '解析结果失败'
                    };
                }
                if( out && out.status === 0 && out.data && out.data.url ){
                    location.href =  out.data.url;
                }else{
                    alert('服务器异常,请稍后再试');
                }
            }else{
                alert('服务器异常,请稍后再试');
            }
        }
    };
    xhr.send();
}

function downloadApp(){
    var YING_YONG_BAO_URL = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.renrendai.finance';
    var appStoreURL = 'https://itunes.apple.com/cn/app/id883561142';
    var androidDownloadURL = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.renrendai.finance';
    var IOS_SCHEMA = 'renrendaiInvestment://';
    var ANDROID_SCHEMA = 'wefinance://';

    var search = location.search.substring(1);

    var nativeSchema = ANDROID_SCHEMA;
    //var finalDownloadURL = androidDownloadURL;
    var finalDownloadURL = '';

    if( platform.wPhone ){
        alert('抱歉，暂不支持您的设备');
        return;
    }

    if( platform.iPhone || platform.iPad ){
        nativeSchema = IOS_SCHEMA;
        finalDownloadURL = appStoreURL;
    }

    if( platform.isWeixin ){
        nativeSchema = null;
        //finalDownloadURL = YING_YONG_BAO_URL;

        var androidURL = '//m.we.com/cms/577cdedf61e15053267301af/glpb-we/android.png';
        var iosURL = '//m.we.com/cms/577cdedf61e15053267301af/glpb-we/ios.png';

        var finalURL = iosURL;

        if( platform.android ){
            finalURL = androidURL;
        }

        $(`<div style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #fff; z-index: 9999;"><img src="${finalURL}" style="display:block; width: 7.5rem; height: auto;" /></div>`).appendTo( document.body );

        return;
    }


    //临时关闭打开APP的策略
    nativeSchema = '';

    if( nativeSchema ){
        //先尝试调起本地APP
        //alert('callNative:' + nativeSchema);
        callNative( nativeSchema, function(isTimeout){
            if( isTimeout ){
                setTimeout(function(){
                    if( platform.android ){
                        downloadAndroid();
                    }else{
                        location.href = finalDownloadURL;
                    }

                },0);
            }
        } );

    }else{
        if( platform.android && ! platform.isWeixin ){
            downloadAndroid();
        }else{
            location.href = finalDownloadURL;
        }
    }

}

const LinkButton = BaseComponent.extend(
    {
        componentName : 'glpb_app_download_button',
        componentNameZh : 'APP下载按钮',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.MOBILE,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                position : 'relative',
                height : '88px',
                width : '80%',
                padding : '0',
                margin : '0 auto',
                fontSize : 'inherit',
                lineHeight : '88px',
                'color|>[DOT]glpb-content' : '#000',
                'color|>[DOT]glpb-content:hover' : '#000',
                background : {
                    backgroundColor : 'transparent'
                },
                'background|:hover' : {
                    backgroundColor : 'transparent'
                },
                textAlign : 'center',
                animation : 'none',
                textDecoration : 'none',
                borderRadius : '5px',
                zIndex : 10
            };
        },

        getDefaultData : function(){
            return {
                "href_$$comment" : '要跳转的URL地址',
                href : '#',
                'title__$$comment' : '鼠标移动到按钮上时,显示的文字',
                title : '',
                'target_$$comment' : '新页面打开方式: _blank(新tab页); _self(当前页)',
                target : '_blank',
                'text_$$comment' : '按钮上显示的文字',
                text : '按钮文字'
            };
        },

        getDataType : function(){
            return BaseComponent.DATA_TYPES.JSON;
        },

        getData : function(){
            return this.data || {};
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass );
            let $content = $('.glpb-content', $el);
            this.$el = $el;
            this.$content = $content;

            // $content.css( cssStyle );
            this.updateCSSStyle( cssStyle );

            this.setData( data );

        },

        updateCSSStyle : function(cssStyle){
            this.styleManager.update( '#' + this.componentId , cssStyle );
            // this.$content.css( style );
        },

        setData : function(data){
            this.data = $.extend( this.data, data );

            data = this.data;
            this.$content.attr({
                title : data.title || '',
                href : data.href || ''
            }).html( data.text );
        },

        bindComponentEvent : function(){
            
            let that = this;
            
            if( this.isProductionMode() && ! this.eventBinded ){
                
                this.eventBinded = true;
                
                this.$content.on('click', downloadApp );
            }
        },

        componentWillUnmount : function(){
            if( this.eventBinded ){
                this.$content.off('click', downloadApp );
            }
            this.$content = null;
        }
    }
);


module.exports = LinkButton;

