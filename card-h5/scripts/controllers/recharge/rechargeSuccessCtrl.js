/**
 * 充值回调页面Ctrl
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('rechargeSuccessCtrl', function ($scope, $rootScope, $stateParams, $cookieStore, dataService, encodeService) {
    $rootScope.loading = false;

    /**查询[成功的]充值交易信息详情*/
    var params = {
        businessNo:encodeService.encode64($cookieStore.get("businessNo").value)
    };
    dataService.queryBusinessInfo($cookieStore.get("businessNo").value).success(function (obj) {
        $rootScope.loading = true;
        if (obj.success) {
            $scope.rcgSuccInfo = obj.msgData;
            $rootScope.loading = false;
        } else {
            errorTips(obj, $state);
        }
    }).error(function (err) {
        $rootScope.loading = false;
        mui.alert("系统繁忙，请稍后重试！");
    });
});