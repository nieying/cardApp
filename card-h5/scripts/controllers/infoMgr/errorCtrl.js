/**
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('errorCtrl', ['$scope', '$rootScope', '$stateParams','dataService',function ($scope, $rootScope, $stateParams, dataService) {
    $rootScope.loading = false;
    $scope.showGoBackBtn = true;//判断是否显示返回按钮

    if (codeMsg) {
        $scope.msg = codeMsg[$stateParams.code];
    }

    if (isWeiXin()) {//微信
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            // console.log("weixin---goBack", WeixinJSBridge, typeof(WeixinJSBridge));
            onBridgeReady()
        }
    } else if (isSfApp()) {//新版APP
        onBridgeReady();
    } else {//旧版APP等其他
        $scope.showGoBackBtn = false;
    }

    function onBridgeReady() {
        $scope.goBack = function () {
            if (isWeiXin()) {
                alert("wechat return back close"); //console;
                WeixinJSBridge.invoke('closeWindow', {}, function (resp) {});
            } else {
                window.location.href = "ActionInterface.backToBeforePage";
            }
        };
    }
}]);