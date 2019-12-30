/*
    该文件包含一些常用的函数
*/

var $ = function (selector, context) {
    /*
        元素选择器：
        目前只支持ID, class, 属性name, tagName选择
    */

    //如果context存在，以context作为根节点选择元素
    var root = context ? context : window.document;


    //getElementByID
    if (/^#/.test(selector)) {
        return root.getElementById(selector.replace(/^#/, ''));
    }

    //getElementsByName
    if (/^\[name=/.test(selector)) {
        return root.getElementsByName(selector.replace(/\[|name=|\]/g, ''));
    }

    //getElementsByClassName
    if (/^\./.test(selector)) {
        return root.getElementsByClassName(selector.replace(/^\./, ''));
    }

    //getElementsByTagName
    if (/^[a-z]+$/.test(selector)) {
        return root.getElementsByTagName(selector);
    }
};

var addHandler = document.body.addEventListener ?
    function (ele, type, handler) {
        //DOM2
        ele.addEventListener(type, handler, false);
    } :
    function (ele, type, handler) {
        //IE
        ele.attachEvent('on' + type, handler);
    };

var removeHandler = document.body.removeEventListener ?
    function (ele, type, handler) {
        //DOM2
        ele.removeEventListener(type, handler, false);
    } :
    function (ele, type, handler) {
        //IE
        ele.dispatch('on' + type, handler);
    };

function getTarget(event) {
    var evt = event || window.event;

    return evt.target || evt.srcElement;
}