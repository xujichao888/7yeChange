import province from "@/common/province.js"
import city from "@/common/city.js"
import emotion from "@/common/emotion.js"

const citys = (() => {
	let cs = []
	for (let i = 0; i < city.length; i++) {
		cs.push(...city[i])
	}
	return cs
})()

const cleanArray = (actual) => {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}

const paramJson = (json) => {
	if (!json) return ''
	return cleanArray(Object.keys(json).map(key => {
		if (json[key] === undefined) return ''
		return encodeURIComponent(key) + '=' +
			encodeURIComponent(json[key])
	})).join('&')
}

const formatCity = (city) => {
	let c = citys.find(item => item.value == city)
	let p = province.find(item => item.value == city.substring(0, 2))
	return {
		province: p,
		city: c
	}
}

const formatDate = (date) => {
	var dateee = new Date(date).toJSON();
	var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
	return date
}

const getConstellation = (date) => {

	let _date = date.split(' ')[0]
	let m = _date.split('-')[1]
	let d = _date.split('-')[2]

	var s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
	var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
	return s.substr(m * 2 - (d < arr[m - 1] ? 2 : 0), 2);
}

const timeDis = (now_time, direct_time) => {
	now_time = now_time.replace(/-/g, '/')
	direct_time = direct_time.replace(/-/g, '/')

	// direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
	var now_time = Date.parse(new Date(now_time)); //当前时间的时间戳
	var end_time = Date.parse(new Date(direct_time)); //指定时间的时间戳

	//计算相差天数
	var time_dis = end_time - now_time;
	if(time_dis <= 0) return "刚刚"
	var days = Math.floor(time_dis / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = time_dis % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000); //计算小时数后剩余的毫秒数
	var second = leave3 / 1000;
	let res = [Math.floor(days / 30), days, hours, minutes, second]

	let index = res.findIndex(item => item > 0)
	switch (index) {
		case 0:
			return res[index] + "月前"
			break;
		case 1:
			return res[index] + "天前"
			break;
		case 2:
			return res[index] + "小时前"
			break;
		case 3:
			return res[index] + "分钟前"
			break;
		case 4:
			return res[index] + "秒前"
			break;
	}
	return "时间错误"
}

const filterEmotion = (text) => {
	let regExp = /\[.*?\]/g;
	let resText = text.replace(regExp, (res) => {
		let code = emotion.find(item => item.codes == res)
		if (code) return code.char
		return res
	})
	return resText
}

const getDate = (type) => {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === 'start') {
		year = year - 60;
	} else if (type === 'end') {
		year = year + 2;
	}
	month = month > 9 ? month : '0' + month;;
	day = day > 9 ? day : '0' + day;

	return `${year}-${month}-${day}`;
}

const getNowDate = (time, count_year) => {
	const date = new Date();
	let year = date.getFullYear();
	if(count_year) year -= count_year
	let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
	let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

	if (time) {
		let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
		let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
		let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}
	return `${year}-${month}-${day}`
}

const exchangeTime = (timestamp, isOneTalk, isFilter) => { //格式化时间
	function change(t) {
		if (t < 10) {
			return "0" + t;
		} else {
			return t;
		}
	}
	let now = new Date();
	var date = new Date(timestamp);

	if (!isFilter) {
		if (date.getTime() + 5 * 60 * 1000 >= now.getTime()) return ""
	}

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
	if (isOneTalk) {
		return M + '月 ' + D + ' 日' + '	' + h + m;
	}
	return M + '月 ' + D + ' 日';
}

const getScollHeight = (num) => { //格式化时间
	let system_info = uni.getStorageSync('vuex_system_info')
	let titleHeight
	if (system_info.platform === 'android') {
		titleHeight = 48 + system_info.statusBarHeight
	} else if (system_info.platform === 'ios') {
		titleHeight = 44 + system_info.statusBarHeight
	}
	return system_info.windowHeight - titleHeight 
}

