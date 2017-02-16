/**
 * 找回密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('findPwdCtrl', ['$scope', '$rootScope', '$interval', '$state', '$stateParams', 'encodeService', 'dataService', function ($scope, $rootScope, $interval, $state, $stateParams, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;
    $scope.code = '';

    $scope.mobile = $stateParams.mobile;
    $scope.op = encodeService.encode64("RESET_PWD");

    /**下一步*/
    $scope.next = function () {
        if (!regular.reg6.test($scope.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        $rootScope.loading = true;
        var params = {
            confirmCode: encodeService.encode64($scope.code),
            op: encodeService.encode64("RESET_PWD")
        };
        dataService.mobileValidate(params).success(function (obj) {
            $rootScope.loading = false;
            if (obj.success) {
                $state.go("resetPwd");
            } else {
                errorTips(obj, $state);
            }
        }).error(function () {
            systemBusy($rootScope, $state)
        });
    };
}]);