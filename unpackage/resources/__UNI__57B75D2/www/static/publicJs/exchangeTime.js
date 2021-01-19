  let  exchangeTime = function(timestamp,isOneTalk) { //格式化时间
			function change(t) {
				if (t < 10) {
					return "0" + t;
				} else {
					return t;
				}
			}
			let now = new Date();
			var date = new Date(timestamp);
			let nY = now.getFullYear()
			let nM = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1)
			let nD = change(now.getDate())
			let Y = date.getFullYear();
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
			let D = change(date.getDate());
			let h = change(date.getHours()) + ':';
			let m = change(date.getMinutes()) + '';
			if (nY == Y && nM == M && nD == D) {
				return '今天' + ' ' + h + m
			}
			// let  s = change(date.getSeconds());
			if(isOneTalk){
				return M + '月 ' + D + ' 日'+'	'+ h + m;
			}
			return M + '月 ' + D + ' 日';
}
export default exchangeTime