/**
 * Created by 89003352 on 2017/1/3.
 */
function isSacn($scope){
    /*设置微信扫码*/
    if(isWeiXin()){
        var params = {
            locationUrl:window.location.href
        };
        dataService.getWeChatConfig(params).success(function (obj) {
            if (obj) {
                wx.config({
                    debug: false,
                    appId: obj.appId,
                    timestamp: obj.timestamp,
                    nonceStr: obj.nonceStr,
                    signature: obj.signature,
                    jsApiList: ['scanQRCode']
                });

                wx.error(function(res){
                    $scope.showScanCode = false;
                });
            } else {
                $scope.showScanCode = false;
            }
        }).error(function (err) {
            $scope.showScanCode = false;
        })
    }else if(isSfApp()){
        $scope.showScanCode = true;
    }else{
        $scope.showScanCode = false;
    }

    /*点击扫码操作*/
    $scope.scanCode = function () {
        if(isWeiXin()){
            alert("wechat scan code"); //console;
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    console.log("scan code res",res);
                    var result = res.resultStr;
                    if (result.indexOf(",")>=0) {
                        setScanResult(result.split(",")[1]);
                    } else {
                        setScanResult(result);
                    }
                }
            });
            return false;
        }else if(isSfApp()){
            console.log("isSFAPPBowser");
            window.location.href = "ActionInterface.openCodeScanPage";
            return false;
        }
    };

    function setScanResult(str){
        str = str+"";
        $scope.params.cno = str.replace(/\D/g,'').replace(/....(?!$)/g,'$& ');
    }
}