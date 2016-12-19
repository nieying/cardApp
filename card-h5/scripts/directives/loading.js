/**
 * Loading 遮罩层
 */
angular.module('cardApp').directive('loading', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'AE',
        template: '<div class="loading-wrapper" ng-show="loading">' +
        '<div class="cg-busy-mask">' +
        '<p class="loading-text" ng-show="loadingText">{{loadingText}}</p>' +
        '</div><div class="cg-busy-default-sign">' +
        '<a> <span class="mui-spinner"></span> </a>' +
        '</div></div>',
    };
}]);