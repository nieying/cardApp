/**
 * 扫卡设置密码Ctrl 实体卡设置密码
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('pwdSetCtrl',['$scope', '$rootScope', '$state', 'encodeService', 'dataService', function ($scope, $rootScope, $state, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.pwdDes3Sk = '';

    /**初始化参数*/
    $scope.params = {
        coatingCode: '',
        pwd: '',
        confirmPwd: ''
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
        if (!regular.reg6.test($scope.params.coatingCode)) {
            mui.alert(tipMsg.CONFIRM_COATINGCODE);
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
                coatingCode: encodeService.encode64($scope.params.coatingCode),
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.scanSetPwd(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.alert(tipMsg.SET_PWD_SUCCESS,function () {
                        $state.go("sfcardscan");
                    })
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
               systemBusy($rootScope,$state);
            });
        }
    }
}]);