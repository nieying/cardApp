/**
 * Created by nieying on 2016/6/23.
 * 交易类型 filter
 */

angular.module('cardApp').filter('tradeType', function () {
    return function (businessType) {
        switch (businessType) {
            case "OFF_PAY":
                return "运费-消费";
            case "OFF_CANCEL":
            case "OFF_REFUND":
                return "运费-退款";
            case "RGE_REMIT":
            case "REG_APPEASE":
            case "HHT_CZ-HHT":
            case "RGE_WEB":
            case "RGE_CASH":
            case "HHT_CZ":
            case "RGE_REMIT":
            case "REG_APPEASE":
            case "RGE_WX":
            case "RGE_SFPAY":
                return "充值";
            case "RGE_WEBREFUND":
            case "RGE_CASHCANCEL":
            case "HHT_CZCANCEL":
            case "RGE_WXREFUND":
            case "RGE_CASHREFUND":
            case "RGE_SFPAYREFUND":
            case "HHT_CZREFUND":
                return "充值-退款";
            default:
                return "";
        }
    };
});
angular.module("cardApp").filter('businessCode', function () {
    return function (businessType) {
        switch (businessType) {
            case "OFF_PAY":
                return 0;
            case "OFF_CANCEL":
            case "OFF_REFUND":
                return 1;
            case "RGE_REMIT":
            case "REG_APPEASE":
            case "HHT_CZ-HHT":
            case "RGE_WEB":
            case "RGE_CASH":
            case "HHT_CZ":
            case "RGE_REMIT":
            case "REG_APPEASE":
            case "RGE_WX":
            case "RGE_SFPAY":
                return 1;
            case "RGE_WEBREFUND":
            case "RGE_CASHCANCEL":
            case "HHT_CZCANCEL":
            case "RGE_WXREFUND":
            case "RGE_CASHREFUND":
            case "RGE_SFPAYREFUND":
            case "HHT_CZREFUND":
                return 0;
            default:
                return 0;
        }
    };
});



