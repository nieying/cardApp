/**
 * 手机号码
 * Created by nieying on 2016/6/3.
 */

angular.module('cardApp').controller('changeMobileCtrl', ['$scope', '$rootScope', '$state', '$stateParams', function ($scope, $rootScope, $state, $stateParams) {
    $rootScope.loading = false;
    $scope.mobile = $stateParams.mobile;
}]);