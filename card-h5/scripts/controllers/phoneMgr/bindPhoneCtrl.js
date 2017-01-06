/**
 * 绑定手机
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('bindPhoneCtrl', function ($scope, $rootScope, $interval, $state, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;

    /*判断是否绑定了手机号 true --- 修改手机号码  false --- 绑定手机号码*/
    $scope.hasMmobile = $cookieStore.get("mobile").value ? true : false;

    /*初始化参数*/
    $scope.params = {
        coatingCode: '',
        phone: '',
        code: ''
    };

    /*获取短信验证码*/
    $scope.sendCode = function () {
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
        if ($scope.params.phone == '' || !phoneReg.test($scope.params.phone)) {
            mui.alert("请先输入正确的手机号！");
            return false;
        }
        var params = {
            mobile: encodeService.encode64($scope.params.phone),
            op: $scope.hasMmobile ? encodeService.encode64('UPDATE_PHONE') : encodeService.encode64('BIND_PHONE')
        };
        $interval.cancel($scope.timer);
        dataService.getSmsCode(params).success(function (obj) {
            if (obj.success) {
                $scope.showCode = true;
                $scope.startTimer(60);
                mui.toast("验证码已发送" + $scope.params.phone);
            } else {
                errorTips(obj, $state);
                $scope.startTimer(obj.msgData);
            }
        }).error(function () {
            mui.alert("系统繁忙，请稍后重试！");
        });
    };

    /*绑定手机号*/
    $scope.confrim = function () {
        if (!$scope.bindPhoneForm.$invalid) {
            var params = {
                confirmCode: encodeService.encode64($scope.params.code)
            };

            $scope.hasMmobile ? params.newMobile = encodeService.encode64($scope.params.phone) : params.mobile = encodeService.encode64($scope.params.phone);

            if ($scope.hasMmobile) {
                dataService.updateMobile(params).success(function (obj) {
                    successTips(obj);
                }).error(function () {
                    mui.alert("系统繁忙，请稍后重试！");
                });
            } else {
                dataService.bindMobile(params).success(function (obj) {
                    successTips(obj);
                }).error(function () {
                    mui.alert("系统繁忙，请稍后重试！");
                });
            }
        }
    };


    /*定时器*/
    $scope.startTimer = function (second) {
        $scope.second = second;
        $scope.timer = $interval(function () {
            $scope.second--;
            if ($scope.second == 0) {
                $scope.showCode = true;
            }
        }, 1000, second);
    };

    function successTips(obj) {
        if (obj.success) {
            $cookieStore.put("tips", {
                title: obj.msg,
                content: "请记住您的手机号，可以使用手机号找回密码",
                url: ($cookieStore.get("system").value == 'SFCARD') ? 'sfcard' : 'sfcardscan'
            });
            $cookieStore.put("mobile", {value: $scope.params.phone});
            $state.go("pwdSuccess");
        } else {
            errorTips(obj, $state);
        }
    }
});