/**
 * 设置密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('setPwdCtrl', ['$scope', '$rootScope', '$state', '$interval', '$cookieStore', 'dataService', function ($scope, $rootScope, $state, $interval, $cookieStore, dataService) {
    $rootScope.loading = false;

    $scope.params = {
        pwd: '',
        confirmPwd: ''
    };

    $scope.pwdDes3Sk = '';

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    $scope.confirm = function () {
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
        if (!$scope.setPwdForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                newPwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.resetPwd(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.alert(tipMsg.SET_PWD_SUCCESS, function () {
                        if ($cookieStore.get("system").value == 'SFCARD') {
                            $state.go("sfcard", {cardNo: $cookieStore.get("cardNo").value});

                        } else {
                            $state.go("sfcardscan");
                        }
                    });
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope, $state);
            })
        }
    }
}]);