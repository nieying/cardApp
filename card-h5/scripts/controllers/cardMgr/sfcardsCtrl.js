/**
 * 卡列表
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardsCtrl',['$scope', '$rootScope', '$state', '$stateParams', '$cookieStore', 'dataService', function ($scope, $rootScope, $state, $stateParams, $cookieStore, dataService) {
    $rootScope.loading = true;
    $scope.showGoBackBtn = true;//判断是否显示返回按钮
    clearCookie();
    $cookieStore.put("system", {value: 'SFCARD'});

    /*获取卡列表*/
    dataService.getCardList().success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
            });
            $scope.cardList = obj.msgData;
        } else {
            errorTips(obj, $state)
        }
        //卡背景颜色
        $scope.cardColor = ['bg-23', 'bg-fb', 'bg-5e', 'bg-e6'];
    }).error(function () {
        systemBusy($rootScope,$state);
    });

    /*获取市场活动Banners广告信息*/
    dataService.getMktBanners().success(function (obj) {
        if (obj.success) {
            $scope.mktBanners = [];
            _.each(obj.msgData.mktBanners, function (data) {
                var mtkbnr = JSON.parse(data);
                if (data && mtkbnr.pos == 0) {
                    $scope.mktBanners.push(mtkbnr);
                }
            });
            $scope.lastMktBnr = $scope.mktBanners[$scope.mktBanners.length - 1];
        }
    }).error(function () {
        systemBusy($rootScope,$state);
    });;

    $scope.goCardDetail = function (card) {
        $state.go("sfcard", {cardNo: card.cardNo});
    };


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
                WeixinJSBridge.invoke('closeWindow', {}, function (resp) {
                });
            } else {
                window.location.href = "ActionInterface.backToBeforePage";
            }
        };
    }
}]);












