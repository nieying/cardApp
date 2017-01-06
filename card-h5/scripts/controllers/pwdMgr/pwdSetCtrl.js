/**
 * 扫卡设置密码Ctrl 实体卡设置密码
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('pwdSetCtrl', function ($scope, $rootScope, $state, $cookieStore, encodeService, dataService) {
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
        coatingCode: '',
        pwd: '',
        confrimPwd: ''
    };

    /*确认设置密码*/
    $scope.confrim = function () {
        if (!$scope.scanCodeForm.$invalid) {
            if ($scope.params.coatingCode.length != 6) {
                mui.toast("请输入6位数字涂层码！");
                return false;
            }
            if ($scope.params.pwd != $scope.params.confrimPwd) {
                mui.toast("确认密码与设置密码不一致！");
                return false;
            }
            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }
            var params = {
                coatingCode: encodeService.encode64($scope.params.coatingCode),
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.scanSetPwd(params).success(function (obj) {
                if (obj.success) {
                    $cookieStore.put("tips", {
                        title: "设置密码成功",
                        content: "请记住您的新密码，使用卡片支付运费时将需使用",
                        url: 'sfcardscan'
                    });
                    $state.go("pwdSuccess");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            });
        }
    }
});