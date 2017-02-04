/**
 * Created by jeff ying on 2017/1/11.
 */
var tipMsg = {
    "CONFIRM_PWD_NOT_SAME": "两次密码输入不一致",
    "GET_DES3SK_FAIL": "获取秘钥失败，请刷新重试",
    "OPEN_ECARD_SUCCESS": "开通电子卡成功",
    "SYSTEM_BUSY": "系统繁忙,请稍后再试",
    "SESSION_INVALID": "连接失效,请重新登录",
    "COMFIRM_PHOME": "请输入正确的手机号",
    "CONFIRM_COATINGCODE": "请输入6位数字涂层码",
    "CNO_NOT_NULL": "卡号不能为空",
    "COMFIRM_NOT_ATM100": "请输入金额为100的整数倍",
    "COMFIRM_NOT_ATM": "开票金额格式不正确",
    "ATM_NOT_NULL": "开票金额不能为空",
    "NOT_ATM_RECHARGE": "无可开票额度，请先进行充值",
    "INVOICE_ATM_MORE": "开票金额超过可开票额度!",
    "TITLE_NOT_NULL": "抬头不能为空",
    "ADDRESSEE_NOT_NULL": "收件人不能为空",
    "ADDRESS_NOT_NULL": "地址不能为空",
    "REMARK_NOT_NULL": "卡备注不能为空",
    "SET_PWD_SUCCESS":"密码设置成功",
    "UPDATE_PWD_SUCCESS": "密码修改成功",
    "UPDATE_REMARK_SUCCESS": "备注修改成功",
    "BIND_PHONE_SUCCESS": "绑定手机成功",
    "UPDATE_PHONE_SUCCESS": "修改手机成功",
    "COMFIRM_OLD_PWD": "请输入6位或8位的密码",
    "COMFIRM_PWD": "请输入6位数字的密码",
    "COMFIRM_CODE": "请输入6位数字的验证码",
    "COMFIRM_CARDNO":"请输入正确的卡号"
};

var regular = {
    "reg6": new RegExp("^[\\d]{6}$"),
    "reg8": new RegExp("^[\\d]{6}$|^[\\d]{8}$"),
    "reg16": new RegExp("^[\\d]{16}$"),
    "regs": new RegExp("^123456$|^12345678$|^654321$|^87654321$|^([\\d])\\1{5}$|^([\\d])\\1{7}$"),
    "regp": /^1\d{10}$/
    // "regp": /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i
};
