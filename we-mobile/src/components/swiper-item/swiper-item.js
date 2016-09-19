/**
 * 渲染移动端的一个 整屏滚动的一屏 区域
 * Created by jess on 16/9/8.
 */




const glpbCommon = require('glpb-components-common');

require('./swiper-item.scss');

const BaseComponent = glpbCommon.BaseComponent;
const componentFactory = BaseComponent.componentFactory;

const $ = BaseComponent.$;

const utils = BaseComponent.utils;


const tpl = `<div class="swiper-slide"></div>`;


const SwiperItem = BaseComponent.extend(
    {
        componentName : 'glpb_we_com_swiper_item',
        componentNameZh : '整屏滚动的一屏',
        componentCategory : BaseComponent.CATEGORY.UI,
        platform : BaseComponent.PLATFORM.MOBILE,
        canBeChildOfComponentName : function(componentName){
            return componentName === 'glpb_we_com_swiper_container';
        }
    },
    {
        getDefaultStyle : function(){
            return {
                background : {
                    backgroundColor : '#fff'
                },
                padding : '0',
                margin : '0'
            };
        },

        getDefaultData : function(){
            return {

            };
        },

        init : function(){

        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );;

            this.$el = $el;

            let components = this.components || [];
            let componentRefs = this.componentRefs;
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = this.page.createComponentInstance( config );
                if( com ){
                    try{
                        com.render();
                        $el.append( com.$getElement() );
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

        bindComponentEvent : function(){

        },

        canAcceptChildComponentName : function( componentName ){
            return ['glpb_we_com_swiper_item', 'glpb_we_com_swiper_container'].indexOf( componentName ) < 0;
        },

        bindEditorEvent : function(){
            let that = this;
            BaseComponent.prototype.bindEditorEvent.call( this );
            this.$el
                .droppable({
                    // accept : '.lpb-component',
                    // accept : '[data-com-name=glpb_we_com_swiper_item]',
                    // accept : function(draggable){
                    //     console.log( draggable );
                    // },
                    accept : function($draggable){

                        let componentName = $draggable.attr('data-com-name');
                        let componentClass = componentFactory.getComponentClass( componentName );
                        return that.canAcceptChildComponentName(componentName) && componentClass && componentClass.canBeChildOfComponentName('glpb_we_com_swiper_item');
                    },
                    greedy : true,
                    tolerance : 'pointer',
                    classes: {
                        "ui-droppable-active": "custom-state-active",
                        "ui-droppable-hover": "custom-state-hover"
                    },
                    drop : function(e, ui){
                        let $draggable = ui.draggable;
                        let componentId = $draggable.attr('data-glpb-com-id');
                        let componentName = $draggable.attr('data-com-name');
                        if( ! componentId ){

                            e.stopPropagation();
                            that.addNewComponent( componentName );
                        }else if( componentId ){
                            //添加已有的组件到内部
                            e.stopPropagation();
                            that.addExistComponent( componentId );
                        }

                    }
                });

        },

        //添加新的一屏到最后
        addNewComponent : function(componentName){
            let rowComponentId = this.componentId;
            let itemConf = {
                parentId : rowComponentId,
                componentId : utils.generateComponentId(),
                componentName  : componentName
            };

            //创建新的列组件
            let component = this.page.createComponentInstance(itemConf);
            component.render();
            let $el = component.$getElement();
            this.$el.append( $el );
            component.bindEvent();

            this.componentRefs.push( component );

            this.afterChildChange();
        },

        //添加已有的一屏到最后
        addExistComponent : function(componentId){
            let component = this.page.getComponentById(componentId);
            if( component ){
                if( component.editorGetParentId() === this.componentId ){
                    //本来就在当前组件里
                    return;
                }
                let oldParentComponent = component.getParentComponent();
                oldParentComponent.editorRemoveComponent(componentId);
                this.componentRefs.push( component );
                this.$el.append( component.$getElement() );
            }

            this.afterChildChange();
        },

        editorHandleChildMove : function(componentId, direction){
            let newIndex = BaseComponent.prototype.editorHandleChildMove.call( this, componentId, direction);
            if( newIndex >= 0 ){
                let $child = this.page.getComponentById(componentId).$getElement();
                utils.moveChildInParent($child, this.$el, newIndex);
            }

        },

        insertChildDOM : function(component, index){
            let $componentEl = component.$getElement();
            utils.insertElement( $componentEl, this.$el, index );
        },

        componentWillUnmount : function(){
            if( this.isEditMode() ){
                this.$el.draggable('destroy');
            }
        }
    }
);


module.exports = SwiperItem;

