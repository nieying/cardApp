/**
 * 绑卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('bindCardCtrl', ['$scope', '$rootScope', '$stateParams','$cookieStore', '$state', 'encodeService', 'dataService', function ($scope, $rootScope,$stateParams, $cookieStore, $state, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showBindCard = false;
    $scope.pwdDes3Sk = '';
    $scope.showScanCode = true;
    $scope.showCno = $cookieStore.get("showCno") ? $cookieStore.get("showCno") : false;

    $scope.params = {
        cno: $stateParams.cno,
        pwd: ''
    };

    /**获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /**绑定当前顺丰卡*/
    $scope.bindCard = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if(!regular.reg8.test($scope.params.pwd)){
            mui.alert(tipMsg.COMFIRM_OLD_PWD);
            return false;
        }
        if (!$scope.bindCardForm1.$invalid) {
            $rootScope.loading = true;
            var params = {
                cno: encodeService.encode64($scope.params.cno),
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
    };
}]);