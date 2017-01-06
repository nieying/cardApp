/**
 * 修改密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('changePwdCtrl',function ($scope, $rootScope, $state, encodeService, dataService, $cookieStore) {
    $scope.system = $cookieStore.get("system").value;
    $rootScope.loading = false;
    $scope.params = {
        oldPwd: '',
        newPwd: '',
        confrimPwd: ''
    };

    $scope.pwdDes3Sk = '';

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /*判断是否绑定了手机号 如果没绑定就跳到绑定手机号页面*/
    $scope.hasMmobile = $cookieStore.get("mobile").value ? true : false;

    /*修改密码*/
    $scope.updatePwd = function () {
        if (!$scope.changPwdForm.$invalid) {
            if ($scope.params.newPwd != $scope.params.confrimPwd) {
                mui.alert('两次密码输入不一致！');
                return false;
            }

            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }

            var params = {
                pwd: aesEncode($scope.params.oldPwd,$scope.pwdDes3Sk),
                newPwd: aesEncode($scope.params.newPwd,$scope.pwdDes3Sk)
            };

            dataService.changePwd(params).success(function (obj) {
                if (obj.success) {
                    var url = ($scope.system == 'SFCARD') ? 'sfcard' : 'sfcardscan';
                    $cookieStore.put("tips", {
                            title: obj.msg,
                            content: "请记住您的新密码，使用卡片支付运费时将需使用",
                            url: url
                        });
                    $state.go("pwdSuccess");
                } else {
                    errorTips(obj,$state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            });
        }
    }
});