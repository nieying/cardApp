/**
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('telSetPwdCtrl',['$scope', '$rootScope', 'dataService', function ($scope, $rootScope, dataService) {
    $rootScope.loading = false;
    $scope.params = {
        pwd: '',
        confirmPwd: '',
    };

    $scope.pwdDes3Sk = '';

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    $scope.comfirm = function () {
        if ($scope.params.pwd == '') {
            mui.alert(tipMsg.PWD_NOT_NULL);
            return false;
        }
        if ($scope.params.pwd != $scope.params.confirmPwd) {
            mui.alert(tipMsg.CONFIRM_PWD_NOT_SAME);
            return false;
        }
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!$scope.setElectronFrom.$invalid) {
            $rootScope.loading = true;

            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.telSetPwd(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.toast(obj.msg);
                    $state.go('sfcard',{cardNo:$cookieStore.get("cno").value});
                } else {
                    errorTips(obj,$state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            })
        }
    }
}]);