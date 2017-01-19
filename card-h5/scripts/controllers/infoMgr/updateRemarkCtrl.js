/**
 * 修改备注
 * Created by nieying on 2016/6/3.
 */
angular.module('cardApp').controller('updateRemarkCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$cookieStore', 'dataService', function ($scope, $rootScope, $state, $stateParams, $cookieStore, dataService) {

    $rootScope.loading = false;
    $scope.params = {
        remark: $stateParams.remarkName ? $stateParams.remarkName : ''
    };

    /*修改卡备注*/
    $scope.comfirm = function () {
        if ($scope.params.remark == '') {
            mui.alert(tipMsg.REMARK_NOT_NULL);
            return false
        }
        if (!$scope.remarkForm.$invalid) {
            $rootScope.loading = true;
            var params = {
                remark: $scope.params.remark
            };
            dataService.updateRemark(params).success(function (obj) {
                $rootScope.loading = false;
                if (obj.success) {
                    mui.alert(tipMsg.UPDATE_REMARK_SUCCESS, function () {
                        if ($cookieStore.get("system").value == 'SFCARD') {
                            $state.go("sfcard", {cardNo: $cookieStore.get("cardNo").value});
                        } else {
                            $state.go("sfcardscan");
                        }
                    });
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                systemBusy($rootScope, $state);
            });
        }
    }
}]);