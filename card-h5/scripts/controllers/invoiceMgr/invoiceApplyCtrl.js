/**
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('invoiceApplyCtrl', function ($scope, $rootScope, $state, dataService, encodeService) {

    $scope.params = {
        amt: '',
        title: '',
        taxpayerId: '',
        taxpayerAddrMob: '',
        taxpaerBank: '',
        addressee: '',
        mobile: '',
        /*province:'',
         city:'',
         area:'',*/
        address: ''
    };

    dataService.invoiceApplyInfo().success(function (obj) {
        $rootScope.loading = false;
        if (obj.success) {
            $scope.invoiveInfo = obj.msgData;
            /* if($scope.invoiveInfo.limitAmt == 0.00){
             mui.alert("系统繁忙，请稍后重试！")
             }*/
        } else {
            errorTips(obj, $state)
        }
    }).error(function () {
        $rootScope.loading = false;
        mui.alert("系统繁忙，请稍后重试！")
    });


    $scope.confirm = function () {
        $rootScope.loading = true;
        if ($scope.params.amt > $scope.invoiveInfo.limitAmt) {
            mui.alert("开票金额超过可开票额度!");
            return false;
        }
        var params = {
            amt: encodeService.encode64($scope.params.amt),
            title: $scope.params.title,
            taxpayerId: $scope.params.taxpayerId,
            taxpayerAddrMob: $scope.params.taxpayerAddrMob,
            taxpaerBank: $scope.params.taxpaerBank,
            addressee: $scope.params.addressee,
            mobile: encodeService.encode64($scope.params.mobile),
            province: $("#province").val(),
            city: $("#city").val(),
            area: $("#area").val(),
            address: $scope.params.address
        }

        console.log($scope.params);
        if (!$scope.invoiceApplyForm.$invalid) {
            //todo
            dataService.invoiceApply(params).success(function (obj) {
                if (obj.success) {
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

});