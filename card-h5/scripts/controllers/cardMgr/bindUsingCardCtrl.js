/**
 * 绑卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('bindUsingCardCtrl',['$scope', '$rootScope', '$state', 'dataService', function ($scope, $rootScope, $state, dataService) {
    $rootScope.loading = false;
    $scope.pwdDes3Sk = '';

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    $scope.parmas = {
        pwd: ''
    };

    /*绑定卡事件*/
    $scope.confrim = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tisMsg.GET_DES3SK_FAIL);
            return false;
        }
        if(!regular.reg6.test($scope.params.pwd)){
            mui.alert(tipMsg.COMFIRM_PWD);
            return false;
        }
        if (!$scope.bindCardForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.bindUsingCard(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    $state.go("sfcards");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            })
        }
    }
}]);