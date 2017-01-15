/**
 * 充值
 * Created by nieying on 2016/6/2.
 */

angular.module('cardApp').controller('rechargeCtrl',['$scope', '$rootScope', '$cookieStore', '$state', '$stateParams', 'dataService', 'encodeService', function ($scope, $rootScope, $cookieStore, $state, $stateParams, dataService, encodeService) {
    $rootScope.loading = true;
    $scope.loadMktBnr = false;
    $scope.mktBanners = [];

    /**获取市场活动Banners广告信息*/
    dataService.getMktBanners().success(function (obj) {
        if (obj.success) {
            _.each(obj.msgData.mktBanners, function (data) {
                var mtkbnr = JSON.parse(data);
                if (data && mtkbnr.pos == 1) {
                    $scope.mktBanners.push(mtkbnr);
                }
            });
            $scope.fristMktBnr = $scope.mktBanners[0];
            $scope.lastMktBnr = $scope.mktBanners[$scope.mktBanners.length - 1];
            $scope.loadMktBnr = true;

            mui("#slider").slider({
                interval: 5000
            });
        }
    });

    /**获取充值信息*/
    dataService.getRechargeInfo($cookieStore.get("cardNo").value).success(function (obj) {
        if (obj.success) {
            $rootScope.loading = false;
            $scope.rechargeInfo = obj.msgData;
            /*充值金额大于卡内金额*/
            $scope.rechargeDisable = _.filter($scope.rechargeInfo.amtList, function (data) {
                return $scope.rechargeInfo.maxRcgAmt / 100 < data;
            });

            $scope.rechargeList = _.filter($scope.rechargeInfo.amtList, function (data) {
                return $scope.rechargeInfo.maxRcgAmt / 100 >= data;
            });
        } else {
            errorTips(obj, $state);
        }
    }).error(function () {
        systemBusy($rootScope,$state);
    });

    /**选择充值金额*/
    $scope.rechargeIndex = 0;//默认选择第一条数据
    $scope.checkItem = function (item, $index) {
        $scope.rechargeIndex = $index;
        $scope.rechargeItem = item;
    };

    /**选择哪种付款方式*/
    $scope.payType = "WXPAY";//默认充值方式
    $scope.selectPayType = function (data) {
        if (data == 0) {
            $scope.payType = "SFPAY";
        } else {
            $scope.payType = "WXPAY";
        }
    };

    /**返回*/
    $scope.goBack = function () {
        back($cookieStore,$state);
    };


    /**充值*/
    $scope.recharge = function () {
        //默认选择充值金额
        if (typeof ($scope.rechargeItem) == 'undefined') {
            $scope.rechargeItem = $scope.rechargeList[0]
        }
        var params = {
            cno: $cookieStore.get("cardNo").value,
            rcgAmt: encodeService.encode64($scope.rechargeItem * 100 + ""),
            payChannel: encodeService.encode64($scope.payType + ""),
            isWxBrowser: encodeService.encode64(isWeiXin() + "")
        };

        dataService.rechargeReq(params).success(function (obj) {
            if (obj.success) {
                window.location.href = obj.msgData.url;
            } else {
                errorTips(obj, $state);
            }
        }).error(function () {
            systemBusy($rootScope,$state);
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
    dataService.rcgCheckInfo().success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            if (obj.msgData.checkRcg) {
                $scope.businessNo = obj.msgData.businessNo;
                $cookieStore.put("businessNo", {value: obj.msgData.businessNo});
                openModal();
            }
        } else {
            errorTips(obj, $state);
        }
    }).error(function () {
        systemBusy($rootScope,$state);
    });

    /**移除待查询充值信息*/
    function rcgCheckRmv() {
        var params = {
            businessNo: encodeService.encode64($scope.businessNo)
        };
        dataService.rcgCheckRmv(params).success(function (obj) {
            $rootScope.loading = false;
            if (obj.success) {
                $(".mui-popup").remove();
                $('.mui-popup-backdrop').removeClass('mui-active');
            } else {
                errorTips(obj, $state);
            }
        }).error(function () {
            systemBusy($rootScope,$state);
        })
    }

    /**查询充值交易结果*/
    function queryRechargeResult() {
        $rootScope.loading = true;
        var params = {
            businessNo: encodeService.encode64($scope.businessNo)
        };
        dataService.queryRechargeResult(params).success(function (obj) {
            $rootScope.loading = false;
            if (obj.code == "00") {
                $state.go("rechargeSuccess")
            } else if (obj.code == "02") {
                openModal();
            } else {
                errorTips(obj, $state);
            }
        }).error(function () {
            systemBusy($rootScope,$state);
        })
    }
}]);