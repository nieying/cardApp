/**
 * 绑卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('bindCardCtrl', ['$scope', '$rootScope', '$cookieStore', '$state', 'encodeService', 'dataService', function ($scope, $rootScope, $cookieStore, $state, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.showBindCard = false;
    $scope.pwdDes3Sk = '';
    $scope.showScanCode = true;

    /**获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    $scope.params = {
        cno: '',
        pwd: ''
    };

    /**确定卡号跳转页面*/
    $scope.confirmCardNo = function () {
        if(!regular.reg16.test($scope.params.cno)){
            mui.alert(tipMsg.COMFIRM_CARDNO);
            return false;
        }
        if (!$scope.verifyBindCardForm.$invalid) {
            var params = {
                cno: encodeService.encode64($scope.params.cno)
            };
            dataService.verifyBindingCard(params).success(function (obj) {
                $rootScope.loading = true;
                if (obj.success) {
                    if (obj.msgData.url == "setPwdAndBindNoValueCard") {
                        $state.go("setPwdAndBindNoValueCard", {cno: $scope.params.cno});
                        $cookieStore.put("showCno", {value: true});
                    } else if (obj.msgData.url == "setPwdAndBindCard") {
                        $state.go("setPwdAndBindCard", {cno: $scope.params.cno});
                        $cookieStore.put("showCno", {value: true});
                    } else {
                        $scope.showBindCard = true;
                    }
                    $rootScope.loading = false;
                } else {
                    errorTips(obj, $state);
                    $rootScope.loading = false;
                }
            }).error(function () {
                systemBusy($rootScope,$state);
            })
        }
    };

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

    /**设置微信扫码*/
    if (isWeiXin()) {
        var params = {
            locationUrl: window.location.href
        };
        dataService.getWeChatConfig(params).success(function (obj) {
            if (obj) {
                wx.config({
                    debug: false,
                    appId: obj.appId,
                    timestamp: obj.timestamp,
                    nonceStr: obj.nonceStr,
                    signature: obj.signature,
                    jsApiList: ['scanQRCode']
                });

                wx.error(function () {
                    $scope.showScanCode = false;
                });
            } else {
                $scope.showScanCode = false;
            }
        }).error(function () {
            $scope.showScanCode = false;
        })
    } else if (isSfApp()) {
        $scope.showScanCode = true;
    } else {
        $scope.showScanCode = false;
    }

    /**点击扫码操作*/
    $scope.scanCode = function () {
        if (isWeiXin()) {
            mui.prompt('模拟微信扫码', '请输入卡号', '卡号', ['确定', '取消'], function (res) {
                if (res.index == 0) {
                    setScanResult(res.value);
                }
            });

            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    console.log("scan code res", res);
                    var result = res.resultStr;
                    if (result.indexOf(",") >= 0) {
                        setScanResult(result.split(",")[1]);
                    } else {
                        setScanResult(result);
                    }
                }
            });
            return false;
        } else if (isSfApp()) {
            console.log("isSFAPPBowser");
            window.location.href = "ActionInterface.openCodeScanPage";
            // $scope.params.cno = setScanResult("878976846465464646");
            return false;
        }
    };

    $scope.$watch("params.cno", function (newValue, oldValue) {
        if (newValue) setScanResult(newValue);
    })
}]);