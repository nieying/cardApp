/**
 * 交易详细
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('tradeDetailCtrl', function ($scope, $rootScope, $state, $stateParams, encodeService,dataService) {
    $rootScope.loading = true;

    $scope.tradeDetailInfo = dataService.tradeParams;

    $scope.params = {
        businessSn: encodeService.encode64($stateParams.businessSn)
    };
    dataService.getTradeDetail($scope.params).success(function (obj) {
        if (obj.success) {
            $rootScope.loading = false;
            $scope.orderList = obj.msgData;
        } else {
            errorTips(obj, $state);
        }
    }).error(function () {
        mui.alert("系统繁忙，请稍后重试！");
    });
});