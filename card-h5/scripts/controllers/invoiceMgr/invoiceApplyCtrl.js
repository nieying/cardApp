/**
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('invoiceApplyCtrl',['$scope', '$rootScope','$cookieStore', '$state', 'dataService', 'encodeService',function ($scope, $rootScope,$cookieStore, $state, dataService, encodeService) {

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

    // $scope.cardNo = $cookieStore.get("cardNo").value;
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
        mui.alert(tipMsg.SYSTEM_BUSY);
    });

    /*申请发票*/
    $scope.confirm = function () {
        if ($scope.params.amt) {
            if (!isNaN(Number($scope.params.amt))) {
                $scope.params.amt = Number($scope.params.amt);
                if ($scope.params.amt % 100 != 0) {
                    mui.alert(tipMsg.COMFIRM_NOT_ATM100);
                    return false;
                }
            } else {
                mui.alert(tipMsg.COMFIRM_NOT_ATM);
                return false;
            }
        } else {
            mui.alert(tipMsg.ATM_NOT_NULL);
            return false;
        }
        if ($scope.params.title == '') {
            mui.alert(tipMsg.TITLE_NOT_NULL);
            return false;
        }
        if ($scope.params.addressee == '') {
            mui.alert(tipMsg.ADDRESSEE_NOT_NULL);
            return false;
        }
        if (!(/^1[34578]\d{9}$/.test($scope.params.mobile))) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        if ($scope.params.address == '') {
            mui.alert(tipMsg.ADDRESS_NOT_NULL);
            return false;
        }
        if ($scope.invoiveInfo.limitAmt == '0.00') {
            mui.alert(tipMsg.NOT_ATM_RECHARGE);
            return false;
        }
        if ($scope.params.amt > $scope.invoiveInfo.limitAmt) {
            mui.alert(tipMsg.INVOICE_ATM_MORE);
            return false;
        }
        if (!$scope.invoiceApplyForm.$invalid) {
            $rootScope.loading = true;
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
            dataService.invoiceApply(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    getServiceTel();
                    mui.alert(obj.msg, function () {
                        $state.go("invoiceApplySuccess");
                    });
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
               systemBusy($rootScope,$state)
            })
        }
    };

    /*获取电话*/
    function getServiceTel() {
        dataService.getServiceTel().success(function (obj) {
            if (obj.success) {
                $scope.tel = obj.msgData;
            } else {
                errorTips(obj, $state)
            }
        }).error(function () {
            systemBusy($rootScope,$state)
        })
    }
}]);