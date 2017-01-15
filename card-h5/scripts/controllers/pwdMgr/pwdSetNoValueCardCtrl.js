/**
 * 扫卡设置无面额卡密码Ctrl
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
            mobile:encodeService.encode64($scope.params.phone),
            op:encodeService.encode64('SET_PWD_NOVALUECARD')
        };
        $interval.cancel($scope.timer);
        dataService.getSmsCode(params).success(function (obj) {
            if (obj.success) {
                $scope.showCode = true;
                $scope.startTimer(60);
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
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.pwd,$scope.pwdDes3Sk),
                mobile: encodeService.encode64($scope.params.phone),
                confirmCode:encodeService.encode64($scope.params.code)
            };

            dataService.noValueCardSetPwd(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.alert("无面额卡设置密码成功！",function () {
                        $state.go("sfcardscan");
                    })
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            });
        }
    }
});