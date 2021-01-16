<template>
	<view class="wrap">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="key-input">
			<view class="title" style="margin-bottom: 63rpx;opacity: 0;">请输入验证码</view>
			<view style="display: flex;align-items: center;width: 100%;justify-content: space-between;margin-bottom: 60rpx;padding: 0 10rpx;">
				<view class="text" style="color: #171717;margin: 0;">验证码已发送至 +{{mobile}}</view>
				<view class="regain" v-if="!show">{{ second }}秒</view>
				<view class="regain active" v-else @click="sendCode">重新获取</view>
			</view>
			<u-message-input width=80 :focus="true" :value="value" @change="change" @finish="finish" mode="box" :maxlength="maxlength"></u-message-input>
			<view class="captcha" style="display: flex;justify-content: center;">
				<view class="tips">登录/注册即视为同意《xxx用户协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login,
		get_code_new
	} from "@/common/http.nvue.api.js"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
export default {
	data() {
		return {
			phone:'',
			mobile:"",
			maxlength: 6,
			value: '',
			second: 60,
			show: false,
			from:'',
			timer:null,
		};
	},
	onBackPress(e){
		clearInterval(this.timer);
		this.reLaunch('/pages/login/login')
		return true 
	},
	onLoad(option) {
		this.$nextTick(()=>{
			if(!option || !option.mobile){
				this.$refs.uTips.show({
					title: '缺少mobile参数',
					type: 'error',
					duration: '2300'
				})	
				return
			}
			this.from = option.from
			let ary = option.mobile.split("");
			this.phone = option.mobile
			ary.splice(3,4,"****");
			this.mobile = ary.join("");
			// this.getCaptcha()
			this.timeDown()
			
		})
	},
	methods: {
		...mapMutations([
			'setUsers',
			'updateUser',
			'setLoginType'
		]),
		timeDown(){
			this.timer = setInterval(() => {
				this.second--;
				if (this.second <= 0) {
					this.show = true;
					clearInterval(this.timer);
				}
			}, 1000);
		},
		// change事件侦听
		change(value) {
			this.value = value
			// console.log('change', value);
		},
		// 输入完验证码最后一位执行
		finish(value) {
			uni.showLoading({
			    title: '验证中...'
			});
			let source
			if(this.from === "login"){
				get_code_new({
					phone :this.phone,
					code :this.value
				}).then(res=>{
					uni.setStorageSync("login_info", {phone:this.phone, code:this.value})
					uni.hideLoading()
					if(res.code == 0){
						clearInterval(this.timer);
						uni.hideLoading()
						if(res.data == 1){
							this.login()
							return
						}
						this.setLoginType('phone')
						this.reLaunch("/pages/password/password?isCreate=1")
						//this.reLaunch("/pages/user/sex")
					} else{
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.log(err)
					this.value = ''
				})
			} else {
				uni.hideLoading()
				this.reLaunch(`/pages/password/password?phone=${this.phone}&code=${this.value}`)
			}
			
		},
		sendCode(){
			this.value = ''
			this.show = false
			this.second = 60
			this.timeDown()
			//console.log("发送验证码")
			this.$u.api.getCode({
				phone :this.phone
			}).then(res=>{
				uni.hideLoading()
			}).catch(err=>{
				uni.hideLoading()
				console.error(err)
			})
		},
		login(){
			// uni.showLoading({
			// 	title: '加载中...'
			// });
			let login_info = uni.getStorageSync("login_info")
			login({
				phone: login_info.phone,
				code: login_info.code,
				source: 0,
				userName: login_info.phone,
				password:""
			}).then(res => {
				uni.hideLoading()
				if(res.code == 0){
					uni.setStorageSync("refresh_token", res.data.token.refresh_token)
					uni.setStorageSync("token", res.data.token.token)
					uni.setStorageSync("users", res.data.users)
					getApp().globalData.users = res.data.users
					this.setUsers(res.data.users)
					let afterid = uni.getStorageSync("afterid")
					if(afterid && afterid != res.data.users.id){
						this.updateUser(true)
					} else {
						this.updateUser(false)
					}
					uni.setStorageSync("afterid", res.data.users.id)
					getApp().globalData.token = res.data.token.token
					getApp().globalData.refresh_token = res.data.token.refresh_token
					
					if(res.data.users.sex == -1){
						this.reLaunch("/pages/user/sex")
						return
					}
					
					uni.switchTab({
					    url: '/pages/index/index'
					});
				} else{
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
			}).catch(err => {
				uni.hideLoading()
				uni.showToast({
					title: err.msg,
					icon: 'none'
				})
			})
		}
	}
};
</script>
<style>
	page{
		background-color: white;
	}
</style>
<style lang="scss" scoped>
.wrap {
	padding: 72rpx;
}
.regain{
	width: 160rpx;
	height: 60rpx;
	background-color: #D5D5D5;
	border-radius: 1000px;
	text-align: center;
	line-height: 60rpx;
	color: #fff;
	font-size: 26rpx;
}
.active {
	background-color: #EEC69D;
	color: #595757;
}
.title {
	font-size: 40rpx;
	color: #333;
	text-align: center;
}
.key-input{
	.text {
		font-size: 24rpx;
		color: #666;
		margin-top: 30rpx;
		margin-bottom: 50rpx;
	}
	.tips{
		font-size: 18rpx;
		color: #999999;
	}
} 
.captcha {
	margin-top: 20px;
	color: $u-type-warning;
	font-size: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
