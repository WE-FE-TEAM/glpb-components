/**
 * LP页面 注册框 
 * Created by jess on 2016/9/22.
 */



const glpbCommon = require('glpb-components-common');

const DataManager = require('../../common/data-manager/data-manager.js');

const GForm = require('../../common/form/form.js');


require('./lp-register-box.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;

const Cookies = glpbCommon.Cookies;

const TextInput = GForm.TextInput;
const RandCodeImage = GForm.RandCodeImage;
const Checkbox = GForm.Checkbox;


const tpl = __inline('./lp-register-box.tpl');


const LandingPageHeader = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_pc_lp_register_box',
        componentNameZh : 'PC-LP-注册框',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.PC,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                height : '440px',
                width : '350px',
                padding : '0',
                margin : '0 auto'
            };
        },

        getDefaultData : function(){
            return {
                "logoImageURL_$$comment" : '公司logo图片的URL',
                logoImageURL : 'http://www.we.com/static/loadingpage/img/logo-new-two_d0e7702.png',
                promotion : '',
                inviteCode : '',
                type : '',
                intention : 'LENDER',
                submitText : '注册领红包',
                submitBtnTheme: 'blue',
                boxBackgroundColor : '#fff',
                boxBackgroundOpacity : '.8'
            };
        },

        init : function(){
            //当前Ajax请求的ID
            this.querySign = null;
            //是否已经绑定了组件自定义事件
            this.eventBinded = false;

            this.handleStep1Submit = this.handleStep1Submit.bind( this );

            //获取promotion和inviteCode
            let searchConf = utils.getSearchConf();

            let data = this.data;

            if( ! data.promotion ){
                let promotion = searchConf.promotion || searchConf.utmSource || '';

                if( ! promotion || ! /[-a-zA-Z0-9?=_/]{1,128}/.test(promotion) ){
                    //从 promotion_source  这个cookie中读取
                    promotion = Cookies.get('promotion_source', { path: '/' });
                }

                data.promotion = promotion || '';
            }

            if( data.promotion ){
                //写入cookie中
                Cookies.set('promotion_source', data.promotion, { path: '/', expires : 365 });
            }

            if( ! data.inviteCode ){
                data.inviteCode = searchConf.inviteCode || '';
            }
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );
            let $content = $('.glpb-content', $el);

            this.$el = $el;
            this.$boxBg = $el.find('.reg-box-bg');
            this.$content = $content;
            this.$stepContainer = $content.find('.step-container');
            this.$step1 = this.$stepContainer.find('.step-1');
            this.$step2 = this.$stepContainer.find('.step-2');


            this.renderStep1();

            this.updateForm();

        },

        renderStep1 : function(){

            let form = new GForm({
                method : 'post',
                action : '/rrdRegist!beforeRegist.action',
                onSubmit : this.handleStep1Submit
            });

            form.render();

            this.form = form;

            //添加各个输入框子项
            let errorClass = 'validate-error-con';

            //昵称
            let nickNameProps = {
                name : 'nickName',
                id : 'nickName',
                className : 'nick-name-con register-item-con',
                errorClass : errorClass,
                isShowError : true,
                placeholder : '输入昵称',
                validate : {
                    blur : [ 'required', 'isNickName', 'isHasUnderlineFrontEnd', 'isNickNameLength', 'isHasYX', 'isNicknameAvailable' ]
                },
                children : '<span class="register-icon "></span>'
            };

            //手机号
            let phoneProps = {
                name : 'username',
                id : 'phone',
                className : 'mobile-phone-con register-item-con',
                errorClass : errorClass,
                placeholder : '输入手机号码',
                validate : {
                    blur : [ 'required', 'isMobile', 'isMobileAvailable' ]
                },
                children : '<span class="register-icon "></span>'
            };

            //密码
            let passwrodProps = {
                type : 'password',
                name : 'password',
                id : 'password',
                className : 'password-con register-item-con',
                errorClass : errorClass,
                placeholder : '输入密码',
                validate : {
                    blur : [ 'required',
                        'isPassWord',
                        'isPassNotAllNum',
                        'isPassNotRepeat',
                        {
                            fn : 'minlength',
                            message : 'minPswLength',
                            args : 6
                        },
                        {
                            fn : 'maxlength',
                            message : 'maxPswLength',
                            args : 16
                        }
                    ]
                },
                children : '<span class="register-icon "></span>'
            };

            //验证码
            let randCodeProps = {
                name : 'randCode',
                id : 'randCode',
                className : 'rand-code-con ',
                errorClass : errorClass,
                placeholder : '验证码',
                validate : {
                    blur : [ 'required',
                        {
                            fn : 'isLengthEqual',
                            message : 'phoneCodeMsgLength',
                            args : 4
                        }
                    ]
                }
            };

            //验证码图片组件
            let codeImageProps = {
                className : 'code-image-con'
            };

            //单选框
            let checkboxProps = {
                name : 'agree',
                label : '我已阅读并同意',
                className : 'register-agree-con',
                errorClass : errorClass,
                checked : true,
                validate : {
                    change : [ {
                        fn : 'isChecked',
                        message : 'agree'
                    } ]
                },
                children : '<a href="/agreement/rv_webservice.html" target="_blank">《人人贷WE理财注册服务协议》</a>'
            };

            let $formElement = form.$getElement();

            //昵称
            let nickInput = new TextInput( nickNameProps );
            nickInput.render();
            form.addInputItem( nickInput );
            $formElement.append( nickInput.$getElement() );

            //手机号
            let mobileInput = new TextInput( phoneProps );
            mobileInput.render();
            form.addInputItem( mobileInput );
            $formElement.append( mobileInput.$getElement() );

            //密码
            let passInput = new TextInput( passwrodProps );
            passInput.render();
            form.addInputItem( passInput );
            $formElement.append( passInput.$getElement() );

            //验证码输入框
            let randCodeInput = new TextInput( randCodeProps );
            randCodeInput.render();
            form.addInputItem( randCodeInput );
            
            //验证码图片
            let randCodeImg = new RandCodeImage( codeImageProps );
            randCodeImg.render();
            form.addComponentItem( randCodeImg );

            let $randCon = $('<div class="register-item-con phone-code-wrap fn-clear clearfix"></div>');
            
            $randCon.append( randCodeInput.$getElement() );
            $randCon.append( randCodeImg.$getElement() );

            form.addElementItem( $randCon );

            //注册协议单选框
            let checkbox = new Checkbox( checkboxProps );
            checkbox.render();
            form.addInputItem( checkbox );
            let $itemBlock = $('<div class="register-item-con agreement-wrap"></div>');
            $itemBlock.append( checkbox.$getElement() );

            form.addElementItem( $itemBlock );

            //提交按钮和其他隐藏域
            let data = this.data;
            let submitText = data.submitText || '注册领红包';
            
            let html = `<div><input type="hidden" name="lpjumptoreg" value="1" />
                    <input type="hidden" name="type" value="${data.type}" />
                    <input type="hidden" name="intention" value="${data.intention}" />
                    <input type="hidden" name="promotion" value="${data.promotion}" />
                    <input type="hidden" name="inviteCode" value="${data.inviteCode}" />
                    <input type="submit" class="submit-btn" value="${submitText}" /></div>`;

            let $remain = $(html);

            this.$submitBtn = $remain.find('.submit-btn');

            form.addElementItem( $remain );

            this.$step1.append( form.$getElement() );
        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};

            this.form.bindEvent();

            if( this.isProductionMode() && ! this.eventBinded ){
                //正式环境才绑定事件, 并且Ajax请求

                let querySign = this.querySign = utils.generateQuerySign();


            }
        },

        handleStep1Submit : function(){},

        setData : function(data){
            this.data = $.extend( this.data, data );

            this.updateForm();
        },

        updateForm : function(){
            let data = this.data;

            this.$boxBg.css({
                backgroundColor : data.boxBackgroundColor,
                opacity : data.boxBackgroundOpacity
            });

            this.$submitBtn.val( data.submitText || '注册领红包' );

            let submitBtnClass = '';

            switch( data.submitBtnTheme ){
                case 'blue':
                    submitBtnClass = 'submit-blue';
                    break;
                default:
                    submitBtnClass = 'submit-blue';
                    break;
            }

            this.$submitBtn.attr('class', 'submit-btn ' + submitBtnClass );
        },

        componentWillUnmount : function(){
            this.form.destroy();
            this.form = null;
            this.querySign = null;
            this.$content = null;
        }


    }
);


module.exports = LandingPageHeader;

