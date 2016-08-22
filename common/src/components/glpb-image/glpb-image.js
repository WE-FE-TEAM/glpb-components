/**
 * 代表一个 <img /> 元素
 * Created by jess on 16/8/18.
 */


'use strict';

const ComponentBase = require('../../base/base.js');

const utils = require('../../utils/utils.js');

require('./glpb-image.scss');

const $ = ComponentBase.$;

const tpl = `<div><img /></div>`;

const ImageView = ComponentBase.extend(
    {
        componentName : 'gplb_image',
        componentNameZh : '单个图片',
        componentCategory : ComponentBase.CATEGORY.UI,
        platform : ComponentBase.PLATFORM.RESPONSIVE
    },
    {
        getDefaultStyle : function(){
            return {
                height : 'auto',
                width : 'auto',
                margin : '0 auto'
            };
        },

        getDefaultData : function(){
            return {
                "imageURL_$$comment" : '要展示的图片URL地址',
                imageURL : '//placehold.it/350x150',
                'title__$$comment' : '鼠标移动到图片上时,显示的文字',
                title : '',
                'alt__$$comment' : '图片加载失败时, 显示的文字',
                alt : ''
            };
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let $el = $(tpl).addClass( cssClass ).css( this.style );
            let $content = $('img', $el);
            this.$el = $el;
            this.$content = $content;

            this.updateImage();
        },

        //渲染编辑模式下, 额外的DOM组件
        renderEditorHelper : function(){
            let $el = this.$el;
            let $editorSettingWrap = this.$getEditSettingWrap();
            $el.append($editorSettingWrap);
        },

        setData : function(data){
            this.data = $.extend( this.data, data );
            this.updateImage();
        },

        updateImage : function(){
            let data = this.data;
            this.$content.attr('src', data.imageURL).attr('title', data.title).attr('alt', data.alt);
        }
    }
);


module.exports = ImageView;

