/**
 * Created by nieying on 2016/6/6.
 */
angular.module('cardApp').controller('confirmMobileCtrl', function ($scope,$cookieStore, $rootScope, $state, dataService, encodeService) {
    $rootScope.loading = false;

    dataService.getTeleSale().success(function (obj) {
        $rootScope.loading = true;
        if (obj.success) {
            $scope.telInfo = obj.msgData;
            $cookieStore.put("telMobile",{value:$scope.telInfo.mobile});
            $cookieStore.put("reqBusSn",{value:$scope.telInfo.reqBusSn});
            $rootScope.loading = false;
        } else {
            errorTips(obj, $state);
            $rootScope.loading = false;
        }
    }).error(function () {
        mui.alert("系统繁忙，请稍后重试！");
    });
});