/**
 * 所有组件的基类
 * Created by jess on 16/8/10.
 */


'use strict';


const $ = window.jQuery;
const utils = require('../utils/utils.js');
const componentFactory = require('../component-factory/component-factory.js');

require('./base.scss');

//实例化的个数
let instanceNum = 1;

function noop(){}

function ComponentBase( args ){
    args = args || {};

    this.page = args.page;

    //当前组件的父组件ID
    this.parentId = args.parentId || null;
    //当前组件ID
    this.componentId = args.componentId;
    // //DOM上的ID
    // this.domId = this.componentId;
    //当前组件名
    this.componentName = this.constructor.componentName;
    //当前组件实例的名字
    this.instanceName = args.instanceName || ( ( this.constructor.componentNameZh || this.componentName ) + instanceNum++ );

    this.$el = null;
    this.style = $.extend( this.getDefaultStyle(), args.style );
    if( this.getDataType() === ComponentBase.DATA_TYPES.JSON ){
        this.data = $.extend( this.getDefaultData(), args.data );
    }else if( this.getDataType() === ComponentBase.DATA_TYPES.RICH_TEXT ){
        this.data = args.data || this.getDefaultData();
    }

    this.components = args.components || this.getDefaultComponents();

    //当前组件实时含有的所有子组件引用数组
    this.componentRefs = [];

    //将当前实例对象, 注册到全局
    componentFactory.addComponentInstance(this.componentId, this);

    this.init();
}


