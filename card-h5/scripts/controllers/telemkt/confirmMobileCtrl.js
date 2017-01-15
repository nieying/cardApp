/**
 * Created by nieying on 2016/6/6.
 */
angular.module('cardApp').controller('confirmMobileCtrl',['$scope','$cookieStore', '$rootScope','$state', 'dataService', function ($scope,$cookieStore, $rootScope, $state, dataService) {
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
        }
    }).error(function () {
        systemBusy($rootScope,$state)
    });
}]);