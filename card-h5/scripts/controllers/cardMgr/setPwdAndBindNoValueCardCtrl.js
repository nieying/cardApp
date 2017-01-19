/**
 * 实体卡微信扫码速运回传(设置密码 并绑定(无面额))顺丰卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('setPwdAndBindNoValueCardCtrl',['$scope', '$rootScope', '$stateParams', '$state', '$interval', '$cookieStore', 'encodeService', 'dataService', function ($scope, $rootScope, $stateParams, $state, $interval, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;


    $scope.op = encodeService.encode64('SET_PWD_NOVALUECARD');
    $scope.showCode = true;
    $scope.isGetCode = true;
    $scope.code = '';

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
        if (!regular.reg6.test($scope.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }

        if (!$scope.scanCodeForm.$invalid) {
            var params = {
                cno: encodeService.encode64($stateParams.cno),
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk),
                mobile: encodeService.encode64($scope.params.phone),
                confirmCode: encodeService.encode64($scope.code)
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