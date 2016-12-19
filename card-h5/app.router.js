angular.module('cardApp').config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    //$urlRouterProvider.otherwise('/');
    // $urlRouterProvider.when('', '/');

    //	http://10.118.202.105:9088/card-h5/main?cno=YRghnqo4sZJ3eElj6ju7XIT6C17KHMrw
    $stateProvider.state('/', {  //默认页面
        url: '/',
        templateUrl: 'scripts/tpls/cardMgr/home.html'
    }).state('sfcards', {  //顺丰卡列表
        url: '/sfcards',
        templateUrl: 'scripts/tpls/cardMgr/sfcardsView.html',
        controller: 'sfcardsCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/sfcardsCtrl.js',
                ]);
            }]
        }
    }).state('sfcard', { //顺丰卡详情 ----单卡页面
        url: '/sfcards/sfcard',
        templateUrl: 'scripts/tpls/cardMgr/sfcardView.html',
        controller: 'sfcardCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/sfcardCtrl.js',
                ]);
            }]
        }
    }).state('sfcardscan', { //顺丰卡详情---- 扫码进来----单卡
        url: '/sfcardscan',
        templateUrl: 'scripts/tpls/cardMgr/sfcardScanView.html',
        controller: 'sfcardScanCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/sfcardScanCtrl.js',
                ]);
            }]
        }
    }).state('bindUsingCard', { //实体卡微信扫码速运回传(绑定当前顺丰卡)
        url: '/bindUsingCard',
        templateUrl: 'scripts/tpls/cardMgr/bindUsingCard.html',
        controller: 'bindUsingCardCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/bindUsingCardCtrl.js',
                ]);
            }]
        }
    }).state('setPwdAndBindCard', { //实体卡微信扫码速运回传(绑定当前顺丰卡)
        url: '/setPwdAndBindCard',
        templateUrl: 'scripts/tpls/cardMgr/setPwdAndBindCard.html',
        controller: 'setPwdAndBindCardCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/setPwdAndBindCardCtrl.js',
                ]);
            }]
        }
    }).state('setPwdAndBindNoValueCard', { //实体卡微信扫码速运回传(绑定当前顺丰卡)
        url: '/setPwdAndBindNoValueCard',
        templateUrl: 'scripts/tpls/cardMgr/setPwdAndBindNoValueCard.html',
        controller: 'setPwdAndBindNoValueCardCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/setPwdAndBindNoValueCardCtrl.js',
                ]);
            }]
        }
    }).state('pwdSet', {  //扫码设置密码
        url: '/pwdSet',
        templateUrl: 'scripts/tpls/pwdMgr/pwdSet.html',
        controller: 'pwdSetCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/pwdMgr/pwdSetCtrl.js',
                ]);
            }]
        }
    }).state('pwdSetNoValueCard', {  //无面额卡设置密码
        url: '/pwdSetNoValueCard',
        templateUrl: 'scripts/tpls/pwdMgr/pwdSetNoValueCard.html',
        controller: 'pwdSetNoValueCardCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/pwdMgr/pwdSetNoValueCardCtrl.js',
                ]);
            }]
        }
    }).state('pwdSuccess', {  //密码成功
        url: '/pwdSuccess',
        templateUrl: 'scripts/tpls/pwdMgr/pwdSuccess.html',
        controller: 'pwdSuccessCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/pwdMgr/pwdSuccessCtrl.js'
                ]);
            }]
        }
    }).state('bindCard', { //bind顺丰卡
        url: '/bindCard',
        templateUrl: 'scripts/tpls/cardMgr/bindCard.html',
        controller: 'bindCardCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/cardMgr/bindCardCtrl.js',
                ]);
            }]
        }
    }).state('recharge', {  //充值
        url: '/recharge',
        templateUrl: 'scripts/tpls/recharge/recharge.html',
        controller: 'rechargeCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/recharge/rechargeCtrl.js',
                ]);
            }]
        }
    }).state('rechargeSuccess', {  //充值成功頁面
        url: '/rechargeSuccess',
        templateUrl: 'scripts/tpls/recharge/rechargeSuccess.html',
        controller: 'rechargeSuccessCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/recharge/rechargeSuccessCtrl.js',
                ]);
            }]
        }
    }).state('trade', {  //交易明细
        url: '/trade',
        templateUrl: 'scripts/tpls/trade/trade.html',
        controller: 'tradeCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/trade/tradeCtrl.js',
                    'scripts/filters/tradeType.js',
                ]);
            }]
        }
    }).state('tradeDetail', {  //交易详情
        url: '/trade/:businessSn',
        templateUrl: 'scripts/tpls/trade/tradeDetail.html',
        controller: 'tradeDetailCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/trade/tradeDetailCtrl.js',
                    'scripts/filters/tradeType.js',
                    'scripts/filters/cardNoFilter.js'
                ]);
            }]
        }
    }).state('invoiceApply', {  //发票申请
        url: '/invoiceApply',
        templateUrl: 'scripts/tpls/invoiceMgr/invoiceApply.html',
        controller: 'invoiceApplyCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/invoiceMgr/invoiceApplyCtrl.js',
                ]);
            }]
        }
    }).state('changePwd', {  //修改密码
        url: '/changePwd',
        templateUrl: 'scripts/tpls/pwdMgr/changePwd.html',
        controller: 'changePwdCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/pwdMgr/changePwdCtrl.js',
                ]);
            }]
        }
    }).state('setPwd', {  //设置密码
        url: '/setPwd',
        templateUrl: 'scripts/tpls/pwdMgr/setPwd.html',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/pwdMgr/setPwdCtrl.js',
                ]);
            }]
        }
    }).state('findPwd', {  //找回密码
        url: '/findPwd',
        templateUrl: 'scripts/tpls/pwdMgr/findPwd.html',
        controller: 'findPwdCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/pwdMgr/findPwdCtrl.js',
                ]);
            }]
        }
    }).state('bindPhone', {  //绑定手机号码
        url: '/bindPhone',
        templateUrl: 'scripts/tpls/phoneMgr/bindPhone.html',
        controller: 'bindPhoneCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/phoneMgr/bindPhoneCtrl.js',
                ]);
            }]
        }
    }).state('changeMobile', {  //手机号码-----更换手机
        url: '/changeMobile',
        templateUrl: 'scripts/tpls/phoneMgr/changeMobile.html',
        controller: 'changeMobileCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/phoneMgr/changeMobileCtrl.js',
                ]);
            }]
        }
    }).state('updateRemark', {  //修改备注
        url: '/updateRemark',
        templateUrl: 'scripts/tpls/infoMgr/updateRemark.html',
        controller: 'updateRemarkCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/infoMgr/updateRemarkCtrl.js',
                ]);
            }]
        }
    }).state('problem', {  //常见问题
        url: '/problem',
        templateUrl: 'scripts/tpls/infoMgr/problem.html',
        controller: 'problemCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/infoMgr/problemCtrl.js'
                ]);
            }]
        }
    }).state('cardRule', {  //用卡规则
        url: '/cardRule',
        templateUrl: 'scripts/tpls/infoMgr/cardRules.html',
        controller: 'problemCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/infoMgr/problemCtrl.js'
                ]);
            }]
        }
    }).state('cardRuleDetail', {  //用卡规则详细
        url: '/cardRuleDetail',
        templateUrl: 'scripts/tpls/infoMgr/cardRuleDetail.html',
        controller: 'problemCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/infoMgr/problemCtrl.js'
                ]);
            }]
        }
    }).state('teleSale/mobile', {  // 电销查询手机号码
        url: '/teleSale/mobile',
        templateUrl: 'scripts/tpls/telemkt/confirmMobile.html',
        controller: 'confirmMobileCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/telemkt/confirmMobileCtrl.js'
                ]);
            }]
        }
    }).state('teleSale/recharge', {  // 电销确认手机号码注册速运会员
        url: '/teleSale/recharge',
        templateUrl: 'scripts/tpls/telemkt/telRechargeView.html',
        controller: 'telRechargeCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/telemkt/telRechargeCtrl.js'
                ]);
            }]
        }
    }).state('teleSale/rechargeSuccess', {  // 电销购卡充值下单请求成功頁面
        url: '/teleSale/rechargeSuccess',
        templateUrl: 'scripts/tpls/telemkt/telRechargeSuccess.html',
        controller: 'telRechargeSuccessCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/telemkt/telRechargeSuccessCtrl.js'
                ]);
            }]
        }
    }).state('teleSale/rechargeSuccessSetPwd', {  // 电销购卡充值下单请求成功设置密码頁面
        url: '/teleSale/rechargeSuccessSetPwd',
        templateUrl: 'scripts/tpls/telemkt/telRechargeSuccessSetPwd.html',
        controller: 'telRechargeSuccessSetPwdCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/telemkt/telRechargeSuccessSetPwdCtrl.js'
                ]);
            }]
        }
    }).state('telSetPwd', {  // 电销购卡设置密码
        url: '/telSetPwd',
        templateUrl: 'scripts/tpls/telemkt/telSetPwdView.html',
        controller: 'telSetPwdCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/telemkt/telSetPwdCtrl.js'
                ]);
            }]
        }
    }).state('onlinePay', {  //在线支付
        url: '/onlinePay',
        templateUrl: 'scripts/tpls/onlinePay/onlinePay.html',
        controller: 'onlinePayCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/onlinePay/onlinePayCtrl.js',
                    'scripts/services/onlinePayService.js'
                ]);
            }]
        }
    }).state('addCard', {  //在线支付 ---绑定新的顺丰卡
        url: '/addCard',
        templateUrl: 'scripts/tpls/onlinePay/addCard.html',
        controller: 'onlinePayCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/onlinePay/onlinePayCtrl.js',
                    'scripts/services/onlinePayService.js'
                ]);
            }]
        }
    }).state('paySuccess', {  //在线支付 --- pay success
        url: '/paySuccess',
        templateUrl: 'scripts/tpls/onlinePay/paySuccess.html',
        controller: 'onlinePayCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/onlinePay/onlinePayCtrl.js',
                    'scripts/services/onlinePayService.js'
                ]);
            }]
        }
    }).state('error', {  //异常页面
        url: '/error/:code',
        templateUrl: 'scripts/tpls/infoMgr/error.html',
        controller: 'problemCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'data/code_msg.js',
                    'scripts/controllers/infoMgr/problemCtrl.js',
                ]);
            }]
        }
    }).state('success', {  //成功页面
        url: '/success',
        templateUrl: 'scripts/tpls/infoMgr/success.html',
        controller: 'problemCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'scripts/controllers/infoMgr/problemCtrl.js',
                    'scripts/directives/successTips.js'
                ]);
            }]
        }
    });
});



