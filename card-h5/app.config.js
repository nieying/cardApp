angular.module('cardApp').run(['$rootScope',function ($rootScope) {
    $rootScope.loading = true;

    /*判断手机横屏还是竖屏*/
    //if (window.orientation != 0) {
    //    mui.alert('横屏内容太少啦，请使用竖屏观看！');
    //}
    //
    //window.onorientationchange = function () {
    //    if (window.orientation == 0) {
    //        //todo
    //    } else {
    //        mui.alert('横屏内容太少啦，请使用竖屏观看！');
    //    }
    //};

    /**这里可以监听到路由跳转*/
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //mui('#pullrefresh').pullRefresh().destroy();
    });
}]);


var app = angular.module('cardApp').config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',function ($controllerProvider, $compileProvider, $filterProvider, $provide) {      //配置懒加载
    // lazy controller, directive and service
    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;
}]).config(['hammerDefaultOptsProvider',function (hammerDefaultOptsProvider) {  //这里是配置一个手势的操作用到了hammer这和插件
    hammerDefaultOptsProvider.set({
        recognizers: [
            [Hammer.Tap, {time: 250, event: 'tap'}]
        ]
    });

}]).config(['$httpProvider',function ($httpProvider) {
    /*$httpProvider.interceptors.push(function ($q, $rootScope) {
     return {
     request: function (config) {
     console.log("request---------->",config);
     return config || $q.when(config);
     },

     response: function (response) {
     console.log("----全局拦截器-----", response);
     return response;
     /!*if (response.data.message == "您尚未登录或登录时间过长,请重新登录!") {
     alert("您尚未登录或登录时间过长,请重新登录!");
     } else {
     return response;
     }*!/
     }
     }
     });*/
}]);





