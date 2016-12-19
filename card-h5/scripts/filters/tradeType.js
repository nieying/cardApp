/**
 * Created by nieying on 2016/6/23.
 * 交易类型 filter
 */

angular.module('cardApp').filter('tradeType', function () {
    return function(businessType) {
        if("OFF_PAY"==businessType){
            return "运费-消费";
        }else if("OFF_CANCEL"==businessType || "OFF_REFUND"==businessType){
            return "运费-退款";
        }else if("RGE_REMIT"==businessType || "REG_APPEASE"==businessType
            || "HHT_CZ-HHT"==businessType || "RGE_WEB"==businessType
            || "RGE_CASH"==businessType || "HHT_CZ"==businessType
            || "RGE_REMIT"==businessType || "REG_APPEASE"==businessType
            || "RGE_WX"==businessType || "RGE_SFPAY"==businessType){
            return "充值";
        }else if("RGE_WEBREFUND"==businessType || "RGE_CASHCANCEL"==businessType
            || "HHT_CZCANCEL"==businessType || "RGE_WXREFUND"==businessType
            || "RGE_CASHREFUND"==businessType || "RGE_SFPAYREFUND"==businessType){
            return "充值-退款";
        }else {
            return "";
        }

    };
});

