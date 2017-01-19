/**
 * 手机号码
 * Created by nieying on 2016/6/3.
 */
angular.module('cardApp').controller('verifyMobileCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'encodeService', 'dataService', function ($scope, $rootScope, $state, $stateParams, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.mobile = $stateParams.mobile;
    $scope.code = '';
    $scope.op = encodeService.encode64("UPDATE_PHONE");
    $scope.showCode = false;

    /*下一步*/
    $scope.next = function () {
        console.log("$scope.code",$scope.code);
        if (!regular.reg6.test($scope.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        $rootScope.loading = true;
        var params = {
            confirmCode: encodeService.encode64($scope.code),
            op: encodeService.encode64("UPDATE_PHONE")
        };
        dataService.mobileValidate(params).success(function (obj) {
            $rootScope.loading = false;
            if (obj.success) {
                $state.go("bindPhone", {mobile: $scope.mobile});
            } else {
                errorTips(obj, $state);
            }
        }).error(function () {
            systemBusy($rootScope, $state)
        });
    };
}]);