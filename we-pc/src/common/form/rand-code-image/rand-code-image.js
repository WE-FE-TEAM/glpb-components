/**
 * 随机验证码图片和刷新按钮
 * Created by jess on 2016/9/26.
 */



const glpbCommon = require('glpb-components-common');

const $ = glpbCommon.$;

const ValidateProvider = glpbCommon.ValidateProvider;


const constant = require('../constant.js');


require('./rand-code-image.scss');

const CONTAINER_CLASS = 'gui-phone-code-image-con';

function noop(){}


function RandCodeImage(args){

    let props = $.extend( {
        className : '',
        //点击图片,刷新
        clickRefresh : true,
        //是否显示刷新按钮
        refreshBtn : true,
        //图片地址
        url : '/image_https.jsp',
        //图片刷新后回调
        onChange : noop
    }, args || {} );

    this.props = props;

    this.init();
}


$.extend( RandCodeImage.prototype, {

    init : function(){

        this.handleImageClick = this.handleImageClick.bind( this );
        this.handleBtnClick = this.handleBtnClick.bind( this );
    },

    $getElement : function(){
        return this.$el;
    },

    getURL : function(){
        let url = this.props.url;
        let random = ( new Date()).getTime();

        if( url.indexOf('?') > 0 ){
            url += '&' + random;
        }else{
            url += '?' + random;
        }

        return url;
    },

    refresh : function(){

        this.$img[0].src = this.getURL();

        //这里是否要改进,回调的时候,图片不一定load了
        this.props.onChange( this );
    },

    handleImageClick : function(){
        if( this.props.clickRefresh ){
            this.refresh();
        }
    },

    handleBtnClick : function(){
        this.refresh();
    },

    render : function(){

        let { className, clickRefresh, refreshBtn } = this.props;

        className += ' ' + CONTAINER_CLASS;

        if( clickRefresh ){
            className += ' img-clickable';
        }

        let url = this.getURL();

        let btn = '';

        if( refreshBtn ){
            btn = '<span class="refresh-btn"></span>';
        }

        let html = `<span class="${className}">
                <span class="code-image-wrap">
                    <img src=${url} />
                </span>
                ${btn}
            </span>`;
        
        let $el = $(html);
        this.$img = $el.find('img');
        this.$btn = $el.find('.refresh-btn');
        
        this.$el = $el;
    },

    bindEvent : function(){
        this.$img.on('click', this.handleImageClick );
        if( this.$btn.length === 1 ){
            this.$btn.on('click', this.handleBtnClick );
        }
    },

    destroy : function(){
        this.$img.off('click', this.handleImageClick );
        this.$img = null;
        if( this.$btn.length === 1 ){
            this.$btn.off('click', this.handleBtnClick );
            this.$btn = null;
        }
        this.$el = null;
    }

} );



module.exports = RandCodeImage;

