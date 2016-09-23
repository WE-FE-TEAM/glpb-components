/**
 * 布局组件, 代表一个 DIV 的block区域
 * Created by jess on 16/8/10.
 */




const BaseComponent = require('../../base/base.js');

require('./layout-row.scss');

const $ = BaseComponent.$;
const utils = BaseComponent.utils;
const componentFactory = BaseComponent.componentFactory;

const tpl = `<div class="glpb-fn-animate-item"><div class="glpb-com-content clearfix"></div></div>`;

const LayoutRow = BaseComponent.extend(
    {
        componentName : 'layout_row',
        componentNameZh : '独占行',
        componentCategory : BaseComponent.CATEGORY.BASE,
        platform : BaseComponent.PLATFORM.RESPONSIVE,
        canBeChildOfComponentName : function(componentName){
            return true;
        }
    }, 
    {
        getDefaultStyle : function(){
            return {
                height : '300px',
                width : 'auto',
                background : {},
                padding : '0',
                margin : '0 auto 0px',
                animation : 'none'
            };
        },
        getDefaultComponents : function(){

            return [  ];
        },
        init : function(){
            this.$content = null;
        },
        render : function(){
            let currentComponentId = this.componentId;

            let cssClass = this.getBaseCssClass() + '  ';
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

        addComponent : function( componentName ){
            let config = {
                componentName : componentName,
                parentId : this.componentId,
                componentId : BaseComponent.generateComponentId()
            };

            //创建新的列组件
            let component = this.page.createComponentInstance(config);
            component.render();
            let $el = component.$getElement();
            this.$content.append( $el );
            component.bindEvent();

            this.componentRefs.push( component );
            
            this.afterChildChange();

        },

        //添加已经存在的组件到内部
        addExistColumn : function(componentId){
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

        bindEditorEvent : function(){
            let that = this;
            BaseComponent.prototype.bindEditorEvent.call( this );
            this.$content
                .droppable({
                // accept : '.lpb-component',
                // accept : '[data-com-name=layout_column]',
                    accept : function($draggable){

                        let componentName = $draggable.attr('data-com-name');
                        let componentClass = componentFactory.getComponentClass( componentName );
                        return that.canAcceptChildComponentName(componentName) && componentClass && componentClass.canBeChildOfComponentName('layout_row');
                    },
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
                    let componentName = $draggable.attr('data-com-name');
                    if( ! componentId ){

                        e.stopPropagation();
                        that.addComponent( componentName );
                    }else if( componentId ){
                        //添加已有的组件到内部
                        e.stopPropagation();
                        that.addExistColumn( componentId );
                    }

                }
            });

        },

        editorHandleChildMove : function(componentId, direction){
            let newIndex = BaseComponent.prototype.editorHandleChildMove.call( this, componentId, direction);
            if( newIndex >= 0 ){
                let $child = this.page.getComponentById(componentId).$getElement();
                utils.moveChildInParent($child, this.$content, newIndex);
            }
            
        },

        canAcceptChildComponentName : function(componentName){
            return true;
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


module.exports = LayoutRow;


