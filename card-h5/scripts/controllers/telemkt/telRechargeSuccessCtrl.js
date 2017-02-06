/**
 * Created by nieying on 2016/6/6.
 */
angular.module('cardApp').controller('telRechargeSuccessCtrl',['$scope', '$rootScope', '$state','$cookieStore', 'dataService', 'encodeService', function ($scope, $rootScope, $state,$cookieStore, dataService, encodeService) {

    /**查询[成功的]充值交易信息详情*/
    var params = {
        businessNo:encodeService.encode64($cookieStore.get("businessNo").value)
    };

    dataService.queryBusinessInfo(params).success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            $scope.rcgSuccInfo = obj.msgData;
        } else {
            errorTips(obj, $state);
        }
    }).error(function () {
        systemBusy($rootScope,$state);
    });
}]);