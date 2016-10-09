/**
 * 负责将各个组件的style, 写入到统一的 <style> 标签中, 实现 :hover 等样式效果
 * Created by jess on 2016/10/8.
 */


const $ = window.jQuery;

const utils = require('../utils/utils.js');

let sharedConfig = {
    doc : document,
    id : 'glpb-global-css-define'
};

let sharedInstance = null;


function StyleManager(args){
    let config = $.extend( {}, sharedConfig, args || {} );

    this.config = config;
    this.styleDOM = null;

    this.styleMap = {};
}

$.extend( StyleManager.prototype, {

    _setupDOM : function(){
        if( ! this.styleDOM ){
            let config = this.config;
            let doc = config.doc || document;
            let style = doc.createElement('style');
            style.id = config.id;
            let container = config.container;
            if( ! container ){
                container = doc.getElementsByTagName('head')[0];
            }
            container.appendChild( style );
            this.styleDOM = style;
        }
    },

    update : function( selector, style ){

        let conf = selector;
        if( style ){
            conf = {};
            conf[selector] = style;
        }

        let data = $.extend( this.styleMap, conf || {});
        this.styleMap = data;

        this._updateDOM();
    },

    _updateDOM : function(){
        let data = this.styleMap;
        //更新style中的内容
        let str = '';
        for( var selector in data ){
            if( data.hasOwnProperty(selector) ){
                str += utils.camelStyle2String( selector, data[selector]);
            }
        }
        if( ! this.styleDOM ){
            this._setupDOM();
        }
        utils.updateStyleText( this.styleDOM, str );
    },

    destroy : function(){
        if( this.styleDOM ){
            this.styleDOM.parentNode.removeChild( this.styleDOM );
            this.styleDOM = null;
        }
        this.styleMap = null;
        this.config = null;
    }

} );



module.exports = {

    setSharedConfig : function( conf ){
        $.extend( sharedConfig, conf );
    },

    getSharedInstance : function(){
        if( sharedInstance ){
            return sharedInstance;
        }
        sharedInstance = new StyleManager( sharedConfig );
        return sharedInstance;
    },

    getInstance : function( conf ){
        return new StyleManager( conf );
    }
};