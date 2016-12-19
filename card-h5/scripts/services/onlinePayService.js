/**
 * Created by nieying on 2016/6/21.
 */
angular.module("cardApp").service('onlinePayService', ['$http', function ($http) {
    return {
        /*在线支付 获取支付信息*/
        onlinePay: function (params) {
            return $http({
                method: "GET",
                url: "card-h5/onlinePay/payReqAndCardListInfo?version=V1.0.0&charset=UTF-8&signType=RSA&sourceCode=SFAPP&memNo=43242353121233&mobile=13688807437&orderId=1111111110&payAmt=5000&totalAmt=5000&ccy=ccy&businessType=OFF_PAY&notifyUrl=http://10.118.200.63:8080/testcase/notifyResult&returnUrl=http://10.118.200.63:8080/testcase/payResult&expressSnAndAmtStr=555555:2000&sign=asdfsdf"
            });
        },

        /*在线支付 立即支付*/
        repay: function (params) {
            return $http({
                method: "POST",
                url: "card-h5/onlinePay/payReturnInfo",
                params: params
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
}]);