/**
 * 充值回调页面Ctrl
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('rechargeSuccessCtrl',['$scope', '$rootScope', '$stateParams', '$cookieStore','$state','dataService',function ($scope, $rootScope, $stateParams, $cookieStore,$state,dataService) {

    /**查询[成功的]充值交易信息详情*/
    var params = {
        businessNo:$stateParams.businessNo
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

    $scope.goBack = function () {
        back($cookieStore, $state);
    }
}]);