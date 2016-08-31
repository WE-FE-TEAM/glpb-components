/**
 * Created by jess on 16/8/10.
 */

'use strict';


let singleton = {};


module.exports = singleton;


let componentId = 0;

//生成组件ID
singleton.generateComponentId = function(){
    let now = Date.now();
    return 'glpb-com-' + now + componentId++;
};


/**
 *  在父DOM中移动子元素到新的位置
 * @param $child
 * @param $parent
 * @param newIndex
 */
singleton.moveChildInParent = function($child, $parent, newIndex){
    let children = $parent.children();
    let currentIndex = $child.index();
    let $toBeforeSibling = children[newIndex];
    // $target.detach();
    if( currentIndex < newIndex){
        $child.insertAfter($toBeforeSibling);
    }else if( currentIndex > newIndex ){
        $child.insertBefore($toBeforeSibling);
    }
};

/**
 * 系统中, 每个组件的 style, 并不能直接设置给DOM元素, 需要经过转换
 * 本函数将系统中的 style 写法, 转换成 DOM 原生识别的样式
 * @param style {object} 系统中的组件style, 并 **不是** 浏览器原生支持的CSS样式
 * @returns {{}} 浏览器原生支持的CSS样式
 */
singleton.translateComponentStyle = function( style ){

    //要特殊处理的属性
    const specialAttrs = [ 'background' ];

    let realStyle = {};
    //特殊处理 background : {}
    let background = style.background;
    if( background ){
        for( var i in background ){
            if( background.hasOwnProperty(i) ){
                realStyle[i] = background[i];
            }
        }
    }

    //拷贝剩余的样式
    for( var j in style ){
        if( style.hasOwnProperty(j) ){
            if( specialAttrs.indexOf(j) < 0 ){
                realStyle[j] = style[j];
            }
        }
    }

    //backgroundImage只包含 图片的URL, 需要加上 url() 来包装下
    let backgroundImage = realStyle.backgroundImage;
    if( backgroundImage ){
        if( /^((http|https)\:)?\/\/.+/.test(backgroundImage) ){
            realStyle.backgroundImage = `url(${backgroundImage})`;
        }
    }

    return realStyle;
};