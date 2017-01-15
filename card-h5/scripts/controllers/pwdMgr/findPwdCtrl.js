/**
 * 找回密码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('findPwdCtrl', ['$scope', '$rootScope', '$interval', '$cookieStore', '$state', '$stateParams', 'encodeService', 'dataService', function ($scope, $rootScope, $interval, $cookieStore, $state, $stateParams, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;

    $scope.params = {
        code: ''
    };

    $scope.mobile = $stateParams.mobile;

    $scope.smsParams = {
        mobile: '',
        op: encodeService.encode64("RESET_PWD")
    };
    /*进入页面就发一条信息*/
    getMsgCode();

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

    /*再次发送*/
    $scope.sendCode = function () {
        $interval.cancel($scope.timer);
        $scope.showCode = false;
        getMsgCode();
    };

    /*下一步*/
    $scope.next = function () {
        if (!regular.reg6.test($scope.params.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        if (!$scope.findPwdForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                confirmCode: encodeService.encode64($scope.params.code),
                op: encodeService.encode64("RESET_PWD")
            };
            dataService.mobileValidate(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    $state.go("setPwd");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope, $state)
            });
        }
    };


    function getMsgCode() {
        $interval.cancel($scope.timer);
        dataService.getSmsCode($scope.smsParams).success(function (obj) {
            if (obj.success) {
                $scope.startTimer(60);
                mui.toast("验证码已发送" + $scope.mobile);
            } else {
                errorTips(obj, $state);
                $scope.startTimer(obj.msgData);
            }
        }).error(function () {
            systemBusy($rootScope, $state)
        });
    }
}]);