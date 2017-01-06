/**
 * 设置密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('setPwdCtrl', function ($scope, $rootScope, $state, $interval, $cookieStore, encodeService, dataService) {
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
        if (!$scope.setPwdForm.$invalid) {
            if ($scope.params.pwd != $scope.params.confirmPwd) {
                mui.alert("两次输入密码不一致！");
                return false;
            }

            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }

            var params = {
                newPwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };

            dataService.resetPwd(params).success(function (obj) {
                if (obj.success) {
                    mui.toast("重置密码成功！");
                    var url = ($cookieStore.get("system").value == 'SFCARD') ? 'sfcard' : 'sfcardscan';
                    $state.go(url);
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！")
            })
        }
    }
});