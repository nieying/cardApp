/**
 * 实体卡微信扫码速运回传(设置密码 并绑定(无面额))顺丰卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('setPwdAndBindNoValueCardCtrl',['$scope', '$rootScope', '$stateParams', '$state', '$interval', '$cookieStore', 'encodeService', 'dataService', function ($scope, $rootScope, $stateParams, $state, $interval, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showCode = false;
    $scope.pwdDes3Sk = '';

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    $scope.showCno = $cookieStore.get("showCno") ? $cookieStore.get("showCno") : false;

    /*初始化参数*/
    $scope.params = {
        cno: $stateParams.cno,
        pwd: '',
        confirmPwd: '',
        phone: '',
        code: ''
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

    /*获取短信验证码*/
    $scope.sendCode = function () {
        if (!regular.regp.test($scope.params.phone)) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        var params = {
            mobile: encodeService.encode64($scope.params.phone),
            op: encodeService.encode64('SET_PWD_NOVALUECARD')
        };
        $interval.cancel($scope.timer);
        dataService.getSmsCode(params).success(function (obj) {
            if (obj.success) {
                $scope.showCode = true;
                $scope.startTimer(60);
                mui.toast("验证码已发送" + $scope.params.phone);
            } else {
                if (obj.code == '01') {
                    //todo
                } else if (obj.code == '02') {
                    //todo
                } else {
                    //todo
                }
                errorTips(obj, $state);
                $scope.startTimer(obj.msgData);
            }
        }).error(function () {
            systemBusy($rootScope,$state);
        });
    };

    /*确认设置密码*/
    $scope.confrim = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if(!regular.reg6.test($scope.params.pwd)){
            mui.alert(tipMsg.COMFIRM_PWD);
            return false;
        }
        if ($scope.params.pwd != $scope.params.confirmPwd) {
            mui.alert(tipMsg.CONFIRM_PWD_NOT_SAME);
            return false;
        }
        if (!regular.regp.test($scope.params.phone)) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        if (!regular.reg6.test($scope.params.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }

        if (!$scope.scanCodeForm.$invalid) {
            var params = {
                cno: encodeService.encode64($stateParams.cno),
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk),
                mobile: encodeService.encode64($scope.params.phone),
                confirmCode: encodeService.encode64($scope.params.code)
            };
            dataService.setPwdAndBindNoValueCard(params).success(function (obj) {
                if (obj.success) {
                    if ($scope.showCno) {//绑卡流程
                        $cookieStore.put("showCno", {value: false});
                        $state.go("sfcards");
                    } else {
                        $state.go("sfcards");
                    }
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            });
        }
    }
}]);