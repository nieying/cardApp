/**
 * 单卡ctrl
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('sfcardCtrl',  function ($scope, $rootScope,$stateParams, $state, $cookieStore, dataService, encodeService) {
    $rootScope.loading = true;    //页面进来时显示的加载的动画！
    $scope.showPwd = false;
    $scope.isEleCard = $cookieStore.get("isEleCard").value;

    $scope.params = {
        pwd: ''
    };

    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    /*获取单卡信息*/
    dataService.getCardDetail($cookieStore.get("cno").value).success(function (obj) {
        if (obj.success) {
            $rootScope.loading = false;
            $scope.singCardInfo = obj.msgData;
        } else {
            errorTips(obj, $state);
        }
    }).error(function () {
        $rootScope.loading = true;
        mui.alert("系统繁忙，请稍后重试！");
    });

    /*修改备注*/
    $scope.goUpdateRemark = function () {
        $cookieStore.put('remark', {value: $scope.singCardInfo.remark});
        $state.go('updateRemark');
    };

    $scope.goBack = function () {
        $state.go("sfcards");
    };

    /*显示输入密码页面*/
    $scope.showPwdView = function (data) {
        $scope.isUnbind = data == 0 ? true : false;    //$scope.isUnbind为true ====>解除绑定  false ====>交易详情
        $scope.showPwd = true;
    };

    /*输入密码操作*/
    $scope.confirm = function () {
        if (!$scope.pwdForm.$invalid) {

            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }

            $rootScope.loading = true;
            var unbindParams = {
                pwd: aesEncode($scope.params.pwd,$scope.pwdDes3Sk)
            };

            if ($scope.isUnbind) {
                dataService.unbindCard(unbindParams).success(function (obj) {
                    if (obj.success) {
                        $rootScope.loading = false;
                        mui.toast("解除绑定成功！");
                        $state.go("sfcards");
                    } else {
                        $rootScope.loading = false;
                        errorTips(obj, $state);
                    }
                }).error(function () {
                    $rootScope.loading = false;
                    mui.alert("系统繁忙，请稍后重试！");
                })
            } else {
                //todo
                $state.go("trade");
            }
        }
    }


    /*获取电话*/
    dataService.getServiceTel().success(function (obj) {
        if(obj.success){
            $scope.tel = obj.msgData;
        }else{
            errorTips(obj,$state)
        }
    }).error(function (err) {
        mui.alert(err)
    })
});