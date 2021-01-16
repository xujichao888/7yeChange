import { baseUrl } from "./baseUrl.js"

const request = (url, data, method) => {
	let token = uni.getStorageSync('token');
	return new Promise((resolve, reject) => {
		let config = {
			url: `${baseUrl}${url}`, //仅为示例，并非真实接口地址。
			data,
			method,
			success: (res) => {
				if(res.statusCode == 200){
					if(res.data.code == 10002){
						updateToken().then(res=>{
							if(res.code == 0){
								uni.setStorageSync("refresh_token", res.data.refresh_token)
								uni.setStorageSync("token", res.data.token)
								repeatHandle(url, data, method).then(res=>{
									resolve(res)
								}).catch(err=>{
									reject(err)
								})
							} else {
								uni.reLaunch({
								    url: `/pages/login/login`
								});
							}
						})
						.catch(err=>{
							uni.reLaunch({
							    url: `/pages/login/login`
							});
							reject(err)
						})
						return
					}
					resolve(res.data)
				} else {
					reject(res.data)
				}
			},
			fail: (err) => {
				reject(err)
			}
		}
		if (token) {
			config.header = {
				token : token
			}
		}
		uni.request(config);
	});
}

const repeatHandle = (url, data, method) =>{
	let token = uni.getStorageSync('token');
	return new Promise((resolve, reject) => {
		let config = {
			url: `${baseUrl}${url}`, //仅为示例，并非真实接口地址。
			data,
			method,
			success: (res) => {
				if(res.statusCode == 200){
					resolve(res.data)
				} else {
					reject(res.data)
				}
			},
			fail: (err) => {
				reject(err)
			}
		}
		if (token) {
			config.header = {
				token : token
			}
		}
		uni.request(config);
	});
}

const requestAll = (arg) => {
	let ps = []
	for(let i=0; i<arg.length; i++){
		ps.push(request(arg[i].url, arg[i].data, arg[i].method))
	}
	return Promise.all(ps)
}

const updateToken = ()=>{
	return new Promise((resolve, reject) => {
		let refresh_token = uni.getStorageSync('refresh_token');
		let users = uni.getStorageSync("users")
		uni.request({
			url: `${baseUrl}/users/refresh_token/${refresh_token}/${users.id}`, 
			success: (res) => {
				if(res.statusCode == 200){
					resolve(res.data)
				} else {
					reject(res.data)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export {
	request,
	requestAll
}
