/**
 * 扫卡设置密码Ctrl
 * Created by nieying on 2016/6/6.
 */

angular.module('cardApp').controller('pwdSetNoValueCardCtrl', function ($scope, $rootScope, $state, $interval, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;
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
        confrimPwd: '',
        phone: '',
        code: ''
    };

    /*定时器*/
    function timer() {
        $scope.second = 60;
        $interval(function () {
            $scope.second--;
            if ($scope.second == 0) {
                $scope.showCode = false;
            }
        }, 1000, 60);
    }

    /*获取短信验证码*/
    $scope.sendCode = function () {
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
        if ($scope.params.phone == '' || !phoneReg.test($scope.params.phone)) {
            mui.alert("请先输入正确的手机号！");
            return false;
        }
        var params = {
            mobile:encodeService.encode64($scope.params.phone),
            op:encodeService.encode64('SET_PWD_NOVALUECARD')
        };
        dataService.getSmsCode(params).success(function (obj) {
            if (obj.success) {
                $scope.showCode = true;
                timer();
                mui.toast("验证码已发送" + $scope.params.phone);
            } else {
                if(obj.code == '01'){
                    //todo
                }else if(obj.code == '02'){
                    //todo
                }else{
                    //todo
                }
                errorTips(obj, $state);
            }
        }).error(function () {
            mui.alert("系统繁忙，请稍后重试！");
        });
    };

    /*确认设置密码*/
    $scope.confrim = function () {
        if (!$scope.scanCodeForm.$invalid) {
            if ($scope.params.pwd != $scope.params.confrimPwd) {
                mui.toast("确认密码与设置密码不一致！");
                return false;
            }

            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }

            var params = {
                pwd: DES3.encrypt($scope.params.pwd,$scope.pwdDes3Sk),
                mobile: encodeService.encode64($scope.params.phone),
                confirmCode:encodeService.encode64($scope.params.code)
            };

            dataService.noValueCardSetPwd(params).success(function (obj) {
                if (obj.success) {
                    $cookieStore.put("tips", {
                        title: obj.msg,
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