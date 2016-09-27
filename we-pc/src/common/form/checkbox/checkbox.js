/**
 * 勾选框
 * Created by jess on 2016/9/26.
 */



const glpbCommon = require('glpb-components-common');

const $ = glpbCommon.$;

const ValidateProvider = glpbCommon.ValidateProvider;


const constant = require('../constant.js');


require('./checkbox.scss');


function noop(){}



var id = 0;

function guid(){
    return 'gui-checkbox-auto-id-' + id++;
}


const CONTAINER_ERROR_CLASS = 'gui-form-checkbox-error';
const ERROR_INFO_CLASS = 'gui-form-error-info';



function Checkbox(args){

    let props = $.extend( {
        validate : {
            change : []
        },
        validateProvider : null,
        isShowError : true,
        checked : false,
        name : '',
        label : '',
        id : '',
        className : '',
        onChange : noop,
        onValidateEnd : noop
    }, args || {} );

    this.props = props;

    var provider = props.validateProvider || ValidateProvider.getInstance();

    this.state = {
        validateProvider : provider,
        id : this.props.id || guid(),
        checked : this.props.checked,
        invalidMessageList : []
    };

    this.init();
}


$.extend( Checkbox.prototype, {
    
    init : function(){
        
        this.handleClick = this.handleClick.bind( this );
        
    },

    $getElement : function(){
        return this.$el;
    },

    isChecked : function(){
        return this.state.checked;
    },

    getName : function(){
        return this.props.name;
    },

    setState : function( data ){
        this.state = $.extend( {}, this.state, data || {} );
        this.updateView();
    },

    _doValidate : function(){
        let ruleArray = this.props.validate.change;
        if( ! ruleArray ){
            return this.state.invalidMessageList;
        }

        let provider = this.state.validateProvider;
        let newMessageList = [];
        let value = this.state.checked;

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
                throw new Error('Checkbox[' + this.props.name + ']上有未知的校验规则:' + obj);
            }
            if( temp ){
                newMessageList.push( temp );
                break;
            }
        }

        return newMessageList;
    },

    validate : function(){
        var list = this._doValidate(  );
        this.setState({
            invalidMessageList : list
        });

        return list;
    },

    handleClick : function(){
        var isChecked = ! this.state.checked;
        this.setState({
            checked : isChecked
        });

        var list = this._doValidate(  );

        this.setState({
            invalidMessageList : list
        });

        this.props.onValidateEnd( this.props.name, list );

        this.props.onChange( isChecked, this );


    },

    render : function(){
        var state = this.state;
        var props = this.props;

        let { errorClass } = this.props;
        let { invalidMessageList }  = this.state;

        var outerClass = 'gui-form-checkbox ' + props.className;
        if( state.checked ){
            outerClass += ' gui-form-checkbox-checked';
        }

        var label = '';
        if( props.label ){
            label = `<span class="gui-checkbox-label">${props.label}</span>`;
        }

        let errorTip = invalidMessageList[0] || '';
        if( invalidMessageList.length > 0 ){
            outerClass += ' ' + CONTAINER_ERROR_CLASS + ' ' + errorClass;
        }

        let tipErrorClass = ERROR_INFO_CLASS;
        let errorHTML = `<span class="${tipErrorClass}">${ errorTip }</span>`;

        let children = this.props.children || '';

        let html = `<span class="${outerClass}">
                    <span class="checkbox-holder">
                        <input style="display: none;" type="checkbox" name="${props.name}" />
                        ${label}
                    </span>
                ${ children }
                ${errorHTML}
                </span>`;

        let $el = $(html);
        this.$input = $el.find('input');
        this.$clickCon = $el.find('.checkbox-holder');
        this.$errorInfo = $el.find('.' + ERROR_INFO_CLASS );
        
        // if( ! errorTip ){
        //     this.$errorInfo.hide();
        // }
        
        this.$el = $el;
    },

    bindEvent : function(){
        
        this.$clickCon.on('click', this.handleClick );
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
        
        const checkedClass = 'gui-form-checkbox-checked';
        
        if( this.state.checked ) {
            this.$el.addClass( checkedClass );
        }else{
            this.$el.removeClass( checkedClass );
        }
        
        return this;
    },

    destroy : function(){
        this.$clickCon.off('click', this.handleClick );

        this.$input = null;
        this.$clickCon = null;
        this.$errorInfo = null;
        this.$el = null;
    }
    
} );


module.exports = Checkbox;


