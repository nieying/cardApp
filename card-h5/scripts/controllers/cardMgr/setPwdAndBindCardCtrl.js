/**
 * 绑卡
 * Created by nieying on 2016/6/2.
 */
angular.module('cardApp').controller('setPwdAndBindCardCtrl', function ($scope, $rootScope, $cookieStore, $state, encodeService, dataService) {
    $rootScope.loading = false;
    $scope.pwdDes3Sk = '';
    /*获取密码加密格式*/
    dataService.getDes3Sk().success(function (obj) {
        if (obj.success) {
            $scope.pwdDes3Sk = obj.msgData.des3Sk;
        }
    });

    $scope.parmas = {
        coatingCode: '',
        pwd: '',
        confrimPwd:''
    };

    /*绑定卡事件*/
    $scope.confrim = function () {
        if (!$scope.setPwdAndBindCardForm.$invalid) {
            if ($scope.pwdDes3Sk == '') {
                mui.alert("获取秘钥失败，请刷新重试！");
                return false;
            }

            if($scope.params.pwd != $scope.params.confrimPwd){
                mui.alert("两次密码输入不一致！");
                return false;
            }

            $rootScope.loading = true;
            var params = {
                coatingCode: encodeService.encode64($scope.params.coatingCode),
                pwd: DES3.encrypt($scope.params.pwd, $scope.pwdDes3Sk)
            };
            dataService.setPwdAndBindCard(params).success(function (obj) {
                if (obj.success) {
                    $state.go("sfcards");
                    mui.toast("绑定成功！");
                    $rootScope.loading = false;
                } else {
                    if (obj.msg == '连接失效,请重新登录') {
                        mui.alert("连接失效,请重新登录", "", function () {
                            //todo
                        });
                    } else if(obj.msg == '请勿重复绑卡'){
                        mui.alert(obj.msg,"",function () {
                            $state.go("sfcards");
                        });

                    }else{
                        mui.alert(obj.msg);
                    }
                    $rootScope.loading = false;
                }
            }).error(function () {
                mui.alert("系统繁忙，请稍后重试！");
            })
        }
    }
});