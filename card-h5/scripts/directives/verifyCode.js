/**
 * Loading 遮罩层
 */
angular.module('cardApp').directive('verifyCode', ['$rootScope', '$interval', '$state', 'dataService', 'encodeService',function ($rootScope, $interval, $state, dataService,encodeService) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'scripts/tpls/pwdMgr/verifyCode.html',
        scope: {
            showCode: '=',
            isGetCode: '=?',
            phone: '=',
            op: '=',
            code: '='
        },

        link: function (scope) {

            if (!scope.showCode && !scope.isGetCode) {//进入页面获取验证码
                getMsgCode();
            }

            function getMsgCode() {
                if (scope.isGetCode) {
                    if (!regular.regp.test(scope.phone)) {
                        mui.alert(tipMsg.COMFIRM_PHOME, function () {
                            //todo;
                        });
                        return false;
                    }
                }
                var params = {
                    op: scope.op
                };
                scope.isGetCode ? params.mobile = encodeService.encode64(scope.phone) : '';
                $interval.cancel(scope.timer);
                /**获取验证码*/
                dataService.getSmsCode(params).success(function (obj) {
                    if (obj.success) {
                        scope.startTimer(60);
                        scope.showCode = false;
                        scope.isGetCode = false;
                        mui.toast("验证码已发送" + scope.phone);
                    } else {
                        //验证码发送次数已超限,请重新登录后再试
                        //todo
                        errorTips(obj, $state);
                        if (obj.msgData != null) {
                            scope.startTimer(obj.msgData);
                        }
                    }
                }).error(function () {
                    systemBusy($rootScope, $state)
                });
            }

            /**再次发送*/
            scope.sendCode = function () {
                getMsgCode();
            };

            scope.clearCode = function () {
                scope.code = '';
            };

            /**定时器*/
            scope.startTimer = function (second) {
                scope.second = second;
                scope.timer = $interval(function () {
                    scope.second--;
                    if (scope.second == 0) {
                        scope.showCode = true;
                    }
                }, 1000, second);
            };
        }
    };
}]);