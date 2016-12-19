/**
 * 找回密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('findPwdCtrl', function ($scope, $rootScope, $interval, $cookieStore, $state, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;

    $scope.params = {
        code: ''
    };

    $scope.mobile = $cookieStore.get("mobile").value;

    $scope.smsParams = {
        mobile: '',
        op: encodeService.encode64("RESET_PWD")
    };
    /*进入页面就发一条信息*/
    getMsgCode();

    /*定时器*/
    function timer() {
        $scope.second = 60;
        $interval(function () {
            $scope.second--;
            if ($scope.second == 0) {
                $scope.showCode = true;
            }
        }, 1000, 60);
    }

    /*再次发送*/
    $scope.sendMsg = function () {
        $scope.showCode = false;
        getMsgCode();
        timer();
    };

    /*下一步*/
    $scope.next = function () {
        if (!$scope.findPwdForm.$invalid) {
            var params = {
                confirmCode: encodeService.encode64($scope.params.code),
                op: encodeService.encode64("RESET_PWD")
            };
            dataService.mobileValidate(params).success(function (obj) {
                if (obj.success) {
                    $state.go("setPwd");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            });
        }
    };


    function getMsgCode() {
        dataService.getSmsCode($scope.smsParams).success(function (obj) {
            if (obj.success) {
                timer();
                mui.toast("验证码已发送" + $scope.mobile);
            } else {
                mui.alert(obj.msg);
            }
        }).error(function () {
            mui.alert("系统繁忙，请稍后重试！");
        });
    }
});