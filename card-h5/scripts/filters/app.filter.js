'use strict';

angular.module('cardApp').filter('billionFormat', ['$filter', function($filter) {
		return function(input, param) {
			input = input || 0;
			var str = '';
			if (param == '亿元') {
				str = $filter('number')(input / 100000000, 2);
			} else {
				str = $filter('number')(input, 2);
			}
			return str;
		}
	}])
	.filter('subStrForStar', function() { //用*替换一些字符
		return function(input) {
			if (input == null || typeof(input) == "undefined") {
				return "";
			}
			if (input.length > 3) {
				var s = input.substring(0, 1);
				var e = input.substring(input.length - 1, input.length);
				return s + "****************" + e;
			} else if (input.length > 1) {
				return input.substring(0, 1) + "**";
			}
			return input;
		};
	})
	.filter('subStrLast4', function() { //取银行卡后4位
		return function(input) {
			if (input == null || typeof(input) == "undefined" || input.length <= 4) {
				return "";
			}
			var result = input.replace(/(^\s+)|(\s+$)/g, "");
			result = result.replace(/\s/g, "");
			return result.substr(-4);
		};
	})
	/*.filter('formatDateYMD', function() { //格式化时间
		return function(input, separator) {
			if (!input) {
				return "";
			}
			if (!separator) {
				separator = "-";
			}
			var date = new Date(input);
			var result = date.getFullYear() + separator + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + separator + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
			return result;
		}
	})
	.filter('year', function() { //获取年份
		return function(input, separator) {
			if (!input) {
				return "";
			}
			if (!separator) {
				separator = "";
			}
			var date = new Date(input);
			return date.getFullYear();
		}
	})
	.filter('month', function() { //获取月份
		return function(input, separator) {
			if (!input) {
				return "";
			}
			if (!separator) {
				separator = "";
			}
			var date = new Date(input);
			return  ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
		}
	})
	.filter('date', function() { //获取日
		return function(input, separator) {
			if (!input) {
				return "";
			}
			if (!separator) {
				separator = "";
			}
			var date = new Date(input);
			return date.getDate();
		}
	})*/
