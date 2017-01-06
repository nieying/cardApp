/**
 * 通过扫码进来的ctrl
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardScanCtrl', function ($scope, $rootScope, $stateParams, dataService, encodeService, $cookieStore, $location, $state) {
    $rootScope.loading = true;    //页面进来时显示的加载的动画！
    $scope.showView = false;
    $scope.showPwd = false;
    $cookieStore.put("system", {value: 'SFCARDSCAN'});

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

    /*扫码进来获取卡信息*/
    dataService.getSfcardCardInfo().success(function (obj) {
        $scope.showView = true;
        if (obj.success) {
            $scope.cardInfo = obj.msgData;
            $rootScope.loading = false;
            $cookieStore.put("mobile", {value: $scope.cardInfo.mobile});
            $cookieStore.put("remark", {value: $scope.cardInfo.remark});
        } else {
            $state.go('error', {code: obj.title});//扫码进来请求错误跳到错误页面去
            $rootScope.loading = false;
        }
    }).error(function () {
        mui.alert("系统繁忙，请稍后重试！", function () {
            //todo
        });
        $state.go('sfcard');
        $rootScope.loading = false;
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
        if (!$scope.pwdForm.$invalid) {
            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }
            $rootScope.loading = true;
            var params = {
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.tradeValidate(params).success(function (obj) {
                if (obj.success) {
                    $rootScope.loading = false;
                    $state.go("trade");
                } else {
                    $rootScope.loading = false;
                    errorTips(obj, $state);
                }
            }).error(function () {
                $rootScope.loading = false;
                mui.alert("系统繁忙，请稍后重试！");
            })
        }
    }

    /*获取电话*/
    dataService.getServiceTel().success(function (obj) {
        if(obj.success){
            $scope.tel = obj.msgData;
        }else{
            errorTips(obj,$state)
        }
    }).error(function (err) {
        mui.alert(err)
    })
});
