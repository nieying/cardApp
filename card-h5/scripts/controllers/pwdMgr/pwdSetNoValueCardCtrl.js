/**
 * 扫卡设置无面额卡密码Ctrl
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('pwdSetNoValueCardCtrl',['$scope', '$rootScope', '$state', '$interval', 'encodeService', 'dataService', function ($scope, $rootScope, $state, $interval, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.pwdDes3Sk = '';

    $scope.op = encodeService.encode64('SET_PWD_NOVALUECARD');
    $scope.showCode = true;
    $scope.isGetCode = true;
    $scope.code = '';

    /**初始化参数*/
    $scope.params = {
        pwd: '',
        confirmPwd: '',
        phone: ''
    };

    /**获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /**确认设置密码*/
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
        if (!regular.regp.test($scope.params.phone)) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        if (!regular.reg6.test($scope.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        if (!$scope.scanCodeForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk),
                mobile: encodeService.encode64($scope.params.phone),
                confirmCode: encodeService.encode64($scope.code)
            };

            dataService.noValueCardSetPwd(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.alert(tipMsg.SET_PWD_SUCCESS, function () {
                        $state.go("sfcardscan");
                    })
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope, $state);
            });
        }
    }
}]);