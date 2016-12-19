/**
 * 绑卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('bindUsingCardCtrl', function ($scope, $rootScope, $cookieStore, $state, encodeService, dataService) {
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
        if (!$scope.bindCardForm.$invalid) {
            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }

            $rootScope.loading = true;
            var params = {
                pwd: DES3.encrypt($scope.params.pwd, $scope.pwdDes3Sk)
            };
            debugger;
            dataService.bindUsingCard(params).success(function (obj) {
                if (obj.success) {
                    $state.go("sfcards");
                    $rootScope.loading = false;
                } else {
                    errorTips(obj, $state);
                    $rootScope.loading = false;
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            })
        }
    }
});