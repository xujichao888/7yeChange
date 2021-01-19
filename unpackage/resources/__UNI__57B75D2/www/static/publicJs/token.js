import {
	refreshTokenPath
} from './requestPath.js';
import {
	ReqWebApi
} from '@/static/publicJs/requestFun.js';
let getToken = function(vm) {
	let {
		token
	} = vm.$store.state.userTokenMsg;;
	if (token) {
		return token
	} else {
		return -1
	}
}
let refreshToken = async function(vm, name, agu) {
	//一个小时只能刷新一次token
	let tokenTime = vm.$store.state.tokenTime

	let now = new Date().getTime()
	if (tokenTime == -1 || now - tokenTime >= 3600000) {
		vm.$store.state.tokenTime = now
		let {
			refresh_token
		} = vm.$store.state.userTokenMsg;
		//url,methods,data,token
		let result = await ReqWebApi(refreshTokenPath + refresh_token, 'PUT', '', '')
		if (result.data.code == 0) {
			vm.$store.state.userTokenMsg = result.data.data;
			vm[name](agu);
			return 1
		} else {
			uni.showToast({
				title: '请重新登录',
				icon: 'none'
			})
			return -1
		}

	}


}
export {
	getToken,
	refreshToken
}
