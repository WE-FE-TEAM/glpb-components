/**
 * Created by jess on 16/8/11.
 */




const BaseComponent = require('../../base/base.js');

require('./layout-column.scss');

const $ = BaseComponent.$;
const utils = BaseComponent.utils;
const componentFactory = BaseComponent.componentFactory;

const tpl = `<div><div class="glpb-com-content clearfix"></div></div>`;



const LayoutColumn = BaseComponent.extend(
    {
        componentName : 'layout_column',
        componentNameZh : '列',
        componentCategory : BaseComponent.CATEGORY.BASE,
        platform : BaseComponent.PLATFORM.RESPONSIVE,
        canBeChildOfComponentName : function(componentName){
            return componentName === 'layout_row';
        }
    },
    {
        getDefaultStyle : function(){
            return {
                width : '100%',
                height : '360px',
                background : {},
                padding : '0',
                margin : '0px 0px'
            };
        },
        init : function(){

        },
        render : function(){
            
            let currentComponentId = this.componentId;
            
            let cssClass = this.getBaseCssClass() + ' ';
            let cssStyle = this.translateStyle( this.style );
            let $el = $(tpl).addClass( cssClass ).css( cssStyle );
            let $content = $('.glpb-com-content', $el);
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
            return $el;
        },
        bindEditorEvent : function(){
            let that = this;
            BaseComponent.prototype.bindEditorEvent.call( this );
            this.$content.droppable({
                // accept : '.lpb-component',
                // accept : '[data-com-name]:not([data-com-name=layout_column])',
                accept : function($draggable){

                    let componentName = $draggable.attr('data-com-name');
                    let componentClass = componentFactory.getComponentClass( componentName );
                    return that.canAcceptChildComponentName(componentName) && componentClass && componentClass.canBeChildOfComponentName('layout_column');
                },
                greedy : true,
                classes: {
                    "ui-droppable-active": "custom-state-active",
                    "ui-droppable-hover": "custom-state-hover"
                },
                drop : function(e, ui){
                    let $draggable = ui.draggable;
                    let componentId = $draggable.attr('data-glpb-com-id');
                    let componentName = $draggable.attr('data-com-name');
                    if( componentName !== 'layout_column' ){

                        e.stopPropagation();

                        if( ! componentId ){
                            that.addComponent( componentName );
                        }else{
                            that.addExistComponent( componentName, componentId);
                        }
                    }else{
                        //column组件内部不能直接放column组件
                        console.warn(`column组件[${that.componentId}]内部不能直接放column组件`);
                    }

                }
            });

            // this.$el.draggable({
            //     handle: "> .glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
            //     revert : 'invalid',
            //     helper: function(){
            //         return that.editorGetDragHelper();
            //     },
            //     appendTo: "body"
            // });

            // $('.ui-sortable').sortable('refresh');
        },

        canAcceptChildComponentName : function(componentName){
            return ['layout_column'].indexOf(componentName) < 0;
        },
        
        //要添加新的一个组件
        addComponent : function(componentName){
            let config = {
                componentName : componentName,
                parentId : this.componentId,
                componentId : BaseComponent.generateComponentId()
            };
            let instance = this.page.createComponentInstance(config);
            if( instance ){
                instance.render();
                this.$content.append( instance.$getElement() );
                instance.bindEvent();
                this.componentRefs.push( instance );
            }else{
                throw new Error(`componentName[${componentName}]对应的组件不存在!!`);
            }

            this.afterChildChange();
        },
        
        //要添加的组件实例,已经存在!
        addExistComponent : function(componentName, componentId ){

            if( componentName === this.componentName ){
                //column组件不能直接包含自身
                return;
            }
            console.log(`add exist component : ${componentName} ${componentId}`);
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

                this.afterChildChange();
            }
        },
        editorHandleChildMove : function(componentId, direction){
            let newIndex = BaseComponent.prototype.editorHandleChildMove.call( this, componentId, direction);
            if( newIndex >= 0 ){
                let $child = this.page.getComponentById(componentId).$getElement();
                utils.moveChildInParent($child, this.$content, newIndex);
            }
        },

        canAcceptChildComponentName : function(componentName){
            return [ 'layout_column' ].indexOf(componentName) < 0;
        },

        insertChildDOM : function(component, index){
            let $componentEl = component.$getElement();
            utils.insertElement( $componentEl, this.$content, index );
        },

        componentWillUnmount : function(){
            this.$content.droppable('destroy');
            this.$content = null;
        }
    }
);


module.exports = LayoutColumn;