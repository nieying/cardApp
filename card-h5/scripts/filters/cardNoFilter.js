/**
 * Created by nieying on 2016/6/24.
 * 卡号中间用*号来代替  filter
 */
angular.module('cardApp').filter('cardNoFilter', function () {
    return function (cardNo) {
        if (cardNo) {
            return cardNo.substr(0, 3) + ' **** **** ' + cardNo.substr(13);
        } else {
            return cardNo
        }
    };
});

angular.module('cardApp').filter('cardNoFilter1', function () {
    return function (cardNo) {
        if (cardNo) {
            return cardNo.substr(0, 4) + ' ' + cardNo.substr(4, 4) + ' ' + cardNo.substr(8, 4)+ ' ' + cardNo.substr(12, 4);
        } else {
            return cardNo
        }
    };
});

angular.module('cardApp').filter('phoneFilter', function () {
    return function (cardNo) {
        if (cardNo) {
            return cardNo.substr(0, 3) + ' **** ' + cardNo.substr(7);
        } else {
            return cardNo
        }
    };
});

