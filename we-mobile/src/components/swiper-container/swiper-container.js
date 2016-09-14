/**
 * 渲染移动端的一个 整屏滚动的容器 区域
 * Created by jess on 16/9/8.
 */


'use strict';

const glpbCommon = require('glpb-components-common');


const Swiper = require('../../lib/swiper/swiper.js');

require('./swiper-container.scss');

const BaseComponent = glpbCommon.BaseComponent;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;

const componentFactory = BaseComponent.componentFactory;

const arrowImage = __inline('./assets/arrow.png');

const tpl = `<div><div class="swiper-container"><div class="glpb-swiper-wrapper swiper-wrapper"></div></div><img src="${arrowImage}" class="next-page-arrow" /></div>`;


const SwiperContainer = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_swiper_container',
        componentNameZh : '整屏滚动的容器',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.MOBILE,
        canBeChildOfComponentName : function(componentName){
            return componentName === 'root';
        }
    },
    {
        getDefaultStyle : function(){
            return {
                background : {
                    backgroundColor : '#fff'
                },
                padding : '0',
                margin : '0',
                height : '13.34rem'
            };
        },

        getDefaultData : function(){
            return {
                'direction__$$comment' : '滚屏的方向,垂直(vertical)或水平(horizontal)',
                direction : 'vertical',
                'loop__$$comment' : '到底后是否循环滑动: true循环;false不循环',
                loop : false
            };
        },

        init : function(){
            this.swiper = null;
            this.$swipeContainer = null;
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass );

            let $swipeContainer = $el.find('.swiper-container');
            let $content = $el.find('.glpb-swiper-wrapper');

            $swipeContainer.css( cssStyle );

            this.$el = $el;
            this.$swipeContainer = $swipeContainer;
            this.$content = $content;

            let components = this.components || [];
            let componentRefs = this.componentRefs;
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = this.page.createComponentInstance( config );
                if( com ){
                    try{
                        com.render();
                        $content.append( com.$getElement() );
                        componentRefs.push( com );
                    }catch(e){
                        console.error(e);
                    }

                }else{
                    //不存在该组件
                    throw new Error(`componentName[${config.componentName}]对应的组件不存在!!`);
                }
            }

        },

        renderEditorHelper : function(){
            BaseComponent.prototype.renderEditorHelper.call( this );
            
            //插入droppable的区域
            let $dropArea = $('<div class="glpb-swiper-container-drop-area">拖动新的一屏到这里</div>');
            $dropArea.appendTo( this.$el );
            
            this.$dropArea = $dropArea;
        },

        updateCSSStyle : function( cssStyle ){
            this.$swipeContainer.css( cssStyle );
        },

        canAcceptChildComponentName : function( componentName ){
            return 'glpb_we_com_swiper_item' === componentName;
        },

        bindComponentEvent : function(){
            let that = this;
            if( ! this.isEditMode() ){
                let data = this.data;
                //在正式环境或预览环境, 切换到swiper滚屏效果
                let conf = {
                    direction : data.direction,
                    onSlideChangeEnd : function(swiper){
                        const reachLastClass = 'glpb-swiper-last';
                        if( ! swiper.params.loop ){
                            if( ! swiper.isEnd ){
                                that.$el.removeClass(reachLastClass);
                            }else{
                                that.$el.addClass(reachLastClass);
                            }
                        }
                    }
                };
                if( this.isPreviewMode() ){
                    conf.mousewheelControl = true;
                }
                this.swiper = new Swiper( this.$swipeContainer[0], conf);
            }
        },

        bindEditorEvent : function(){
            let that = this;
            BaseComponent.prototype.bindEditorEvent.call( this );
            this.$dropArea
                .droppable({
                    // accept : '.lpb-component',
                    accept : '[data-com-name=glpb_we_com_swiper_item]',
                    // accept : function(draggable){
                    //     console.log( draggable );
                    // },
                    greedy : true,
                    tolerance : 'pointer',
                    classes: {
                        "ui-droppable-active": "custom-state-active",
                        "ui-droppable-hover": "custom-state-hover"
                    },
                    drop : function(e, ui){
                        let $draggable = ui.draggable;
                        let componentId = $draggable.attr('data-glpb-com-id');
                        if( ! componentId ){

                            e.stopPropagation();
                            that.addSwiperItem();
                        }else if( componentId ){
                            //添加已有的组件到内部
                            e.stopPropagation();
                            that.addExistItem( componentId );
                        }

                    }
                });

        },

        //添加新的一屏到最后
        addSwiperItem : function(){
            let rowComponentId = this.componentId;
            let itemConf = {
                parentId : rowComponentId,
                componentId : utils.generateComponentId(),
                componentName  : 'glpb_we_com_swiper_item'
            };

            //创建新的列组件
            let component = this.page.createComponentInstance(itemConf);
            component.render();
            let $el = component.$getElement();
            this.$content.append( $el );
            component.bindEvent();

            this.componentRefs.push( component );

            this.afterChildChange();
        },

        //添加已有的一屏到最后
        addExistItem : function(componentId){
            let component = this.page.getComponentById(componentId);
            if( component ){
                if( component.editorGetParentId() === this.componentId ){
                    //本来就在当前组件里
                    return;
                }
                let oldParentComponent = component.getParentComponent();
                oldParentComponent.editorRemoveComponent(componentId);
                this.componentRefs.push( component );
                this.$content.append( component.$getElement() );
            }

            this.afterChildChange();
        },

        editorHandleChildMove : function(componentId, direction){
            let newIndex = BaseComponent.prototype.editorHandleChildMove.call( this, componentId, direction);
            if( newIndex >= 0 ){
                let $child = this.page.getComponentById(componentId).$getElement();
                utils.moveChildInParent($child, this.$content, newIndex);
            }

        },

        insertChildDOM : function(component, index){
            let $componentEl = component.$getElement();
            utils.insertElement( $componentEl, this.$content, index );
        },

        componentWillUnmount : function(){
            if( this.$dropArea ){
                this.$dropArea.droppable('destroy');
                this.$dropArea = null;
            }
            if( this.swiper ){
                this.swiper.destroy( true, true);
                this.swiper = null;
            }
            
        }
    }
);


module.exports = SwiperContainer;

