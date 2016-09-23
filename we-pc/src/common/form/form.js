/**
 * 封装 form 表单
 * Created by jess on 2016/9/23.
 */


const glpbCommon = require('glpb-components-common');

const $ = glpbCommon.$;

const ValidateProvider = glpbCommon.ValidateProvider;

const TextInput = require('./text-input/text-input.js');



function noop(){}


function GForm( args ){

    let props = $.extend( {

        action : '',
        method : 'get',
        className : '',
        id : '',
        //提交表单,已经通过了全部校验
        onSubmit : noop,
        //主动校验结束
        onValidateEnd : noop
    }, args || {} );

    this.props = props;

    this.fieldRefs = [];

    this.children = [];

    this.fieldMsg = {};

    this.init();

}

$.extend( GForm.prototype, {

    init : function(){
        this.handleSubmit = this.handleSubmit.bind( this );
    },

    $getElement : function(){
        return this.$el;
    },

    $getForm : function(){
        return this.$el;
    },

    handleSubmit : function(e){
        e.preventDefault();
        //
        var isValid = this.validateAll();

        if( ! isValid ){
            return;
        }

        this.props.onSubmit( e, this );
    },

    //主动调用全部field的validate方法
    validateAll : function(){
        var fields = this.fieldRefs;
        var fieldMsg = this.fieldMsg = {};
        var isValid = true;
        var invalidMessageList = [];

        for( let i = 0, len = fields.length; i < len; i++  ){
            let component = fields[i];
            var out = component.validate();
            if( out.length > 0 ){
                let name = component.getName();
                invalidMessageList = invalidMessageList.concat( out );
                fieldMsg[name] = out[0];
                isValid = false;
            }
        }

        //将各个组件
        this.props.onValidateEnd( invalidMessageList, fieldMsg );

        return isValid;
    },

    //根据组件name来获取对应的错误消息
    getInputError : function( name ){
        return this.fieldMsg[name] || '';
    },

    addInputItem : function( inputItem ){

        this.fieldRefs.push( inputItem );
        this.children.push( inputItem );
        return this;
    },

    addElementItem : function(element){
        this.$el.append( element);
        return this;
    },

    addComponentItem : function(component){

        this.children.push( component );
        return this;
    },

    render : function(){

        let { action, method, className, id } = this.props;

        className += ' gui-form';

        let formProps = {
            action : action,
            method : method,
            id : id
        };


        let html = '<form></form>';

        let $el = $(html);

        $el.attr( formProps ).addClass( className );

        this.$el = $el;

    },

    bindEvent : function(){
        this.$el.on('submit', this.handleSubmit, false);
        
        let arr = this.children || [];
        for( let i  = 0, len = arr.length; i < len; i++ ){
            let component = arr[i];
            try{
                if( typeof component.bindEvent === 'function' ){
                    component.bindEvent();
                }
            }catch(e){
                console.warn(e);
            }
        }
    },

    destroy : function(){

        let arr = this.children || [];
        for( let i  = 0, len = arr.length; i < len; i++ ){
            let component = arr[i];
            try{
                if( typeof component.destroy === 'function' ){
                    component.destroy();
                }
            }catch(e){
                console.warn(e);
            }
        }

        this.children = [];
        this.fieldRefs = [];

        this.$el.off('submit', this.handleSubmit, false);
        this.$el = null;
    }

} );


GForm.TextInput = TextInput;
GForm.ValidateProvider = ValidateProvider;


module.exports = GForm;


