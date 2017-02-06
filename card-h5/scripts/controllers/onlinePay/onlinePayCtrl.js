/**
 * 在线支付
 * Created by nieying on 2016/6/7.
 */

angular.module('cardApp').controller('onlinePayCtrl', ['$scope', '$rootScope', '$state', 'dataService', 'encodeService', function ($scope, $rootScope, $state, dataService, encodeService) {
    $rootScope.loading = false;
    $scope.showOnline = true;//判断显示选卡页面
    $scope.balanceCardList = []; //余额不足卡列表；
    $scope.cardList = []; //余额足够卡列表
    $scope.pwdDes3Sk = '';//密码加密字符串
    $scope.balanceAmt = []; //卡可用余额；
    $scope.showScanCode = true;

    /**初始化支付并绑卡页面的参数*/
    $scope.params = {
        password: '',//支付密码
        cno: '',
        pwd: ''
    };

    /**获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /**取消支付*/
    $scope.cancelPay = function () {
        mui.confirm("是否放弃支付?","",["取消","确定"],function (e) {
            if(e.index == 1){
                window.location.href = $scope.onlineInfo.cancelUrl
            }else{
                //todo
            }
        })
    };

    /**获取支付信息*/
    dataService.onlinePay().success(function (obj) {
        if(obj.success){
            $scope.onlineInfo = obj.msgData;
            if ($scope.onlineInfo.cardOptionList.length == 0) {//判断该会员号有没有绑卡，没有绑卡跳到支付并绑卡页面
                $state.go("addCard");
            }

            $scope.cardList = _.filter($scope.onlineInfo.cardOptionList, function (card) {
                return card.cardBalanceAmt >= $scope.onlineInfo.payAmt;
            });

            /*默认选择金额最大的一张卡支付*/
            _.filter($scope.cardList, function (card) {
                $scope.balanceAmt.push(card.cardBalanceAmt);
            });
            $scope.defaultPayCard = _.filter($scope.cardList, function (card) {
                if (card.cardBalanceAmt == _.max($scope.balanceAmt)) {
                    return card;
                }
            });

            $scope.balanceCardList = _.filter($scope.onlineInfo.cardOptionList, function (card) {
                return card.cardBalanceAmt < $scope.onlineInfo.payAmt;
            });

            _.each($scope.cardList, function (card) {
                if ($scope.defaultPayCard[0].cardNo == card.cardNo) {
                    return card.checked = true;
                } else {
                    card.checked = false;
                }
            });
        }else{
            errorTips(obj,$rootScope)
        }
    }).error(function () {
       systemBusy($rootScope,$state);
    });

    $scope.showSelectCard = function () {
        $scope.showOnline = false;
    };

    /**选择支付卡*/
    $scope.selectCard = function (chooseCard) {
        $scope.defaultPayCard = [chooseCard];
        _.each($scope.cardList, function (card) {
            if (chooseCard.cardNo == card.cardNo) {
                return card.checked = true;
            } else {
                card.checked = false;
            }
        });
        $scope.showOnline = true;
    };

    /**立即支付*/
    $scope.repay = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!regular.reg6.test($scope.params.password)) {
            mui.alert(tipMsg.COMFIRM_PWD);
            return false;
        }
        $rootScope.loading = true;
        $rootScope.loadingText = "支付中...";
        var params = {
            bizSn: $scope.onlineInfo.bizSn,
            outOrderNo: $scope.onlineInfo.outOrderNo,
            cno: encodeService.encode64($scope.defaultPayCard[0].cardNo),
            pwd: aesEncode($scope.params.password, $scope.pwdDes3Sk)

        };
        dataService.repay(params).success(function (obj) {
            if (obj.success) {
                $rootScope.loadingText = "支付成功，正在跳转...";
                window.location.href = obj.msgData.url;
            } else {
                $rootScope.loading = false;
                errorTips(obj, $state);
            }
        }).error(function () {
            systemBusy($rootScope,$state);
        })
    };

    /**支付并綁定*/
    $scope.payBindCard = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert(tipMsg.GET_DES3SK_FAIL);
            return false;
        }
        if (!regular.reg16.test($scope.params.cno)) {
            mui.alert(tipMsg.COMFIRM_CARDNO);
            return false;
        }
        if (!regular.reg8.test($scope.params.pwd)) {
            mui.alert(tipMsg.COMFIRM_OLD_PWD);
            return false;
        }
        if (!$scope.addCardForm.$invalid) {
            $rootScope.loading = true;
            $rootScope.loadingText = "支付中...";
            var params = {
                bizSn: $scope.onlineInfo.bizSn,
                outOrderNo: $scope.onlineInfo.outOrderNo,
                cno: encodeService.encode64($scope.params.cno),
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.bindAndPay(params).success(function (obj) {
                if (obj.success) {
                    $rootScope.loadingText = "支付成功，正在跳转...";
                    window.location.href = obj.msgData.url;
                } else {
                    $rootScope.loading = false;
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
            alert("wechat scan code"); //console;
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
            console.log("isSfAppBowser");
            window.location.href = "ActionInterface.openCodeScanPage";
            return false;
        }
    };

    $scope.$watch("params.cno", function (newValue, oldValue) {
        if (newValue) setScanResult(newValue);
    })
}]);