/**
 * form表单中的一个 单行文本  输入框
 * Created by jess on 2016/9/23.
 */


const glpbCommon = require('glpb-components-common');

const $ = glpbCommon.$;

const ValidateProvider = glpbCommon.ValidateProvider;


const constant = require('../constant.js');


require('./text-input.scss');

function noop(){}


//校验的两个时机, 用户输入中
const VALIDATE_KEYUP = 'keyup';
//输入框失去焦点
const VALIDATE_BLUR = 'blur';

const CONTAINER_CLASS = 'gui-form-text-container';
const INPUT_CLASS = 'gui-form-input';
const CONTAINER_ERROR_CLASS = 'gui-form-text-error';

const INPUT_WRAP_CLASS = constant.INPUT_WRAP_CLASS;
const PLACEHOLDER_CLASS = constant.PLACEHOLDER_CLASS;
const ERROR_INFO_CLASS = constant.ERROR_INFO_CLASS;



function TextInput(args){

    let props = $.extend( {
        type : 'text',
        validate : {
            keyup : [],
            blur : []
        },
        validateProvider : null,
        isShowError : true,
        className : '',
        id : '',
        name : '',
        errorClass : '',
        placeholder : '',
        value : '',
        onValidateEnd : noop
    }, args );

    let provider = props.validateProvider || ValidateProvider.getInstance();

    let state = {
        validateProvider : provider,
        value : props.value,
        invalidMessageList : [],
        //是否显示placeholder
        isShowPlaceholder : true
    };

    this.props = props;
    this.state = state;

    this.init();
}

