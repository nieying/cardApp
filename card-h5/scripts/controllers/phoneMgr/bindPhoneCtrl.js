/**
 * 绑定手机
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('bindPhoneCtrl',['$scope', '$rootScope', '$interval', '$state', '$stateParams', '$cookieStore', 'encodeService', 'dataService', function ($scope, $rootScope, $interval, $state, $stateParams, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;

    /*判断是否绑定了手机号 true --- 修改手机号码  false --- 绑定手机号码*/
    $scope.hasMmobile = $stateParams.mobile ? true : false;

    /*初始化参数*/
    $scope.params = {
        coatingCode: '',
        phone: '',
        code: ''
    };

    /*获取短信验证码*/
    $scope.sendCode = function () {
        if (!regular.regp.test($scope.params.phone)) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        var params = {
            mobile: encodeService.encode64($scope.params.phone+''),
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
                $scope.showCode = false;
                $scope.startTimer(obj.msgData);
            }
        }).error(function () {
            systemBusy($rootScope, $state)
        });
    };

    /*绑定手机号*/
    $scope.confrim = function () {
        if (!regular.regp.test($scope.params.phone)) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        if (!regular.reg6.test($scope.params.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        if (!$scope.bindPhoneForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                confirmCode: encodeService.encode64($scope.params.code+"")
            };
            $scope.hasMmobile ? params.newMobile = encodeService.encode64($scope.params.phone) : params.mobile = encodeService.encode64($scope.params.phone);
            if ($scope.hasMmobile) {
                dataService.updateMobile(params).success(function (obj) {
                    $rootScope.loading = false;
                    successTips(obj, false);
                }).error(function () {
                    systemBusy($rootScope, $state)
                });
            } else {
                dataService.bindMobile(params).success(function (obj) {
                    $rootScope.loading = false;
                    successTips(obj, true);
                }).error(function () {
                    systemBusy($rootScope, $state)
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
                $scope.showCode = false;
            }
        }, 1000, second);
    };

    function successTips(obj, isBind) {
        if (obj.success) {
            var msgPhoneTips = isBind ? tipMsg.BIND_PHONE_SUCCESS : tipMsg.UPDATE_PHONE_SUCCESS;
            mui.alert(msgPhoneTips, function () {
                if ($cookieStore.get("system").value == 'SFCARD') {
                    $state.go("sfcard", {cardNo: $cookieStore.get("cardNo").value});
                } else {
                    $state.go("sfcardscan");
                }
            });
        } else {
            errorTips(obj, $state);
        }
    }
}]);