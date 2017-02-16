/**
 * 卡列表
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$cookieStore', 'dataService', function ($scope, $rootScope, $state, $stateParams, $cookieStore, dataService) {
    $rootScope.loading = true;
    $scope.showGoBackBtn = true;//判断是否显示返回按钮
    clearCookie();
    $cookieStore.put("system", {value: 'SFCARD'});

    /**获取卡列表*/
    dataService.getCardList().success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
            });
            $scope.cardList = obj.msgData;
            _.each($scope.cardList.outsideMemberCardInfoList,function (card) {
                cardRemarkName(card);
            })
        } else {
            if (obj.code == '302') {
                //去活动页面
                console.log(obj.msgData.hash.split('/')[1]);
                $state.go("mkt", {mktName: obj.msgData.hash.split('/')[1]});
            } else {
                errorTips(obj, $state)
            }
        }
        //卡背景颜色
        $scope.cardColor = ['bg-23', 'bg-fb', 'bg-5e', 'bg-e6'];
    }).error(function () {
        systemBusy($rootScope, $state);
    });

    /**获取市场活动Banners广告信息*/
    dataService.getMktBanners().success(function (obj) {
        if (obj.success) {
            $scope.mktBanners = [];
            _.each(obj.msgData.mktBanners, function (data) {
                var mtkbnr = JSON.parse(data);
                if (data && mtkbnr.pos == 0) {
                    $scope.mktBanners.push(mtkbnr);
                }
            });
        }
    });

    /**去活动页面*/
    $scope.goMkt = function (mktName, op) {
        $rootScope.loading = true;
        if (op == 'intro') {
            $state.go("mkt/intro", {mktName: mktName});
        } else if (op == 'participateIn') {
            dataService.getParticipateIn(mktName).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    if (obj.msgData == 1) {//无首充记录
                        $rootScope.showMktTips = 1;
                        $state.go("mkt/mktips")
                    } else if (obj.msgData == 2) {//已领取
                        $rootScope.showMktTips = 2;
                        $state.go("mkt/mktips")
                    } else if (obj.msgData == 3) {//逾期未领取
                        $rootScope.showMktTips = 3;
                        $state.go("mkt/mktips")
                    } else {
                        systemBusy($rootScope, $state);
                    }
                } else {
                    if (obj.code == '302') {
                        window.location.href = obj.msgData;
                    } else {
                        errorTips(obj, $state)
                    }
                }
            }).error(function () {
                systemBusy($rootScope, $state);
            })
        }
    };

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
                // alert("wechat return back close"); //console;
                WeixinJSBridge.invoke('closeWindow', {}, function (resp) {
                });
            } else {
                window.location.href = "ActionInterface.backToBeforePage";
            }
        };
    }
}]);












