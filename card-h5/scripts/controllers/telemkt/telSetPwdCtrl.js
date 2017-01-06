/**
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('telSetPwdCtrl', function ($scope, $rootScope, dataService) {
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
        if (!$scope.setElectronFrom.$invalid) {
            if ($scope.params.pwd != $scope.params.confirmPwd) {
                mui.toast("确认密码与设置密码不一致！");
                return false;
            }
            $rootScope.loading = true;

            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }
            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.telSetPwd(params).success(function (obj) {
                if (obj.success) {
                    mui.toast(obj.msg);
                    $state.go('sfcard');
                } else {
                    errorTips(obj)
                }
                $rootScope.loading = false;
            }).error(function (obj) {
                mui.alert(obj.msg);
                $rootScope.loading = false;
            })
        }
    }
});