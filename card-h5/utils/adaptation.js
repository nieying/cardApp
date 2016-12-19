/*rem手机适配*/
function ad(doc,win){
	var docE1 = doc.documentElement;
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var recalc = function(){
		var clientWidth = docE1.clientWidth;
		if(!clientWidth) return;
		docE1.style.fontSize = 20 * (clientWidth / 320 ) + 'px';
	};
	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt,recalc,false);
	doc.addEventListener('DOMContentLoaded',recalc,false);
}

ad(document,window);
