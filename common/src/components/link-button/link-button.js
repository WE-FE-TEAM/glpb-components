/**
 * 一个按钮样式的 <a> 链接, 可以设置 :hover 的样式
 * Created by jess on 2016/10/8.
 */



const ComponentBase = require('../../base/base.js');

const utils = require('../../utils/utils.js');

require('./link-button.scss');

const $ = ComponentBase.$;

const tpl = `<div class="glpb-fn-animate-item"><a class="glpb-content"></a></div>`;



const LinkButton = ComponentBase.extend(
    {
        componentName : 'glpb_link_button',
        componentNameZh : '带链接按钮',
        componentCategory : ComponentBase.CATEGORY.UI,
        platform : ComponentBase.PLATFORM.RESPONSIVE,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
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
                borderRadius : '5px'
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
            return ComponentBase.DATA_TYPES.JSON;
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

        componentWillUnmount : function(){
            this.$content = null;
        }
    }
);


module.exports = LinkButton;

