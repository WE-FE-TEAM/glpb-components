/**
 * 代表一个 富文本 区域块
 * Created by jess on 16/8/18.
 */




const ComponentBase = require('../../base/base.js');

const utils = require('../../utils/utils.js');

require('./glpb-rich-text.scss');

const $ = ComponentBase.$;

const tpl = `<div class="glpb-fn-animate-item"><div class="glpb-content"></div></div>`;

const RichText = ComponentBase.extend(
    {
        componentName : 'glpb_rich_text',
        componentNameZh : '富文本块',
        componentCategory : ComponentBase.CATEGORY.UI,
        platform : ComponentBase.PLATFORM.RESPONSIVE,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                position : 'relative',
                height : 'auto',
                width : 'auto',
                padding : '0',
                margin : '0 auto',
                fontSize : 'inherit',
                lineHeight : '1.5',
                color : '#000',
                background : {
                    backgroundColor : 'transparent'
                },
                textAlign : 'left',
                animation : 'none',
                zIndex : 10
            };
        },

        getDefaultData : function(){
            return '这里是富文本的内容, 记得修改默认值哦 :) ';
        },

        getDataType : function(){
            return ComponentBase.DATA_TYPES.RICH_TEXT;
        },

        getData : function(){
            return this.data || '';
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

        //渲染编辑模式下, 额外的DOM组件
        renderEditorHelper : function(){
            let $el = this.$el;
            let $editorSettingWrap = this.$getEditSettingWrap();
            $el.append($editorSettingWrap);
        },

        updateCSSStyle : function(cssStyle){
            this.styleManager.update( '#' + this.componentId + '>.glpb-content', cssStyle );
            // this.$content.css( style );
        },

        setData : function(data){
            this.data = data || '';
            //处理HTML中可能包含的系统定义的变量
            data = utils.translateString( this.data );
            this.$content.html( data );
        },

        componentWillUnmount : function(){
            this.$content = null;
        }
    }
);


module.exports = RichText;

