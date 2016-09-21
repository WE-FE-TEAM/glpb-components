/**
 * 代表一个 <img /> 元素
 * Created by jess on 16/8/18.
 */




const ComponentBase = require('../../base/base.js');

const utils = require('../../utils/utils.js');

require('./glpb-image.scss');

const $ = ComponentBase.$;

const tpl = `<div class="glpb-fn-animate-item"><img /></div>`;

const imageHolderURL = __uri('./assets/img-holder.png');

const ImageView = ComponentBase.extend(
    {
        componentName : 'glpb_image',
        componentNameZh : '单个图片',
        componentCategory : ComponentBase.CATEGORY.UI,
        platform : ComponentBase.PLATFORM.RESPONSIVE,
        canBeChildOfComponentName : function(){
            return true;
        }
    },
    {
        getDefaultStyle : function(){
            return {
                height : 'auto',
                width : 'auto',
                margin : '0 auto',
                animation : 'none'
            };
        },

        getDefaultData : function(){
            return {
                "imageURL_$$comment" : '要展示的图片URL地址',
                imageURL : imageHolderURL,
                'title__$$comment' : '鼠标移动到图片上时,显示的文字',
                title : '',
                'alt__$$comment' : '图片加载失败时, 显示的文字',
                alt : '',
                'areaList__$$comment' : '图片上的可点击区域列表',
                areaList : [
                    {
                        shape : 'rect',
                        href : 'http://www.we.com',
                        target : '_blank',
                        left : '0',
                        top : '0',
                        right : '0',
                        bottom : '0'
                    }
                ]
            };
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let mapId = currentComponentId + '-map';

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );
            let $content = $('img', $el);

            $content.css({
                width : cssStyle.width,
                height : cssStyle.height
            });

            this.$el = $el;
            this.$content = $content;

            let $map = $(`<map name="${mapId}"></map>`);
            $map.appendTo( $el );

            $content.attr('usemap', '#' + mapId);

            this.$map = $map;

            this.updateImage();
            this.updateMap();
        },

        //渲染编辑模式下, 额外的DOM组件
        renderEditorHelper : function(){
            let $el = this.$el;
            let $editorSettingWrap = this.$getEditSettingWrap();
            $el.append($editorSettingWrap);
        },

        updateCSSStyle : function(style){

            this.$content.css({
                width : style.width,
                height : style.height
            });

            this.$el.css( style );
        },

        setData : function(data){
            this.data = $.extend( this.data, data );
            this.updateImage();
            this.updateMap();
        },

        updateImage : function(){
            let data = this.data;
            let style = this.translateStyle( this.style );
            this.$content.attr('src', data.imageURL)
                .attr('title', data.title)
                .attr('alt', data.alt)
                .css({
                    width : style.width,
                    height : style.height
                });
        },

        updateMap : function(){
            let html = '';
            let areaList = this.data.areaList || [];
            for( let i = 0, len = areaList.length; i < len; i++ ){
                let obj = areaList[i];
                let shape = obj.shape;
                let target = obj.target || '_self';
                switch(shape){
                    case 'rect':
                        let left = obj.left || '';
                        let top = obj.top || '';
                        let right = obj.right || '';
                        let bottom = obj.bottom || '';
                        if( left.indexOf('rem') > 0 ){
                            left = utils.rem2px( left );
                        }
                        if( top.indexOf('rem') > 0 ){
                            top = utils.rem2px( top );
                        }
                        if( right.indexOf('rem') > 0 ){
                            right = utils.rem2px( right );
                        }
                        if( bottom.indexOf('rem') > 0 ){
                            bottom = utils.rem2px( bottom );
                        }
                        html += `<area shape="rect" target="${target}" href="${obj.href}" coords="${left},${top},${right},${bottom}" />`;
                        break;
                    case 'circle':
                        let x = obj.x || '';
                        let y = obj.y || '';
                        let radius = obj.radius || '';
                        if( x.indexOf('rem') > 0 ){
                            x = utils.rem2px( x );
                        }
                        if( y.indexOf('rem') > 0 ){
                            y = utils.rem2px( y );
                        }
                        if( radius.indexOf('rem') > 0 ){
                            radius = utils.rem2px( radius );
                        }
                        html += `<area shape="circle" target="${target}" href="${obj.href}" coords="${x},${y},${radius}" />`;
                        break;
                    default:
                        console.warn(`[glpb-image]不支持的map shape: ${shape}`);
                }
            }

            this.$map.html( html );
        },

        componentWillUnmount : function(){
            this.$content = null;
        }
    }
);


module.exports = ImageView;