const toRGB = (color) => {
	function getNumber(color) {
		return (color.charAt(0) == "#") ? color.substring(1, 7) : color
	}
	let r = parseInt((getNumber(color)).substring(0, 2), 16)
	let g = parseInt((getNumber(color)).substring(2, 4), 16)
	let b = parseInt((getNumber(color)).substring(4, 6), 16)
	return {
		r,
		g,
		b
	}
}

const regFenToYuan = (fen) => {
	var num = fen;
	num = fen * 0.01;
	num += '';
	var reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
	num = num.replace(reg, '$1');
	num = toDecimal2(num)
	return num
};

const toDecimal2 = (x) => {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

const replaceUrl = (text) => {
	
	let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\:|\/|&|-)+)/g
	if (reg.exec(text)) {
		let randm = Math.random()
		let reslutText = text.replace(reg, randm + "$1$2" + randm);
		
		let array = reslutText.split(randm)
		
		return array.map(item=>{
			return {
				text :filterEmotion(item),
				isHref:!!reg.exec(item)
			}
		})
	} 
	return [{text:filterEmotion(text), isHref:false}]
}

const replaceUrl3 = (text) => {
	
	let reg = /\[[^\]]+\]\(night7:\/\/[\w]+\??&?[\w\-]*=[\w\-]*\)/g
	let result = reg.exec(text)
	console.log(result)
	return
	if (reg.exec(text)) {
		let randm = Math.random()
		let activity = result[2]
		let tips = result[1]
		let parm = result[3]
		let reslutText = text.replace(reg, randm + "$1$2" + randm);
		console.log(text, 'reslutText')
		let array = reslutText.split(randm)
		return array.map(item=>{
			return {
				text :filterEmotion(item),
				isHref:!!reg.exec(item)
			}
		})
	} 
}

 const compressImage = async (src, platform, brand) => {
	const imageInfo = await getImageInfo(src);
	const orientation = imageInfo.orientation;
	let rotate = 0;
	let quality = 80;
	if (platform === 'ios' || brand === 'samsung') {
		rotate = 0;
		quality = 25;
	} else {
		switch (orientation) {
			case 'up': //exif:1 不旋转
				rotate = 0;
				break;
			case 'down': //exif:3 旋转180度
				rotate = 180;
				break;
			case 'right': //exif:6 旋转90度
				rotate = 90;
				break;
			case 'left': //exif:8 旋转270度
				rotate = 270;
				break;
			default:
				rotate = 0;
				break;
		}
	}
	return new Promise(function(resolve, reject) {
		plus.zip.compressImage({
				src: src,
				dst: "_doc/uniapp_temp" + '/compressed/' + Math.round(new Date()) + '.jpg',
				format: 'jpg',
				quality: quality,
				width: 'auto',
				height: 'auto',
				rotate: rotate,
			},
			function(event) {
				let tempPath = event.target;
				resolve(tempPath)
			},
			function(error) {
				reject(error);
			});
	})
}

const getImageInfo = (path) => {
	return new Promise(function(resolve, reject) {
		// #ifdef APP-PLUS
		plus.io.getImageInfo({
			src: path,
			success: function(image) {
				// console.log(image.width);
				// console.log(image.height);
				// console.log('orientation=' + image.orientation);
				// console.log('path=' + image.path);
				resolve(image)
			},
			fail: function(err) {
				console.log("getImageInfoErr: " + JSON.stringify(err));
				reject(err)
			}
		});
		// #endif
		// #ifdef H5 || MP-WEIXIN	
		uni.getImageInfo({
			src: path,
			success: function(image) {
				// console.log(image.width);
				// console.log(image.height);
				// console.log('orientation=' + image.orientation);
				// console.log('path=' + image.path);
				resolve(image)
			},
			fail: function(err) {
				console.log("getImageInfoErr: " + JSON.stringify(err));
				reject(err)
			}
		});
		// #endif
	});
}

export {
	paramJson,
	formatCity,
	formatDate,
	getConstellation,
	timeDis,
	filterEmotion,
	getDate,
	getNowDate,
	exchangeTime,
	getScollHeight,
	toRGB,
	regFenToYuan,
	replaceUrl,
	compressImage,
	replaceUrl3
}
