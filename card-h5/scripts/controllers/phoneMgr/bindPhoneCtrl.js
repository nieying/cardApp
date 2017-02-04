/**
 * 绑定手机
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('bindPhoneCtrl', ['$scope', '$rootScope', '$interval', '$state', '$stateParams', '$cookieStore', 'encodeService', 'dataService', function ($scope, $rootScope, $interval, $state, $stateParams, $cookieStore, encodeService, dataService) {
    $rootScope.loading = false;

    /*判断是否绑定了手机号 true --- 修改手机号码  false --- 绑定手机号码*/
    $scope.hasMmobile = $stateParams.mobile ? true : false;

    $scope.op = $scope.hasMmobile ? encodeService.encode64('UPDATE_PHONE') : encodeService.encode64('BIND_PHONE');
    $scope.showCode = true;
    $scope.isGetCode = true;
    $scope.code = '';

    /*初始化参数*/
    $scope.params = {
        phone: ''
    };

    /*绑定手机号*/
    $scope.confrim = function () {
        if (!regular.regp.test($scope.params.phone)) {
            mui.alert(tipMsg.COMFIRM_PHOME);
            return false;
        }
        if (!regular.reg6.test($scope.code)) {
            mui.alert(tipMsg.COMFIRM_CODE);
            return false;
        }
        $rootScope.loading = true;
        var params = {
            confirmCode: encodeService.encode64($scope.code)
        };
        $scope.hasMmobile ? params.newMobile = encodeService.encode64($scope.params.phone) : params.mobile = encodeService.encode64($scope.params.phone);
        if ($scope.hasMmobile) {
            dataService.updateMobile(params).success(function (obj) {
                $rootScope.loading = false;
                successTips(obj, false);
            }).error(function () {
                systemBusy($rootScope, $state)
            });
        } else {
            dataService.bindMobile(params).success(function (obj) {
                $rootScope.loading = false;
                successTips(obj, true);
            }).error(function () {
                systemBusy($rootScope, $state)
            });
        }
    };

    function successTips(obj, isBind) {
        if (obj.success) {
            var msgPhoneTips = isBind ? tipMsg.BIND_PHONE_SUCCESS : tipMsg.UPDATE_PHONE_SUCCESS;
            mui.alert(msgPhoneTips, function () {
                if ($cookieStore.get("system").value == 'SFCARD') {
                    $state.go("sfcard", {cardNo: $cookieStore.get("cardNo").value});
                } else {
                    $state.go("sfcardscan");
                }
            });
        } else {
            errorTips(obj, $state);
        }
    }
}]);