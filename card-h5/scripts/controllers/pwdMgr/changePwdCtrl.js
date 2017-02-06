/**
 * 修改密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('changePwdCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'dataService', '$cookieStore', function ($scope, $rootScope, $state, $stateParams, dataService, $cookieStore) {
    $scope.system = $cookieStore.get("system").value;
    $rootScope.loading = false;
    $scope.mobile = $stateParams.mobile;
    $scope.params = {
        oldPwd: '',
        pwd: '',
        confirmPwd: ''
    };

    $scope.pwdDes3Sk = '';

    /**获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /**判断是否绑定了手机号 如果没绑定就跳到绑定手机号页面*/
    $scope.hasMmobile = $stateParams.mobile ? true : false;

    /**修改密码*/
    $scope.updatePwd = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!regular.reg8.test($scope.params.oldPwd)) {
            mui.alert(tipMsg.COMFIRM_OLD_PWD);
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
        if (!$scope.changPwdForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.oldPwd, $scope.pwdDes3Sk),
                newPwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.changePwd(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.alert(tipMsg.UPDATE_PWD_SUCCESS, function () {
                        if ($scope.system == 'SFCARD') {
                            $state.go("sfcard", {cardNo: $cookieStore.get("cardNo").value});
                        } else {
                            $state.go("sfcardscan");
                        }
                    });
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            });
        }
    }
}]);