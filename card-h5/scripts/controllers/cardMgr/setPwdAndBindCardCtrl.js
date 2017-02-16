/**
 * 绑卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('setPwdAndBindCardCtrl', ['$scope', '$rootScope', '$cookieStore', '$stateParams', '$state', 'encodeService', 'dataService', function ($scope, $rootScope, $cookieStore, $stateParams, $state, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.pwdDes3Sk = '';

    $scope.showCno = $cookieStore.get("showCno") ? $cookieStore.get("showCno") : false;
    $scope.params = {
        cno: $stateParams.cno,
        pwd: '',
        confirmPwd: '',
        coatingCode:''
    };

    /**获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /**绑定卡事件*/
    $scope.confrim = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!regular.reg6.test($scope.params.coatingCode)) {
            mui.alert(tipMsg.CONFIRM_COATINGCODE);
            return false;
        }
        if (!regular.reg6.test($scope.params.pwd)) {
            mui.alert(tipMsg.COMFIRM_PWD);
            return false;
        }
        if ($scope.params.pwd != $scope.params.confirmPwd) {
            mui.alert(tipMsg.CONFIRM_PWD_NOT_SAME);
            return false;
        }
        $rootScope.loading = true;
        var params = {
            cno: encodeService.encode64($stateParams.cno),
            pwd: aesEncode($scope.params.pwd,$scope.pwdDes3Sk),
            coatingCode: encodeService.encode64($scope.params.coatingCode)
        };
        dataService.setPwdAndBindCard(params).success(function (obj) {
            $rootScope.loading = false;
            if (obj.success) {
                $cookieStore.put("showCno", {value: false});
                $state.go("sfcards");
            } else {
                if (obj.msg == '连接失效,请重新登录') {
                    mui.alert(tipMsg.SESSION_INVALID, function () {
                        $state.go("error", {code: '408'});
                    });
                } else if (obj.msg == '请勿重复绑卡') {
                    mui.alert(obj.msg, function () {
                        $state.go("sfcards");
                    });
                } else {
                    mui.alert(obj.msg);
                }
            }
        }).error(function () {
            systemBusy($rootScope, $state);
        })
    }
}]);