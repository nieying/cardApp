/**
 * Loading 遮罩层
 *
 */
angular.module('cardApp')
    .directive('successtips', ['$rootScope', '$state', function ($rootScope, $state) {
        return {
            restrict: 'AE',
            scope: {
                showTips:"=?"
            },
            template: "<div class='success-tips mui-text-center'>" +
            "<i class='mui-icon iconfont icon-dui'></i>" +
            " <p class='s-p1'>{{succTitle}}</p>     " +
            "<p ng-if='showTips' class='s-p0'>{{money}}</p>" +
            " <p class='s-p2'>{{succTips}}</p>" +
            "<a ng-click='confrim()' class='mui-btn mui-btn-primary'>完成</a> " +
            "<a ui-sref='setPwd' class='mui-btn mui-btn-grey'>暂不修改</a>" +
            "<div ng-if='showTips' class='success-card-tips'><h5>温馨提示</h5><p>您可以登入顺丰速运APP，或者“顺丰速运”微信公众号在线支付运费及管理您的电子卡</p></div>" +
            "</div>'",

            link: function (scope, ele, attr) {
                $rootScope.loading = false;

                scope.succTitle = "密码修改成功";
                scope.succTips = "请记住卡片新密码，支付时需要用到";

                scope.confrim = function () {
                    $state.go("error");
                };
            }
        };
    }]);