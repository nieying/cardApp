/**
 * 手机号码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('changeMobileCtrl', function ($scope, $rootScope, $state, $cookieStore, $interval, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;
    $scope.showChangeMobile = false;
    $scope.mobile = $cookieStore.get("mobile").value;

    var params = {
        mobile: '',
        op: encodeService.encode64("UPDATE_PHONE")
    };

    /*跟换*/
    $scope.mobileValidateView = function () {
        $scope.showChangeMobile = true;
        /*进入页面就发一条信息*/
        getMsgCode();
    };

    /*下一步*/
    $scope.next = function () {
        if (!$scope.phoneForm.$invalid) {
            var params = {
                confirmCode: encodeService.encode64($scope.params.code),
                op: encodeService.encode64("UPDATE_PHONE")
            };
            dataService.mobileValidate(params).success(function (obj) {
                if (obj.success) {
                    /**/
                    $state.go("bindPhone");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            });
        }
    };

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
        $interval.cancel(timer);
        $scope.showCode = false;
        timer();
        getMsgCode();
    };

    /*获取验证码*/
    $scope.sendCode = function () {
        $interval.cancel(timer);
        $scope.showCode = true;
        timer();
    };


    function getMsgCode() {
        dataService.getSmsCode(params).success(function (obj) {
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