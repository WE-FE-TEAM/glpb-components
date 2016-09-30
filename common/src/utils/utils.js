/**
 * Created by jess on 16/8/10.
 */




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
 * 将 $child 对应的DOM插入到 $parent 的 index 位置上
 * @param $child {object} 要插入的DOM的 jquery 对象
 * @param $parent {object} 容器DOM的 jquery 对象
 * @param index {int} 要插入到的位置上
 */
singleton.insertElement = function($child, $parent, index){

    //因为要插入的 index, 是基于 child 不存在的DOM中的情况下算出来的, 为了解决child本来就在parent中的情况, 先把child从DOM中移出
    $child.detach();

    let targetSibling = $parent.children()[index];
    if( targetSibling ){
        $child.insertBefore(targetSibling);
    }else{
        //将新插入的组件追加到最后
        $parent.append( $child );
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

    if( realStyle.animation ){
        realStyle.WebkitAnimation = realStyle.animation;
    }

    return realStyle;
};

let querySignIndex = 0;
/**
 * 简单的生成当前页面上惟一ID, 一般用在Ajax请求中, 标记某个请求的ID
 * @returns {string} {string}
 */
singleton.generateQuerySign = function(){
    return ( new Date() ).getTime() + '' + querySignIndex++;
};

/**
 * 将字符串中包含的HTML特殊字符,转换成实体, 避免注入
 * @param str {string} 可能包含HTML标签的字符串
 * @returns {string} 将HTML标签转换成实体之后的字符串
 */
singleton.escapeHTML = function( str ){
    str = str || '';
    return str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

/**
 * 将CSS中的px转换成 rem 的数值, 用在移动端自适应场景下
 * @param pxNumber {number} px为单位的长度数字
 * @returns {number}
 */
singleton.px2rem = function(pxNumber){
    pxNumber = pxNumber || 0;
    return pxNumber / 100;
};

/**
 * 移动端将 rem 为单位的长度数值,转换成 px 为单位的, 用在自适应场景下
 * @param remNumber {number} rem为单位的长度数值
 * @returns {number} px 为单位的长度数值
 */
singleton.rem2px = function(remNumber){
    remNumber = remNumber || 0;
    return remNumber * 100;
};


/////////////////解析URL参数///////////
singleton.query2json = function( s ){
    s = s.replace(/^\?/,'');
    var out = {};
    var arr = s.split('&');
    for( var i = 0, len = arr.length; i < len; i++ ){
        var temp = arr[i];
        var tempArr = temp.split('=');
        if( tempArr.length === 2 ){
            try{
                out[ tempArr[0] ] = decodeURIComponent( tempArr[1] );
            }catch(e){}
        }
    }

    return out;
};

singleton.json2query = function( data ){
    var out = '';
    if( data ){
        for( var i in data ){
            if( data.hasOwnProperty(i) ){
                out += i + '=' + encodeURIComponent( data[i] ) + '&';
            }
        }
    }

    return out;
};


singleton.getSearchConf = function(){
    return singleton.query2json( location.search );
};


const tplData = window.glpbCommonConstants || {};
/**
 * 提供字符串内变量替换功能, 只能替换系统支持的几个, 从 window.glpbCommonConstants 行获取值 
 * @param str {string} 可能包含系统变量的字符串
 * @returns {string}
 */
singleton.translateString = function( str ){
    str = str || '';
    return str.replace(/\$\$([0-9a-zA-Z_]+)\$\$/g, function( s1, key){
        return tplData[key] || '';
    } );
};