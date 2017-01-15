/**
 * 密码成功Ctrl
 * Created by nieying on 2016/6/3.
 */
angular.module('cardApp').controller('pwdSuccessCtrl',['$scope', '$rootScope', '$cookieStore', function ($scope, $rootScope, $cookieStore) {
    $rootScope.loading = false;
    $scope.title = $cookieStore.get('tips').title;
    $scope.content = $cookieStore.get('tips').content;
    $scope.url = $cookieStore.get('tips').url;

    $scope.confirm = function () {
        window.location.href = $cookieStore.get('tips').url;
        $cookieStore.remove("tips");
    }
}]);