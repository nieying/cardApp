/**
 * 修改备注
 * Created by nieying on 2016/6/3.
 */
angular.module('cardApp').controller('updateRemarkCtrl', function ($scope, $rootScope, $state, $stateParams, $cookieStore, encodeService, dataService) {

    $rootScope.loading = false;
    $scope.remark = $cookieStore.get("remark").value ? $cookieStore.get("remark").value : '';

    /*修改卡备注*/
    $scope.comfirm = function () {
        if (!$scope.remarkForm.$invalid) {
            var params = {
                remark: $scope.remark
            };

            dataService.updateRemark(params).success(function (obj) {
                if (obj.success) {
                    if($cookieStore.get("system").value == 'SFCARD'){
                        $state.go('sfcard',{cno:$cookieStore.get("cno").value});
                    }else{
                        $state.go('sfcardscan');
                    }
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            });
        }
    }
});