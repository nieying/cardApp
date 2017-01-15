/**
 * 开通电子卡
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('ecardRegisterCtrl',['$scope', '$rootScope', '$state', '$cookieStore', 'encodeService', 'dataService', function ($scope, $rootScope, $state, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.pwdDes3Sk = '';

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /*初始化参数*/
    $scope.params = {
        pwd: '',
        confirmPwd: ''
    };

    /*确认设置密码*/
    $scope.confrim = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!regular.reg6.test($scope.params.pwd)) {
            mui.alert(tipMsg.COMFIRM_PWD);
            return false;
        }
        if ($scope.params.pwd != $scope.params.confirmPwd) {
            mui.alert(tipMsg.CONFIRM_PWD_NOT_SAME);
            return false;
        }
        if (!$scope.scanCodeForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.ecardRegister(params).success(function (obj) {
                $rootScope.loading = true;
                if (obj.success) {
                    mui.toast(tipMsg.OPEN_ECARD_SUCCESS);
                    $state.go("sfcards");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            });
        }
    }
}]);