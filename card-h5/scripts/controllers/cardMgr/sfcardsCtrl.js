/**
 * 卡列表
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardsCtrl', function ($scope, $rootScope, $state, $stateParams, dataService, encodeService, $cookieStore) {
    $rootScope.loading = true;
    $cookieStore.put("system", {value: 'SFCARD'});

    /*获取卡列表*/
    dataService.getCardList().success(function (obj) {
        if (obj.success) {
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
            });
            $rootScope.loading = false;
            $scope.cardList = obj.msgData;
        } else {
            $rootScope.loading = false;
            errorTips(obj, $state)
        }
        //卡背景颜色
        $scope.cardColor = ['bg-23', 'bg-fb', 'bg-5e', 'bg-e6'];
    }).error(function () {
        $rootScope.loading = false;
        mui.alert("系统繁忙，请稍后重试！");
    });

    /*获取市场活动Banners广告信息*/
    dataService.getMktBanners().success(function (obj) {
        if (obj.success) {
            $scope.mktImgs = obj.msgData.mktBanners;
        } else {
            errorTips(obj, $state)
        }
    });

    $scope.goCardDetail = function (card) {
        $state.go("sfcard", {cno: card.cardNo});
        $cookieStore.put("cno", {value: card.cardNo});
        $cookieStore.put("mobile", {value: card.moblie});
        $cookieStore.put("isEleCard", {value: card.cardType == 'EC' ? true : false});
    }
});










