/**
 * LP页面顶部的header区域
 * Created by jess on 2016/9/22.
 */



const moment = require('moment');

const numeral = require('numeral');

const glpbCommon = require('glpb-components-common');

const DataManager = require('../../common/data-manager/data-manager.js');


require('./lp-header.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;


const tpl = `<div><div class="glpb-content"></div></div>`;


const LandingPageHeader = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_pc_lp_header',
        componentNameZh : 'PC-LP-header',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.PC,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                background : {
                    backgroundColor : '#fff'
                },
                height : '100px',
                width : 'auto',
                padding : '0',
                margin : '0 auto'
            };
        },

        getDefaultData : function(){
            return {
                "logoImageURL_$$comment" : '公司logo图片的URL',
                logoImageURL : 'http://www.we.com/static/loadingpage/img/logo-new-two_d0e7702.png',
                logoImageWidth : '517px',
                logoImageHeight : '49px',
                logoImageTop : '36px'
            };
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
            this.eventBinded = false;
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );
            let $content = $('.glpb-content', $el);

            this.$el = $el;
            this.$content = $content;
            
            let html = `<a href="/"><img style="width:${data.logoImageWidth}; height:${data.logoImageHeight}; margin-top:${data.logoImageTop};" class="we-logo" src="${data.logoImageURL}" alt="logo" /></a>
<div class="we-contact">
<span class="user-abs">已有账号？<a href="/loginPage.action">立即登录</a></span>
<strong class="contact-us">400-090-6600</strong>
</div>
`;

            $content.html( html );

            this.$userAbs = $content.find('.user-abs');

        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};
            let exchangeIdList = data.exchangeIdList || [];
            if( this.isProductionMode() && ! this.eventBinded && exchangeIdList.length > 0 ){
                //正式环境才绑定事件, 并且Ajax请求
                let dataManager = DataManager.getInstance();

                let querySign = this.querySign = utils.generateQuerySign();

                dataManager.getUserInfo( )
                    .then( ( user ) => {

                        if( querySign !== that.querySign ){
                            return;
                        }

                        if( user ){
                            //当前用户已登录
                            let html = `您好，<a href="/pc/user/account/home/myAccount">${user.displayName}</a>`;
                            that.$userAbs.html( html );
                        }
                    })
                    .catch( (e) => {
                        console.warn( e );
                    });
            }
        },

        componentWillUnmount : function(){
            this.querySign = null;
            this.$userAbs = null;
            this.$content = null;
        }


    }
);


module.exports = LandingPageHeader;

