/**
 * Created by nieying on 2016/6/8.
 */
angular.module('cardApp').controller('telRechargeCtrl', function ($scope, $rootScope,$state,$cookieStore, dataService, encodeService) {

    var telParams = {
        mobile: encodeService.encode64($cookieStore.get("telMobile").value),
        reqBusSn: encodeService.encode64($cookieStore.get("reqBusSn").value)
    };
    dataService.telRecharge(telParams).success(function (obj) {
        if (obj.success) {
            $rootScope.loading = false;
            $scope.telRechargeInfo = obj.msgData;
        } else {
            errorTips(obj, $state);
            $rootScope.loading = false;
        }
    }).error(function () {
        mui.alert("系统繁忙，请稍后重试！");
    });


    /*选择哪种付款方式*/
    $scope.payType = "WXPAY";//默认充值方式
    $scope.selectPayType = function (data) {
        if (data == 0) {
            $scope.payType = "SFPAY";
        } else {
            $scope.payType = "WXPAY";
        }
    };

    /**充值*/
    $scope.recharge = function () {
        $rootScope.loading = true;
        var params = {
            reqBusSn: encodeService.encode64($scope.telRechargeInfo.reqBusSn),
            payChannel: encodeService.encode64($scope.payType + ""),
            isWxBrowser: encodeService.encode64(isWeiXin() + "")
        };
        dataService.telRechargeReq(params).success(function (obj) {
            if (obj.success) {
                window.location.href = obj.msgData.url;
                $rootScope.loading = false;
            } else {
                errorTips(obj, $state);
            }
        }).error(function () {
            mui.alert("系统繁忙，请稍后重试！");
        });
    };


    /**判断是否弹窗*/
    function openModal() {
        var btnArray = ['关闭', '刷新支付结果'];
        mui.confirm('交易正在进行中.....', '支付结果', btnArray, function (e) {
            if (e.index == 1) {
                //  document.getElementsByClassName(".mui-popup").removeChild();
                queryRechargeResult();
            } else {
                rcgCheckRmv();
            }
        });
    }

    /**待查询充值信息*/
    dataService.telRcgCheckInfo().success(function (obj) {
        $rootScope.loading = true;
        if (obj.success) {
            if (obj.msgData.checkRcg) {
                $scope.businessNo = obj.msgData.businessNo;
                $cookieStore.put("businessNo",{value:obj.msgData.businessNo});
                openModal();
            }
            console.log("待查询充值信息", obj);
            $rootScope.loading = false;
        } else {
            errorTips(obj, $state);
        }
    }).error(function (err) {
        $rootScope.loading = false;
        mui.alert("系统繁忙，请稍后重试！");
    });

    /**移除待查询充值信息*/
    function rcgCheckRmv() {
        var params = {
            businessNo: encodeService.encode64($scope.businessNo)
        };
        dataService.telRcgCheckRmv(params).success(function (obj) {
            $rootScope.loading = true;
            if (obj.success) {
                $(".mui-popup").remove();
                $('.mui-popup-backdrop').removeClass('mui-active');
                $rootScope.loading = false;
            } else {
                errorTips(obj, $state);
            }
        }).error(function (err) {
            $rootScope.loading = false;
            mui.alert("系统繁忙，请稍后重试！");
        })
    }

    /**查询充值交易结果*/
    function queryRechargeResult() {
        $rootScope.loading = true;
        var params = {
            businessNo: encodeService.encode64($scope.businessNo)
        };
        dataService.telRechargeResult(params).success(function (obj) {
            $rootScope.loading = true;
            if (obj.code == "00") {
                $state.go("telRechargeSuccess")
            } else if (obj.code == "02") {
                openModal();
            } else {
                errorTips(obj, $state);
            }
        }).error(function (err) {
            $rootScope.loading = false;
            mui.alert("系统繁忙，请稍后重试！");
        })
    }

});