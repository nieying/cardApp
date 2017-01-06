/**
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('invoiceApplyCtrl', function ($scope, $rootScope, $state, dataService, encodeService) {

    $scope.params = {
        amt: '',
        title: '',
        taxpayerNumber: '',
        taxpayerAddrPhone: '',
        taxpayerBankAccount: '',
        addressee: '',
        mobile: '',
        // province: '',
        // city: '',
        // area: '',
        address: ''
    };

    $scope.showMoreInfo = false;

    dataService.invoiceApplyInfo().success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            $scope.invoiveInfo = obj.msgData;
        } else {
            errorTips(obj, $state)
        }
    }).error(function () {
        $rootScope.loading = false;
        mui.alert("系统繁忙，请稍后重试！")
    });

    /*申请发票*/
    $scope.confirm = function () {
        if ($scope.invoiveInfo.limitAmt == '0.00') {
            mui.alert("无可开票额度，请先进行充值");
            return false;
        }

        if ($scope.params.amt < $scope.invoiveInfo.limitAmt) {
            mui.alert("开票金额超过可开票额度!");
            return false;
        }
        var params = {
            amt: encodeService.encode64($scope.params.amt),
            title: $scope.params.title,
            taxpayerNumber: $scope.params.taxpayerId,
            taxpayerAddrPhone: $scope.params.taxpayerAddrMob,
            taxpayerBankAccount: $scope.params.taxpaerBank,
            addressee: $scope.params.addressee,
            mobile: encodeService.encode64($scope.params.mobile),
            province: $("#province").val(),
            city: $("#city").val(),
            area: $("#area").val(),
            address: $scope.params.address
        };

        if (!$scope.invoiceApplyForm.$invalid) {
            dataService.invoiceApply(params).success(function (obj) {
                $rootScope.loading = true;
                if (obj.success) {
                    getServiceTel();
                    mui.alert(obj.msg, function () {
                        $state.go("invoiceApplySuccess");
                    });
                    $rootScope.loading = false;
                } else {
                    $rootScope.loading = false;
                    errorTips(obj, $state);
                }
            }).error(function () {
                $rootScope.loading = false;
                mui.alert("系统繁忙，请稍后重试！")
            })
        }
    }

    /*获取电话*/
    function getServiceTel() {
        dataService.getServiceTel().success(function (obj) {
            if (obj.success) {
                $scope.tel = obj.msgData;
            } else {
                errorTips(obj, $state)
            }
        }).error(function (err) {
            mui.alert(err)
        })
    }
});