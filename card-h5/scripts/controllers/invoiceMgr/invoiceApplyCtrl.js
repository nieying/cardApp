/**
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('invoiceApplyCtrl', function ($scope, $rootScope, $stateParams, dataService) {
    $rootScope.loading = false;

    $scope.params = {
        province:'',
        city:'',
        area:''
    };



    $scope.confirm = function () {

        console.log($("#province").val(),$("#city").val(),$("#area").val());

       /* if (!$scope.setPwdForm.$invalid) {
            //todo
            var params = {
                newPwd: DES3.encrypt($scope.params.pwd, $scope.pwdDes3Sk)
            };

            dataService.resetPwd(params).success(function (obj) {
                if (obj.success) {
                    mui.toast("重置密码成功！");
                    var url = ($cookieStore.get("system").value == 'SFCARD') ? 'sfcard' : 'sfcardscan';
                    $state.go(url);
                } else {
                    errorTips(obj, $state);
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！")
            })
        }*/
    }

});