$.extend( TextInput.prototype, {

    init : function(){
        this.handlePlaceholderClick = this.handlePlaceholderClick.bind( this );
        this.handleFocus = this.handleFocus.bind( this );
        this.handleValueUpdate = this.handleValueUpdate.bind( this );
        this.handleBlur = this.handleBlur.bind( this );
    },

    $getElement : function(){
        return this.$el;
    },

    //是否全部校验通过
    isValid : function(){
        return this.state.invalidMessageList.length < 1;
    },

    getName : function(){
        return this.props.name;
    },

    getValue : function(){
        return this.$input.val();
    },

    setState : function( data ){
        this.state = $.extend( {}, this.state, data || {} );
        this.updateView();
    },

    _doValidate : function( phase ){
        phase = phase || VALIDATE_BLUR;

        let ruleArray = this.props.validate[phase];
        if( ! ruleArray ){
            return this.state.invalidMessageList;
        }

        let provider = this.state.validateProvider;
        let newMessageList = [];
        let value = this.getValue();

        for( var i = 0, len = ruleArray.length; i < len; i++ ){
            var obj = ruleArray[i];
            var temp = null;
            if( typeof obj === 'function' ){
                //直接调函数
                temp = obj( value, this );
            }else if( typeof obj === 'string' ){
                //调用 validateProvider 上的方法
                temp = provider.validate( value, this, {
                    fn : obj,
                    message : obj
                } );

            }else if( obj && typeof obj === 'object' ){
                //复杂的校验配置,需要调用 provider 的通用方法处理
                temp = provider.validate( value, this, obj );
            }else{
                throw new Error('TextInput[' + this.props.name + ']上有未知的校验规则:' + obj);
            }
            if( temp ){
                newMessageList.push( temp );
                break;
            }
        }

        return newMessageList;

    },

    //validateProvider 中的异步校验完成
    asyncValidateFinish : function( value, message ){
        if( value === this.state.value ){
            var list = [];
            if( message ){
                list.push( message );
            }
            this.setState({
                invalidMessageList : list
            });
        }
    },

    handleFocus : function(e){
        this.setState({
            isShowPlaceholder : false
        });
    },

    //keyup 时监听
    handleValueUpdate : function(e){
        var list = this._doValidate( VALIDATE_KEYUP );

        this.setState({
            invalidMessageList : list,
            value : this.$input.val()
        });

        this.props.onValidateEnd( this.props.name, list );
    },

    handleBlur : function(e){
        var list = this._doValidate( VALIDATE_BLUR );
        var value = this.$input.val().trim();
        var isShowPlaceholder = value === '';


        this.setState({
            invalidMessageList : list,
            isShowPlaceholder : isShowPlaceholder
        });

        this.props.onValidateEnd( this.props.name, list );
    },

    //form 主动调用validate 方法
    validate : function( phase ){
        phase = phase || VALIDATE_BLUR;
        var list = this._doValidate( phase );
        this.setState({
            invalidMessageList : list
        });

        return list;
    },

    handlePlaceholderClick : function(){
        this.$input.focus();
        this.setState({
            isShowPlaceholder : false
        });
    },

    //是否浏览器原生支持 placeholder
    isSupportPlaceholder : function(){
        return false;
    },

    render : function(){

        let {  type, className, id, name, errorClass, placeholder } = this.props;

        let { value, invalidMessageList } = this.state;

        let containerProps = {
            className : className + ' '
        };

        let inputProps = {
            autoComplete : 'off',
            type : type,
            id : id,
            name : name,
            value : value
        };

        let errorTip = '';
        if( invalidMessageList.length > 0 ){
            containerProps.className += ' ' + CONTAINER_ERROR_CLASS + ' ' + errorClass;

            if( this.props.isShowError ){
                errorTip = invalidMessageList[0];
            }
        }

        let tpl = `<div class="gui-form-text-container">
    <div class="gui-input-wrap">
        <input id="${inputProps.id}" name="${inputProps.name}" value="${inputProps.value}" type="${inputProps.type}" autocomplete="${inputProps.autoComplete}" class="gui-form-input"  />
        <div class="gui-form-placeholder" ></div>
    </div>
    <div class="gui-form-error-info"></div>

</div>`;

        let $el = $(tpl);
        let $input = $el.find('input');
        let $placeholder = $el.find('.gui-form-placeholder');
        let $errorInfo = $el.find('.gui-form-error-info');

        $el.addClass( containerProps.className );
        // FUCK IE8, 不能修改 input 的 type 属性!!!
        // $input.attr( inputProps );
        $placeholder.html( placeholder );
        $errorInfo.html( errorTip );

        this.$el = $el;
        this.$input = $input;
        this.$placeholder = $placeholder;
        this.$errorInfo = $errorInfo;

        if( this.props.children ){
            $el.append( this.props.children );
        }
    },

    bindEvent : function(){
        this.$placeholder.on('click', this.handlePlaceholderClick );
        this.$input.on('focus', this.handleFocus );
        this.$input.on('change', this.handleValueUpdate );
        this.$input.on('blur', this.handleBlur);
    },

    //每次在 state 改变时, 调用此方法更新组件展示
    updateView : function(){
        let errorTip = '';
        let containerErrorClass = ' ' + CONTAINER_ERROR_CLASS + ' ' + this.props.errorClass;
        let invalidMessageList = this.state.invalidMessageList || [];
        if( invalidMessageList.length > 0 ){
            errorTip = invalidMessageList[0];
        }

        this.$errorInfo.html( errorTip );
        if( errorTip ){
            this.$el.addClass( containerErrorClass );
        }else{
            this.$el.removeClass( containerErrorClass );
        }

        if( this.state.isShowPlaceholder ){
            this.$placeholder.show();
        }else{
            this.$placeholder.hide();
        }

        return this;
    },

    destroy : function(){
        this.$placeholder.off('click', this.handlePlaceholderClick );
        this.$input.off('focus', this.handleFocus );
        this.$input.off('change', this.handleValueUpdate );
        this.$input.off('blur', this.handleBlur);

        this.$input = null;
        this.$placeholder = null;
        this.$errorInfo = null;
        this.$el = null;
    }
    
} );



module.exports = TextInput;

