/**
 * 手机号码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('changeMobileCtrl',['$scope', '$rootScope', '$state', '$stateParams' , '$interval', 'encodeService', 'dataService', function ($scope, $rootScope, $state, $stateParams, $interval, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;
    $scope.showChangeMobile = false;
    $scope.mobile = $stateParams.mobile;

    $scope.params = {
        code: ''
    };

    /*跟换*/
    $scope.mobileValidateView = function () {
        $scope.showChangeMobile = true;
        /*进入页面就发一条信息*/
        getMsgCode();
    };

    /*下一步*/
    $scope.next = function () {
        if (!regular.reg6.test($scope.params.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        if (!$scope.phoneForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                confirmCode: encodeService.encode64($scope.params.code),
                op: encodeService.encode64("UPDATE_PHONE")
            };
            dataService.mobileValidate(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    /**/
                    $state.go("bindPhone", {mobile: $scope.mobile});
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope, $state)
            });
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

    /*再次发送*/
    $scope.sendCode = function () {
        // $interval.cancel($scope.timer);
        $scope.showCode = false;
        getMsgCode();
    };

    function getMsgCode() {
        var params = {
            mobile: '',
            op: encodeService.encode64("UPDATE_PHONE")
        };
        $interval.cancel($scope.timer);
        dataService.getSmsCode(params).success(function (obj) {
            if (obj.success) {
                $scope.startTimer(60);
                mui.toast("验证码已发送" + $scope.mobile);
            } else {
                errorTips(obj,$state);
                $scope.startTimer(obj.msgData);
            }
        }).error(function () {
            systemBusy($rootScope, $state)
        });
    }
}]);