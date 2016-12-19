/**
 * Created by nieying on 2016/6/17.
 * 取卡号后四位  filter
 */

angular.module('cardApp').filter('subStrLast4', function () { //取银行卡后4位
    return function (input) {
        if (input == null || typeof(input) == "undefined" || input.length <= 4) {
            return "";
        }
        var result = input.replace(/(^\s+)|(\s+$)/g, "");
        result = result.replace(/\s/g, "");
        return result.substr(-4);
    };
});
