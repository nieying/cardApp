/**
 * 在线支付
 * Created by nieying on 2016/6/7.
 */

angular.module('cardApp').controller('onlinePayCtrl', function ($scope, $rootScope, $state, onlinePayService, encodeService) {
    $rootScope.loading = false;
    $scope.showOnline = true;//判断显示选卡页面
    $scope.balanceCardList = []; //余额不足卡列表；
    $scope.cardList = []; //余额足够卡列表

    //初始化支付并绑卡页面的参数
    $scope.cardInfo = {
        password: '',
        cardNo: '',
        bindPwd: ''
    };

    /*获取支付信息*/
    onlinePayService.onlinePay().success(function (obj) {
        $scope.onlineInfo = obj.msgData;

        $scope.cardList = _.filter($scope.onlineInfo.cardOptionList, function (card) {
            return card.cardBalanceAmt >= $scope.onlineInfo.payAmt;
        });

        _.map($scope.cardList, function (card) {
            if (_.max([card.cardBalanceAmt])) {
                card.checked = true;
            }
        });

        $scope.balanceCardList = _.filter($scope.onlineInfo.cardOptionList, function (card) {
            return card.cardBalanceAmt < $scope.onlineInfo.payAmt;
        });

        /*默认选择金额最大的一张卡支付*/
        $scope.defaultPayCard = _.filter($scope.cardList, function (card) {
            return _.max([card.cardBalanceAmt]);
        });
    }).error(function () {
        mui.toast("系统繁忙，请稍后重试！");
    });

    $scope.showSelectCard = function () {
        $scope.showOnline = false;
    };

    /*选择支付卡*/
    $scope.selectCard = function (card) {
        $scope.defaultPayCard = [card];
        $scope.showOnline = true;
    };

    /*立即支付*/
    $scope.repay = function () {
        if ($scope.cardInfo.password == '') {
            mui.alert("请输入支付密码！");
            return false;
        }
        $rootScope.loading = true;
        $rootScope.loadingText = "请稍后......!";
        var params = {
            bizSn: $scope.onlineInfo.bizSn,
            outOrderNo: $scope.onlineInfo.outOrderNo,
            cardNo: encodeService.encode64($scope.defaultPayCard[0].cardNo.toString()),
            pwd: encodeService.encode64($scope.cardInfo.password.toString())
        };

        onlinePayService.repay(params).success(function (obj) {
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
        if ($scope.cardInfo.cardNo == '' || $scope.cardInfo.bindPwd == '') {
            mui.alert("请输入卡号或密码！");
            return false;
        }
        var params = {
            bizSn: $scope.onlineInfo.bizSn,
            outOrderNo: $scope.onlineInfo.outOrderNo,
            cardNo: encodeService.encode64($scope.cardInfo.cardNo.toString()),
            pwd: encodeService.encode64($scope.cardInfo.bindPwd.toString())
        };

        onlinePayService.bindAndPay(params).success(function (obj) {
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

});