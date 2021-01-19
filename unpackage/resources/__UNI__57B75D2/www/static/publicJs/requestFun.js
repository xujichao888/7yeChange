//请求接口post GET 方法
import {refreshToken} from './token.js'
let ReqWebApi = function (url,methods,data,token,vm,FunName,agu,userRefresh){
	return new Promise((resolve,reject)=>{
		let headers={}
		if(token){
			headers['token'] = token;
		}
		uni.request({
			url,
			method:methods,
			header:headers,
			data,
			success(res) {
				console.log(FunName,res)
				if(res.data.code==0){
					resolve(res)
				}
				if(res.data.code== 1000006){
					resolve(res)
				}
				if(res.data.code==10002){
					resolve(res)
					if(userRefresh){
						console.log('我被访问了')
						refreshToken(vm,FunName,agu)
					}
					
				}
				if(res.data.code==1000000){
					uni.showToast({
						title:'系统错误',
						icon:'none'
					})
					reject(-1)
				}
				
			}
		})
	})
}

export {
	ReqWebApi
}