$.extend( ComponentBase.prototype, {

    init : noop,

    render : noop,

    //渲染编辑模式下, 额外的DOM组件
    renderEditorHelper : function(){
        let $el = this.$el;
        let $editorSettingWrap = this.$getEditSettingWrap();
        $el.prepend($editorSettingWrap);
    },

    afterRender : noop,

    setInstanceName : function( name ){
        name = ( name || '' ).trim();
        if( name ){
            this.instanceName = name;
        }
    },

    getInstanceName : function(){
        return this.instanceName;
    },

    getStyle : function(){
        return $.extend({}, this.style);
    },

    setStyle : function( style ){
        this.style = $.extend( this.style, style );
        let cssStyle = utils.translateComponentStyle( this.style );
        this.updateCSSStyle( cssStyle );
    },

    //将组件的 style 转换成 浏览器原生支持的样式
    translateStyle : function( style ){
        return utils.translateComponentStyle( style );
    },

    updateCSSStyle : function( cssStyle ){
        this.$el.css( cssStyle );
    },

    setData : function(data){
        this.data = $.extend( this.data || {}, data);
    },

    toJSON : function(){
        let that = this;
        let sub = this.componentRefs || [];
        let subJSON = sub.map( function(com){
            return com.toJSON();
        } );
        return {
            componentName : this.componentName,
            instanceName : this.instanceName,
            componentId : this.componentId,
            parentId : this.parentId,
            style : this.style,
            data : this.data,
            components : subJSON
        };
    },

    //只返回子孙组件的ID及名字, 用于在页面上显示所有组件的tree结构
    toSimpleJSON : function(){
        let sub = this.componentRefs || [];
        let subJSON = sub.map( function(com){
            return com.toSimpleJSON();
        } );
        return {
            name : this.instanceName,
            id : this.componentId,
            children : subJSON
        };
    },
    
    onBeforeDestroy : function(){
        this.page.beforeComponentDestroy( this );
    },
    
    destroy : function(){
        
        //开始销毁前的回调
        this.onBeforeDestroy();
        
        //如果包含子组件, 先执行所有子组件的destroy
        let sub = this.componentRefs || [];
        for( let i = 0, len = sub.length; i < len; i++ ){
            let subComponent = sub[i];
            try{
                subComponent.destroy();
            }catch(e){
                console.warn(`执行子组件的destroy异常:`, e);
            }
        }
        
        //取消通用操作栏事件
        if( this.$editorSettingWrap ){
            this.$editorSettingWrap.off();
        }
        
        //执行组件自定义的销毁操作
        this.componentWillUnmount();
        
        //从全局组件实例中删除引用
        componentFactory.removeComponentInstance( this.componentId );
        
        //清除DOM
        if( this.$el ){
            this.$el.off();
            // this.$el.draggable('destroy');
            this.$el.remove();
        }

        this.components = null;
        this.componentRefs = null;
        this.page = null;
        this.$editorSettingWrap = null;
        this.$el = null;
    },
    //子类是重写, 销毁子类中特有的一些事件绑定等
    componentWillUnmount : noop,

    bindEvent : function(){

        //先绑定子组件的事件
        let components = this.componentRefs || [];
        for( var i = 0, len = components.length; i < len; i++ ){
            let component = components[i];
            try{
                component.bindEvent();
            }catch(e){
                console.error(e);
            }
        }

        this.bindComponentEvent();
        if( this.isEditMode() ){
            this.bindEditorEvent();
        }
    },
    //绑定组件本身的事件
    bindComponentEvent : noop,
    //绑定组件在编辑器中的事件
    bindEditorEvent : function(){
        let that = this;
        this.$el.on('mouseenter', function(){
            that.$el.addClass('glpb-editor-bar-showing');
        }).on('mouseleave', function(){
            that.$el.removeClass('glpb-editor-bar-showing');
        });

        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-drag', function(){
            that.$editorSettingWrap.toggleClass('editor-op-show-more');
        } );

        //在父组件内移动位置
        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-move', function(e){
            let currentTarget = e.currentTarget;
            let direction = currentTarget.getAttribute('data-direction');
            that.editorMoveInParent(direction);
        } );

        //编辑组件
        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-edit', function(){
            that.enterEdit();
        } );

        //删除当前组件及子孙组件
        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-delete', function(){
            that.triggerDestroy();
        } );

        // this.$el.draggable({
        //     handle: "> .glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
        //     revert : 'invalid',
        //     helper: function(){
        //         return that.editorGetDragHelper();
        //     },
        //     appendTo: "body"
        // });
    },

    enterEdit : function(){
        this.page.editComponent(this.componentId);
    },

    triggerDestroy : function(){
        this.page.destroyComponentById( this.componentId );
    },

    //显示正在编辑中的状态
    addEditingState : function(){
        this.$el.addClass('glpb-editor-com-editing');
    },

    removeEditingState : function(){
        this.$el.removeClass('glpb-editor-com-editing');
        this.$editorSettingWrap.removeClass('editor-op-show-more');
    },

    editorMoveInParent : function(direction){
        this.getParentComponent().editorHandleChildMove(this.componentId, direction);
    },

    editorHandleChildMove : function(componentId, direction){
        if( [ 'up', 'down', 'left', 'right'].indexOf(direction) < 0 ){
            console.warn(`子组件移动方向值[${direction}]非法!!只能是 up/down/left/right 之一`);
            return -1;
        }
        let components = this.componentRefs || [];
        let oldIndex = -1;
        let childConf = null;
        let len = components.length;
        for( var i = 0; i < len; i++ ){
            let temp = components[i];
            if( temp.getComponentId() === componentId ){
                oldIndex = i;
                childConf = temp;
                break;
            }
        }
        if( ! childConf ){
            console.error(`父组件[${this.componentId}]不包含子组件[${componentId}]!!`);
            return -1;
        }
        let newIndex = oldIndex;
        switch(direction){
            case 'up':
            case 'left':
                newIndex = oldIndex - 1;
                break;
            case 'down':
            case 'right':
                newIndex = oldIndex + 1;
                break;
            default:;

        }
        if( newIndex < 0 ){
            alert(`已经是父组件中的第一个了!`);
            return -1;
        }
        if( newIndex >= len ){
            alert('已经是父组件中最后一个了');
            return -1;
        }
        //先从老的位置删除
        components.splice(oldIndex, 1);
        //插入到新位置
        components.splice(newIndex, 0, childConf);

        //通知builder, 当前组件内部结构发生变化
        this.afterChildChange();

        return newIndex;
    },

    getComponentId : function(){
        return this.componentId;
    },

    getComponentName : function(){
        return this.componentName;
    },

    getBaseCssClass : function(){
        return 'glpb-component ' + ( ' glpb-com-' + this.componentName ) ;
    },

    $getElement : function(){
        return this.$el;
    },

    getDefaultStyle : function(){
        return {};
    },

    getDefaultData : function(){
        return {};
    },

    getDefaultComponents : function(){
        return [];
    },

    getParentComponent : function(){
        if( this.parentId ){
            return this.page.getComponentById(this.parentId);
        }
        return this.page;
    },

    //返回统一的组件上拖动/编辑的固定DIV容器
    $getEditSettingWrap : function(){
        let tpl = `<div class="glpb-editor-setting-wrap" data-com-id="${this.componentId}">
    <div class="gplb-editor-setting-bar clearfix">
        <div title="拖动" class="glpb-editor-op-btn glpb-editor-op-btn-drag" data-com-id="${this.componentId}"><i class="fa fa-arrows" aria-hidden="true"></i></div>
        <div class="editor-op-more">
            <div class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="up" title="向上移动"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i></div>
            <div class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="down"  title="向下移动"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></div>
            <!--<div class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="left"  title="向左移动"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></div>-->
            <!--<div class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="right"  title="向右移动"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></div>-->
            <div class="glpb-editor-op-btn glpb-editor-op-btn-edit" title="编辑"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></div>
            <div class="glpb-editor-op-btn glpb-editor-op-btn-delete" title="!!删除!!"><i class="fa fa-trash" aria-hidden="true"></i></div>
        </div>
    </div>
</div>`;

        this.$editorSettingWrap = $(tpl);

        return this.$editorSettingWrap;
    },

    isEditMode : function(){
        return componentFactory.isEditMode();
    },
    isPreviewMode : function(){
        return componentFactory.isPreviewMode();
    },
    isProductionMode : function(){
        return componentFactory.isProductionMode();
    },

    //从当前组件中删除指定ID的组件, **不** 进行DOM操作
    editorRemoveComponent : function(componentId){
        let isSuccess = false;
        let components = this.componentRefs || [];
        for( var i = 0, len = components.length; i < len; i++ ){
            let conf = components[i];
            if( conf.getComponentId() === componentId ){
                components.splice(i, 1);
                isSuccess = true;
                break;
            }
        }
        if( isSuccess ){
            this.afterChildChange();
        }else{
            console.warn(`(editorRemoveComponent) : 组件[${this.componentId}]不包含子组件${componentId}`);
        }

        return isSuccess;
    },

    //返回当前组件的父组件ID
    editorGetParentId : function(){
        return this.parentId;
    },
    
    editorSetParentId : function(parentId){
        this.parentId = parentId;
    },

    //判断当前组件, 是否为 componentObj 的直接父组件
    isContainComponent : function(componentObj){
        if( componentObj ){
            let parentId = componentObj.editorGetParentId();
            return parentId === this.componentId;
        }
        return false;
    },

    editorGetDragHelper : function(){
        return `<div class="glpb-component " data-com-name="${this.componentName}" data-glpb-com-id="${this.componentId}"></div>`;
    },

    getDataType : function(){
        return ComponentBase.DATA_TYPES.JSON;
    },

    getData : function(){
        return $.extend( {}, this.data, true);
    },

    //容器类型组件, 子组件增加/排序/删除 等操作时, 触发的回调, 通知builder
    afterChildChange : function(){
        this.page.afterComponentChildChange( this );
    },

    /**
     * 当前组件是否内部能包含对应类型的子组件
     * @param componentName {string} 组件类型
     * @returns {boolean}
     */
    canAcceptChildComponentName : function(componentName){
        return false;
    },

    /**
     * 当前组件是否能被作为子组件, 插入到 componentName 类型的父组件下
     * @param componentName {string} 父组件类型
     * @returns {boolean}
     */
    canBeChildOfComponentName : function(componentName){
        return this.constructor.canBeChildOfComponentName( componentName );
    },

    /**
     * 在子组件数组的 index 位置上, 插入新的组件, **不进行** DOM操作
     * @param component {object} 组件实例引用
     * @param index {int} 要插入的位置
     */
    insertChildAtIndex : function(component, index){
        
        let componentRefs = this.componentRefs;

        //将组件从原来的父组件中删除
        let oldParent = component.getParentComponent();
        oldParent.editorRemoveComponent( component.getComponentId() );
        
        //修改组件的 parentId
        component.editorSetParentId( this.componentId );
        
        index = Math.min( componentRefs.length, index );
        this.componentRefs.splice(index, 0, component);

        this.insertChildDOM(component, index);

        this.afterChildChange();
    },

    //子类中覆盖, 实际实行插入子组件的DOM操作
    insertChildDOM : function(component, index){},

    hide : function(){
        if( this.$el ){
            this.$el.hide();
        }
        return this;
    },
    
    show : function(){
        if( this.$el ){
            this.$el.show();
        }
        return this;
    }
} );

