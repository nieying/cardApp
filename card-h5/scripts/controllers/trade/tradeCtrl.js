/**
 * 交易明细
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('tradeCtrl', function ($scope, $rootScope, $state, $window, $stateParams, $filter, $cookieStore, dataService) {
    $rootScope.loading = false;
    $scope.tradeList = [];

    //循环初始化所有下拉刷新，上拉加载。
    function init() {
        //阻尼系数
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        mui('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });

        mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function (index, pullRefreshEl) {
            mui(pullRefreshEl).pullToRefresh({
                down: {       //下拉刷新
                    callback: refreshCallback
                },
                up: {     //上拉加载
                    callback: loadMoreCallback
                }
            });
        });
    }

    init();

    //下拉刷新执行函数
    function refreshCallback() {
        var self = this;
        self.pullUpLoading();
        setTimeout(function () {
            getTradeList(1);
            self.endPullDownToRefresh();
        }, 1500);
    }

    //上拉加载执行函数
    function loadMoreCallback() {
        var self = this;
        setTimeout(function () {
            getTradeList(0);
            if ($scope.trades.list.length == 0 || $scope.trades.list.length == 1) {
                self.endPullUpToRefresh(true);
            } else {
                self.endPullUpToRefresh(false);
            }
        }, 1500);
    }

    /*跳到交易详情页*/
    $scope.goTradeDetail = function (item) {
        $state.go("tradeDetail", {businessSn: item.businessSn});
        dataService.tradeParams= {
            businessSn: item.businessSn,
            businessTypeName: item.businessType,
            prefAmt: item.prefAmt,
            tradeAmt: item.tradeAmt,
            tradeTime: item.tradeTime
        };
    };

    getTradeList(0);

    /*获取数据*/
    function getTradeList(pull) {
        var params = {
            endTime: (pull == 0) && ($scope.lastTime) ? (($scope.lastTime - 1) + '') : ''
        };

        dataService.getTradeList(params).success(function (obj) {
           if(obj.success){
               $scope.trades = obj.msgData;
               if (pull == 1) {
                   $scope.tradeList = [];
               }
               $scope.tradeList = $scope.tradeList.concat($scope.trades.list);

               if (typeof ($scope.trades.list) == 'null') {
                   mui.alert("系统繁忙，请稍后重试！");
               } else {
                   $scope.lastTime = _.min(_.map($scope.trades.list, function (trade) {
                       return trade.tradeTime;
                   }));
               }
           }else{
               errorTips(obj,$state)
           }
        }).error(function () {
            mui.alert("系统繁忙，请稍后重试！");
        });
    }
});