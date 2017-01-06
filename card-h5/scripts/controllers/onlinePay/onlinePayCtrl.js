/**
 * 在线支付
 * Created by nieying on 2016/6/7.
 */

angular.module('cardApp').controller('onlinePayCtrl',['$scope', '$rootScope','$state', 'dataService', 'encodeService',function ($scope, $rootScope, $state, dataService, encodeService) {
    $rootScope.loading = false;
    $scope.showOnline = true;//判断显示选卡页面
    $scope.balanceCardList = []; //余额不足卡列表；
    $scope.cardList = []; //余额足够卡列表
    $scope.pwdDes3Sk = '';//密码加密字符串
    $scope.balanceAmt = []; //卡可用余额；
    $scope.showScanCode = true;

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });



    //初始化支付并绑卡页面的参数
    $scope.params = {
        password: '',//支付密码
        cno: '',
        pwd: ''
    };

    /*获取支付信息*/
    dataService.onlinePay().success(function (obj) {
        $scope.onlineInfo = obj.msgData;

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

    }).error(function () {
        mui.toast("系统繁忙，请稍后重试！");
    });

    $scope.showSelectCard = function () {
        $scope.showOnline = false;
    };

    /*选择支付卡*/
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

    /*立即支付*/
    $scope.repay = function () {
        if ($scope.pwdDes3Sk == '') {
            mui.alert("获取秘钥失败，请刷新重试！");
            return false;
        }
        if ($scope.params.password == '') {
            mui.alert("请输入支付密码！");
            return false;
        }
        $rootScope.loading = true;
        $rootScope.loadingText = "请稍后......!";
        var params = {
            bizSn: $scope.onlineInfo.bizSn,
            outOrderNo: $scope.onlineInfo.outOrderNo,
            cno: encodeService.encode64($scope.defaultPayCard[0].cardNo + ''),
            pwd: aesEncode($scope.params.password, $scope.pwdDes3Sk)

        };

        dataService.repay(params).success(function (obj) {
            if (obj.success) {
                $rootScope.successInfo = obj;
                $state.go('paySuccess');
                $rootScope.loading = false;
            } else {
                mui.alert(obj.msg);
                $rootScope.loading = false;
            }
        }).error(function () {
            mui.alert("系统繁忙，请稍后重试！");
        })
    };

    /*支付并綁定*/
    $scope.payBindCard = function () {
        if (!$scope.addCardForm.$invalid) {
            if ($scope.params.cno == '' || $scope.params.pwd == '') {
                mui.alert("请输入卡号或密码！");
                return false;
            }
            var params = {
                bizSn: $scope.onlineInfo.bizSn,
                outOrderNo: $scope.onlineInfo.outOrderNo,
                cno: encodeService.encode64($scope.params.cno + ''),
                pwd: aesEncode($scope.params.pwd, $scope.pwdDes3Sk)
            };

            dataService.bindAndPay(params).success(function (obj) {
                if (obj.success) {
                    $scope.successInfo = obj;
                    $state.go('paySuccess');
                    $rootScope.loading = false;
                } else {
                    mui.alert(obj.msg);
                    $rootScope.loading = false;
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            })
        }
    };

    /*设置微信扫码*/
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

                wx.error(function (res) {
                    $scope.showScanCode = false;
                });
            } else {
                $scope.showScanCode = false;
            }
        }).error(function (err) {
            $scope.showScanCode = false;
        })
    } else if (isSfApp()) {
        $scope.showScanCode = true;
    } else {
        $scope.showScanCode = false;
    }

    /*点击扫码操作*/
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

    function setScanResult(str) {
        str = str + "";
        $scope.params.cno = str.replace(/\D/g, '').replace(/....(?!$)/g, '$& ');
    }
}]);