//组件类型
ComponentBase.componentName = 'base';
//组件所属类目
ComponentBase.componentCategory = '__NONE__';


/**
 * 创建组件类, 继承自 ComponentBase
 * @param statics {object} 新组件类的静态属性
 * @param prototype {object} 组件类的实例属性
 * @returns {Component} 组件类
 */
ComponentBase.extend = function( statics, prototype){
    statics = statics || {};
    if( ! statics.componentName ){
        throw new Error('组件静态属性,必须包含惟一的 componentName 字段!');
    }
    let oldRender = prototype.render;
    if( oldRender ){
        prototype.render = function(){
            oldRender.call( this );
            let $el = this.$el;
            if( $el ){
                $el.attr('data-glpb-com-id', this.componentId).attr('data-com-name', this.componentName);
                if( this.isEditMode() ){
                    this.renderEditorHelper();
                }
                $el.attr('id', this.componentId );
            }
            this.afterRender();
        };
    }
    function Component(){
        ComponentBase.apply( this, [].slice.call(arguments) );
    }
    
    Component.canBeChildOfComponentName = function(){
        return false;
    };
    
    $.extend( Component, statics);
    function parent(){}
    parent.prototype = ComponentBase.prototype;
    Component.prototype = new parent();
    Component.prototype.constructor = Component;
    $.extend(Component.prototype, prototype);

    //注册该组件
    componentFactory.registerComponentClass(statics.componentName, Component);

    return Component;
};


ComponentBase.$ = $;
ComponentBase.utils = utils;
ComponentBase.generateComponentId = utils.generateComponentId;

//基础组件
const CATEGORY_BASE = 'CATE_BASE';
//UI组件
const CATEGORY_UI = 'CATE_UI';

//系统支持的所有组件分类
ComponentBase.CATEGORY = {
    BASE : CATEGORY_BASE,
    UI : CATEGORY_UI
};

//组件所属的平台
ComponentBase.PLATFORM = {
    PC : 'pc',
    MOBILE : 'mobile',
    RESPONSIVE : 'responsive'
};

//组件内的数据类型
ComponentBase.DATA_TYPES = {
    JSON : 'json',
    RICH_TEXT : 'richtext'
};


module.exports = ComponentBase;

