/**
 * 轮播图
 * Created by jess on 16/8/22.
 */


'use strict';

const ComponentBase = require('../../base/base.js');

const slick = require('glpb-slick-carousel');

const utils = require('../../utils/utils.js');

require('./glpb-carousel.scss');

const $ = ComponentBase.$;

const tpl = `<div><div class="glpb-carousel-inner"></div></div>`;

const Carousel = ComponentBase.extend(
    {
        componentName : 'glpb_carousel',
        componentNameZh : '轮播图',
        componentCategory : ComponentBase.CATEGORY.UI,
        platform : ComponentBase.PLATFORM.RESPONSIVE
    },
    {
        getDefaultStyle : function(){
            return {
                height : '200px',
                width : '100%',
                margin : '0 auto'
            };
        },

        getDefaultData : function(){
            return {

                'list__$$comment' : '轮播图的配置',
                list : [
                    {
                        "imageURL_$$comment" : '要展示的图片URL地址',
                        imageURL : '//placehold.it/350x150',
                        'href__$$comment' : '点击图片要跳转的URL',
                        href : ''
                    },
                    {
                        "imageURL_$$comment" : '要展示的图片URL地址',
                        imageURL : '//placehold.it/350x150',
                        'href__$$comment' : '点击图片要跳转的URL',
                        href : ''
                    },
                    {
                        "imageURL_$$comment" : '要展示的图片URL地址',
                        imageURL : '//placehold.it/350x150',
                        'href__$$comment' : '点击图片要跳转的URL',
                        href : ''
                    }
                ],

                'setting__$$comment' : '轮播图插件的配置,一般**不用**修改!!',
                setting : {
                    infinite : true,
                    dots : false,
                    speed : 300
                }

            };
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let $el = $(tpl).addClass( cssClass ).css( this.style );
            let $content = $('.glpb-carousel-inner', $el);
            this.$el = $el;
            this.$content = $content;

        },

        bindComponentEvent : function(){
            this.updateSlick();
        },

        //渲染编辑模式下, 额外的DOM组件
        renderEditorHelper : function(){
            let $el = this.$el;
            let $editorSettingWrap = this.$getEditSettingWrap();
            $el.append($editorSettingWrap);
        },

        setStyle : function( newStyle ){
            let lastStyle = this.style;
            this.style = $.extend( {}, this.style, newStyle );

            let lastCssStyle = this.translateStyle( lastStyle );
            let newCssStyle = this.translateStyle( newStyle );

            this.$el.css( newCssStyle );
            
            if( lastCssStyle.width !== newCssStyle.width || lastCssStyle.height !== newCssStyle.height ){
                this.updateSlick();
            }
        },

        setData : function(data){
            this.data = $.extend( this.data, data );
            this.updateSlick();
        },

        updateSlick : function(){
            let data = this.data || {};
            try{
                this.$content.slick('unslick').hide();
            }catch(e){}

            this.updateDOM();
            let setting = data.setting || {};
            this.$content.show().slick({
                dots: setting.dots,
                infinite: setting.infinite,
                speed: setting.speed,
                arrows : false
            });
        },

        updateDOM : function(){
            let style = this.style;
            let data = this.data || {};
            let list = data.list || [];
            let html = '';
            for( var i = 0, len = list.length; i < len; i++ ){
                let obj = list[i];
                let href = obj.href;
                if( href ){
                    html += `<div style="width:${style.width};height:${style.height};" class="glpb-carousel-item"><a href="${href}"><img src="${obj.imageURL}" /></a></div>`;
                }else{
                    html += `<div style="width:${style.width};height:${style.height};" class="glpb-carousel-item"><img src="${obj.imageURL}" /></div>`;
                }
            }

            this.$content.html( html );
        },
        
        destroy : function(){
            this.$content.slick('unslick');
            this.data = null;
            this.$content.off();
            ComponentBase.prototype.destroy.call( this );
        }
    }
);


module.exports = Carousel;

