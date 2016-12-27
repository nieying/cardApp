/**
 * 卡相关接口数据
 * Created by nieying on 2016/6/12.
 */
angular.module("cardApp").service('dataService', ['$http', function ($http) {
    return {
        /*获取卡列表*/
        getCardList: function () {
            return $http({
                method: "GET",
                url: "sfcards"
            });
        },

        /*通过扫码进去的页面 获取卡信息*/
        getSfcardCardInfo: function () {
            return $http({
                method: "GET",
                url: "sfcardscan"
            });
        },

        /*获取卡详情*/
        getCardDetail: function (params) {
            return $http({
                method: "GET",
                url: "sfcards/sfcard/" + params
            });
        },

        /*实体卡微信扫码速运回传(绑定当前顺丰卡)*/
        bindUsingCard: function (params) {
            return $http({
                method: "POST",
                url: "sfexpWxScan/bindUsingCard",
                data: params
            });
        },

        /*实体卡微信扫码速运回传(设置密码并绑定顺丰卡)*/
        setPwdAndBindCard: function (params) {
            return $http({
                method: "POST",
                url: "sfexpWxScan/setPwdAndBindCard",
                data: params
            });
        },

        /*实体卡微信扫码速运回传(设置密码 并绑定(无面额))顺丰卡*/
        setPwdAndBindNoValueCard: function (params) {
            return $http({
                method: "POST",
                url: "sfexpWxScan/setPwdAndBindNoValueCard",
                data: params
            });
        },


        /*实体卡设置密码*/
        scanSetPwd: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/pwdSet",
                data: params
            });
        },

        /*无面额卡设置密码*/
        noValueCardSetPwd: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/pwdSetNoValueCard",
                data: params
            });
        },

        /*后台密码加密*/
        getDes3Sk: function () {
            return $http({
                method: 'GET',
                url: 'security/des3Sk'
            })
        },

        /*校验卡密码*/
        tradeValidate: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/tradeValidate",
                data: params

            });
        },

        /*获取交易明细*/
        getTradeList: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/trade",
                data: params
            });
        },

        /*获取交易详情*/
        getTradeDetail: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/tradeDetail",
                data: params
            });
        },

        /*获取手机验证码*/
        getSmsCode: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/smsCode",
                data: params
            });
        },

        /*(修改手机&&重置密码)校验绑定手机号码*/
        mobileValidate: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/mobileValidate",
                data: params
            });
        },

        /*修改手机号码*/
        updateMobile: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/mobileChange",
                data: params
            });
        },


        /*绑定手机号*/
        bindMobile: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/mobileBind",
                data: params
            });
        },

        /*绑卡*/
        bindCard: function (params) {
            return $http({
                method: "POST",
                url: "sfcards/cardBind",
                data: params
            });
        },

        /*解除卡绑定*/
        unbindCard: function (params) {
            return $http({
                method: "POST",
                url: "sfcards/cardUnbind",
                data: params
            });
        },


        /*修改备注*/
        updateRemark: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/remarkChange",
                data: params

            });
        },

        /*修改密码*/
        changePwd: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/pwdChange",
                data: params
            });
        },

        /*重置密码*/
        resetPwd: function (params) {
            return $http({
                method: "POST",
                url: "sfcard/pwdReset",
                data: params
            });
        },

        /*获取广告信息*/
        getMktBanners: function () {
            return $http({
                method: 'GET',
                url: 'mkt/mktBanners'
            })
        },

        /*注册电子卡*/
        ecardRegister: function (params) {
            return $http({
                method: 'GET',
                url: 'sfcards/ecardRegister',
                data: params
            })
        },


        /*获取充值信息*/
        getRechargeInfo: function () {
            return $http({
                method: "POST",
                url: "recharge/rechargeInfo",
            })
        },

        /*充值下单请求*/
        rechargeReq: function (params) {
            return $http({
                method: "POST",
                url: "recharge/rechargeReq",
                data: params
            })
        },

        /*待查询充值信息*/
        rcgCheckInfo: function (params) {
            return $http({
                method: "POST",
                url: "recharge/rcgCheckInfo",
                data: params
            })
        },

        /*移除待查询充值信息*/
        rcgCheckRmv: function (params) {
            return $http({
                method: "POST",
                url: "recharge/rcgCheckRmv",
                data: params
            })
        },

        /*查询充值交易结果*/
        queryRechargeResult: function (params) {
            return $http({
                method: "POST",
                url: "recharge/rechargeResult",
                data: params
            })
        },

        /*电销查询手机号码*/
        getTeleSale: function () {
            return $http({
                method: 'GET',
                url: 'teleSale/mobile',
            })
        },

        /*电销确认手机号码注册速运会员*/
        telRecharge: function (params) {
            return $http({
                method: 'POST',
                url: 'teleSale/mobileRegister',
                data: params
            })
        },

        /*电销购卡充值下单请求*/
        telRechargeReq: function (params) {
            return $http({
                method: 'POST',
                url: 'teleSale/rechargeReq',
                data: params
            })
        },

        /*待查询 [电销] 充值信息*/
        telRcgCheckInfo: function () {
            return $http({
                method: 'POST',
                url: 'teleSale/rcgCheckInfo',
            })
        },

        /*移除 待查询 [电销] 充值信息*/
        telRcgCheckRmv: function (params) {
            return $http({
                method: 'POST',
                url: 'teleSale/rcgCheckRmv',
                data: params
            })
        },

        /*查询 电销充值交易结果*/
        telRechargeResult: function (params) {
            return $http({
                method: 'POST',
                url: 'teleSale/rechargeResult',
                data: params
            })
        },

        /*电销重设电子卡密码*/
        telSetPwd: function (params) {
            return $http({
                method: 'POST',
                url: 'teleSale/eCardPwdSet',
                data: params
            })
        },

        /*查询[成功的]充值交易信息详情*/
        queryBusinessInfo: function (params) {
            return $http({
                method: 'POST',
                url: 'business/businessInfo',
                data: params
            })
        },

        /*查询卡片可开票信息*/
        invoiceApplyInfo: function () {
            return $http({
                method: 'POST',
                url: 'sfcard/invoiceApplyInfo'
            })
        },

        /*开票申请*/
        invoiceApply: function (params) {
            return $http({
                method: 'POST',
                url: 'sfcard/invoiceApply',
                data: params
            })
        },

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
                url: "onlinePay/pay",
                data: params
            });
        },

        /*在线支付 支付并绑定*/
        bindAndPay: function (params) {
            return $http({
                method: "POST",
                url: "onlinePay/bindAndPay",
                data: params
            });
        },
    }
}]);