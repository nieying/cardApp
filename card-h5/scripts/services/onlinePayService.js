/**
 * Created by nieying on 2016/6/21.
 */
angular.module("cardApp").service('onlinePayService', function ($http) {
    return {
        /*在线支付 获取支付信息*/
        onlinePay: function () {
            return $http({
                method: "GET",
                url: "onlinePay/payInfo"
            });
        },

        /*在线支付 立即支付*/
        repay: function (params) {
            return $http({
                method: "POST",
                url: "card-h5/onlinePay/pay",
                data: params
            });
        },

        /*在线支付 支付并绑定*/
        bindAndPay: function (params) {
            return $http({
                method: "POST",
                url: "card-h5/onlinePay/bindAndPayReturnInfo",
                params: params
            });
        },
    }
});