/**
 * LP页面顶部的 注册区域通栏, 包含: 注册框, 通栏背景
 * Created by jess on 2016/9/22.
 */



const glpbCommon = require('glpb-components-common');

const DataManager = require('../../common/data-manager/data-manager.js');

const RegisterBox = require('../lp-register-box/lp-register-box.js');


require('./lp-register-row.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;


const tpl = __inline('./lp-register-row.tpl');


const LandingPageHeader = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_pc_lp_register_row',
        componentNameZh : 'PC-LP-注册通栏',
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
                    backgroundImage : 'http://www.we.com/cms/5788c3322fc6cb3b46b9e7e2/glpb/lp/lp-banner.jpg',
                    backgroundColor : '#f4452b',
                    backgroundPosition : 'center 0'
                },
                height : '491px',
                width : 'auto',
                padding : '0',
                margin : '0 auto'
            };
        },

        getDefaultData : function(){
            return {
                "logoImageURL_$$comment" : '公司logo图片的URL',
                logoImageURL : 'http://www.we.com/static/loadingpage/img/logo-new-two_d0e7702.png'
            };
        },

        getDefaultComponents : function(){

            return [
                {
                    componentName : 'glpb_we_com_pc_lp_register_box'
                }
            ];
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

            let components = this.components || [];
            let componentRefs = this.componentRefs;
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = this.page.createComponentInstance( config );
                if( com ){
                    com.render();
                    $content.append( com.$getElement() );
                    componentRefs.push( com );
                }else{
                    //不存在该组件
                    throw new Error(`componentName[${config.componentName}]对应的组件不存在!!`);
                }
            }

        },

        bindComponentEvent : function(){
            let that = this;
            let data = this.data || {};

            if( this.isProductionMode() && ! this.eventBinded ){
                //正式环境才绑定事件, 并且Ajax请求

                let querySign = this.querySign = utils.generateQuerySign();


            }
        },

        componentWillUnmount : function(){
            this.querySign = null;
            this.$content = null;
        }


    }
);


module.exports = LandingPageHeader;

