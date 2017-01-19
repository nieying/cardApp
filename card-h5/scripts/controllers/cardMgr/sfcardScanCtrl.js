/**
 * 通过扫码进来的ctrl
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardScanCtrl', ['$scope', '$rootScope', '$cookieStore', '$state', '$stateParams', 'dataService', function ($scope, $rootScope, $cookieStore, $state, $stateParams, dataService) {
    $rootScope.loading = true;    //页面进来时显示的加载的动画！
    $scope.showView = false;
    $scope.showPwd = false;
    clearCookie();
    $cookieStore.put("system", {value: 'SFCARDSCAN'});

    $scope.params = {
        pwd:''
    };


    /*交易明細------>输入密码*/
    $scope.showPwdView = function () {
        $scope.showPwd = true;
        $scope.pwdDes3Sk = '';

        /*获取密码加密格式*/
        dataService.getDes3Sk().success(function (obj) {
            if (obj.success) {
                $scope.pwdDes3Sk = obj.msgData.des3Sk;
            }
        });
    };

    $scope.forgetPwd = function () {
        if ($scope.cardInfo.mobile == null) {
            $state.go("bindPhone", {mobile: ''});
        } else {
            $state.go("findPwd",{mobile: $scope.cardInfo.mobile});
        }
    };

    /*扫码进来获取卡信息*/
    dataService.getSfcardCardInfo().success(function (obj) {
        $scope.showView = true;
        $rootScope.loading = false;
        if (obj.success) {
            $scope.cardInfo = obj.msgData;
        } else {
          errorTips(obj,$state);
        }
    }).error(function () {
       systemBusy($rootScope,$state);
    });


    /*判断是否为无面额卡*/
    $scope.goSetPwd = function () {
        if ($scope.cardInfo.noValueCardPwdNotSet) {
            $state.go("pwdSetNoValueCard");
        } else {
            $state.go("pwdSet");
        }
    };

    /*输入密码操作*/
    $scope.confirmPwd = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!regular.reg8.test($scope.params.pwd)) {
            mui.alert(tipMsg.COMFIRM_OLD_PWD);
            return false;
        }
        if (!$scope.pwdForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.tradeValidate(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    $state.go("trade");
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            })
        }
    };

    /*获取电话*/
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
