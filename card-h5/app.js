/**rem手机适配*/
function ad(doc, win) {
    var docE1 = doc.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var recalc = function () {
        var clientWidth = docE1.clientWidth;
        if (!clientWidth) return;
        docE1.style.fontSize = 20 * (clientWidth / 320 ) + 'px';
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}

ad(document, window);

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
}

/**判断是否是微信浏览器*/
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**判断是否是顺丰APP*/
function isSfApp() {
    var a = window.navigator.userAgent.toLowerCase();
    var b = a.match(/mediaCode=SFEXPRESSAPP\/((IOS)|(ANDROID))/ig);
    var c = a.match(/clientVersion=\d\.\d\.\d/ig);
    if (null != b && b.length > 0 && null != c && c.length > 0) {
        if (c[0].split('=')[1] >= "8.2.0") {
            return true;
        }
    }
    return false;
}

/**提示错误信息*/
function errorTips(obj, $state) {
    if (obj.msg == '连接失效,请重新登录') {
        mui.alert("连接失效,请重新登录", function () {
            $state.go("error", {code: '408'});
        });
    } else if (obj.msg == '系统繁忙,请稍后再试') {
        $state.go("error", {code: '500'});
    } else {
        mui.alert(obj.msg);
    }
}

/**APP设置扫码结果*/
function setScanResult(str) {
    str = str + "";
    $("#cno").val(str.replace(/[^0-9]/ig, "").substring(0, 16).replace(/\D/g, '').replace(/....(?!$)/g, '$& '));
}

/**清除cookie*/
function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

/**返回*/
function back($cookieStore, $state) {
    if ($cookieStore.get("system").value == 'SFCARD') {
        $state.go('sfcard', {cardNo: $cookieStore.get("cardNo").value});
    } else {
        $state.go("sfcardscan");
    }
}

/**系统繁忙*/
function systemBusy($rootScope, $state) {
    $rootScope.loading = false;
    mui.alert(tipMsg.SYSTEM_BUSY, function () {
        $state.go("error", {code: '500'});
    });
}


/**依赖的插件*/
angular.module('cardApp', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'oc.lazyLoad',
    'angular-gestures',
    //'ngKeditor',
    //'ngSanitize',
    //'ngTouch',
    //'restangular',
]);


