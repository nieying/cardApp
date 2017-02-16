/**
 * 单卡ctrl
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardCtrl',['$scope', '$rootScope', '$stateParams', '$state', '$cookieStore', 'dataService', function ($scope, $rootScope, $stateParams, $state, $cookieStore, dataService) {
    $rootScope.loading = true;    //页面进来时显示的加载的动画！
    $scope.showPwd = false;
    $scope.params = {
        pwd: ''
    };

    $cookieStore.put("cardNo", {value: $stateParams.cardNo});

    /**获取单卡信息*/
    dataService.getCardDetail($stateParams.cardNo).success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            $scope.singCardInfo = obj.msgData;
        } else {
            errorTips(obj, $state);
        }
    }).error(function () {
        systemBusy($rootScope,$state);
    });

    $scope.goBack = function () {
        $state.go("sfcards");
    };

    /**显示输入密码页面 解除绑定*/
    $scope.showPwdView = function (data) {
        /**获取密码加密格式*/
        dataService.getDes3Sk().success(function (obj) {
            if (obj.success) {
                $scope.pwdDes3Sk = obj.msgData.des3Sk;
            }
        });
        $scope.isUnbind = data == 0 ? true : false;    //$scope.isUnbind为true ====>解除绑定  false ====>交易详情
        $scope.showPwd = true;
    };

    /**输入密码操作 解除绑定*/
    $scope.confirm = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if(!regular.reg8.test($scope.params.pwd)){
            mui.alert(tipMsg.COMFIRM_OLD_PWD);
            return false;
        }
        if (!$scope.pwdForm.$invalid) {
            $rootScope.loading = true;
            var unbindParams = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            if ($scope.isUnbind) {
                dataService.unbindCard(unbindParams).success(function (obj) {
                    $rootScope.loading = false;
                    if (obj.success) {
                        $state.go("sfcards");
                    } else {
                        errorTips(obj, $state);
                    }
                }).error(function () {
                    systemBusy($rootScope,$state);
                })
            } else {
                //todo
                $state.go("trade");
            }
        }
    };

    /**获取电话*/
    dataService.getServiceTel().success(function (obj) {
        if (obj.success) {
            $scope.tel = obj.msgData;
        } else {
            errorTips(obj, $state)
        }
    }).error(function () {
        systemBusy($rootScope,$state);
    })
}]);