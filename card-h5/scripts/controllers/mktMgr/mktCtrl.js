/**
 * Created by jeff ying on 2017/2/8.
 */
angular.module("cardApp").controller('mktCtrl',['$scope', '$rootScope', '$state', '$stateParams', function ($scope, $rootScope, $state, $stateParams) {
    $rootScope.loading = false;
    $scope.showBackBtn = true;//判断是否显示返回按钮

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
        $scope.showBackBtn = false;
    }

    function onBridgeReady() {
        $scope.goBack = function () {
            if (isWeiXin()) {
                // alert("wechat return back close"); //console;
                WeixinJSBridge.invoke('closeWindow', {}, function (resp) {
                });
            } else {
                window.location.href = "ActionInterface.backToBeforePage";
            }
        };
    }
}]);
