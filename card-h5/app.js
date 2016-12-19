/**rem手机适配*/
function ad(doc,win){
    var docE1 = doc.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var recalc = function(){
        var clientWidth = docE1.clientWidth;
        if(!clientWidth) return;
        docE1.style.fontSize = 20 * (clientWidth / 320 ) + 'px';
    };
    if(!doc.addEventListener) return;
    win.addEventListener(resizeEvt,recalc,false);
    doc.addEventListener('DOMContentLoaded',recalc,false);
}

ad(document,window);


/**获取浏览器版本*/
function getBrowser(n) {
    var ua = navigator.userAgent.toLowerCase(),
        s,
        name = '',
        ver = 0;
    //探测浏览器
    (s = ua.match(/msie ([\d.]+)/)) ? _set("ie", _toFixedVersion(s[1])) :
        (s = ua.match(/firefox\/([\d.]+)/)) ? _set("firefox", _toFixedVersion(s[1])) :
            (s = ua.match(/chrome\/([\d.]+)/)) ? _set("chrome", _toFixedVersion(s[1])) :
                (s = ua.match(/opera.([\d.]+)/)) ? _set("opera", _toFixedVersion(s[1])) :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? _set("safari", _toFixedVersion(s[1])) : 0;

    function _toFixedVersion(ver, floatLength) {
        ver = ('' + ver).replace(/_/g, '.');
        floatLength = floatLength || 1;
        ver = String(ver).split('.');
        ver = ver[0] + '.' + (ver[1] || '0');
        ver = Number(ver).toFixed(floatLength);
        return ver;
    }

    function _set(bname, bver) {
        name = bname;
        ver = bver;
    }

    return (n == 'n' ? name : (n == 'v' ? ver : name + ver));
};

/**判断是否是微信浏览器*/
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

/**提示错误信息*/
function errorTips(obj,$state){
    if (obj.msg == '连接失效,请重新登录') {
        mui.alert("连接失效,请重新登录", "", function () {
            $state.go("error",{code:'408'})
        });
    } else {
        mui.alert(obj.msg);
    }
}

/**依赖的插件*/
angular.module('cardApp', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'oc.lazyLoad',
    'angular-gestures',
    // 'ngKeditor',
    //'ngSanitize',
    //'ngTouch',
    //'restangular',
]);


