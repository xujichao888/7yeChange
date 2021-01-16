<template>
	<view style="overflow: hidden;position: fixed;left: 0;bottom: 0;right: 0;top: 0;" class="big">
		<view class="login-content">
			<view style="width: 100%;height: 300rpx;display: flex;align-items: center;justify-content: center;margin-bottom: 60rpx;">
				<image class="logo" src="/static/guide/logo@3x.png" mode="widthFix" style="width: 300rpx;"></image>
			</view>
			<u-form :model="form" ref="uForm" :errorType="errorType">
				<u-form-item prop="mobile" label-width="0">
					<view class="input-group" style="background-color: #26221e;overflow-y: hidden;color: #fff;">
						<u-input type="number" style="text-align: center;color: #fff;background-color: #26221e;" placeholderStyle="color:#fff;background-color: #26221e;text-align: center;"
						 v-model="form.mobile" height="80" placeholder="请输入手机号码" />
					</view>
				</u-form-item>
				<view class="tips" style="color: #a5917e;">未注册的手机号码通过验证后将自动注册</view>
				<u-form-item v-show="isPassLogin" prop="password" label-width="0">
					<view class="input-group" style="background-color: #26221e;overflow-y: hidden;color: #fff;">
						<u-input type="password" height="80" style="text-align: center;color: #fff;background-color: #26221e;"
						 placeholderStyle="color:#fff;background-color: #26221e;text-align: center;" :password-icon="true" v-model="form.password"
						 placeholder="请输入密码"></u-input>
					</view>
				</u-form-item>
			</u-form>
			<m-button class="submitBtn" circle type="warning" @click.native="submit">{{submitBtnText}}</m-button>
			<view v-if="isPassLogin" class="login-content-text">
				<view @click="changeLoginType">验证码登录</view>
				<view @click="navigateTo('/pages/login/mobile')">忘记密码？</view>
			</view>
			<view v-else class="passworld-btn" @click="changeLoginType">密码登陆</view>
			<view class="footer">
				<view style="display: flex;justify-content: center; align-items: center;">
					<div class="wechat" style="margin: 0 20upx;" @click="wxLogin">
						<image src="../../static/img/wechat.png"></image>
						<text>微信</text>
					</div>
					<div class="wechat" style="margin: 0 20upx;" @click="appleLogin" v-if="(brand=='Apple')&&(system>13)">
						<image src="../../static/img/apple_login.png"></image>
						<text>Apple</text>
					</div>
				</view>
				<text class="tips">登录/注册即视为同意《XXX用户协议》</text>
			</view>
		</view>
		<guide v-if="guideShow" @guideHide="guideHide"></guide>
	</view>
</template>

<script>
	import guide from '../guide/guide.vue'
	import {
		wechat_login,
		login,
		is_wechat_login,
		apple_login
	} from "@/common/http.nvue.api.js"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import mButton from "@/components/button/button.vue"
	export default {
		components: {
			mButton,
			guide
		},
		data() {
			return {
				systemInfo:{},
				guideShow: false,
				isPassLogin: false,
				submitBtnText: "获取验证码",
				errorType: ['toast'],
				brand: '',
				system: 0,
				form: {
					mobile: '',
					password: '',
				},
				rules: {
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			if (this.isPassLogin) {
				this.$refs.uForm.setRules(this.rules);
			} else {
				this.$refs.uForm.setRules(Object.assign({}, this.rules, {
					password: []
				}));
			}
			// uni.removeStorageSync('one_login')
			let one_login = uni.getStorageSync('one_login') || '';
			if (!one_login) {
				//如果不存在 代表是 第一次登录 要调到引导页
				this.guideShow = true;
			} else {
				this.guideShow = false;
			};

		},
		onLoad() {
			this.systemInfo = uni.getSystemInfoSync()
			this.system = parseFloat(this.systemInfo.system);
			this.brand = this.systemInfo.brand;

			if (this.systemInfo.platform == "android") {
				/*设置安卓全面屏幕底部按键颜色*/
				var Color = plus.android.importClass("android.graphics.Color");   
				let intColor =  Color.parseColor("#000000")
				plus.android.importClass("android.view.Window");    
				var mainActivity = plus.android.runtimeMainActivity();    
				var window_android = mainActivity.getWindow(); 
				window_android.setNavigationBarColor(intColor);  
				/*设置安卓全面屏幕底部按键颜色END*/
			}

		},
		onUnload() {
			if (this.systemInfo.platform == "android") {
				/*设置安卓全面屏幕底部按键颜色*/
				var Color = plus.android.importClass("android.graphics.Color");   
				let intColor =  Color.parseColor("#f6f6f9")
				plus.android.importClass("android.view.Window");    
				var mainActivity = plus.android.runtimeMainActivity();    
				var window_android = mainActivity.getWindow(); 
				window_android.setNavigationBarColor(intColor);  
				/*设置安卓全面屏幕底部按键颜色END*/
			}
		},
		methods: {
			...mapMutations([
				'setUsers',
				'updateUser',
				'setLoginType',
				'setPassword'
			]),
			appleLoginByApi(openid) {
				apple_login({
					openid: openid
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						console.log(res, '苹果登陆')
						this.setLoginType('apple')
						uni.setStorageSync("refresh_token", res.data.token.refresh_token)
						uni.setStorageSync("token", res.data.token.token)
						uni.setStorageSync("users", res.data.users)
						getApp().globalData.users = res.data.users
						this.setUsers(res.data.users)
						let afterid = uni.getStorageSync("afterid")



						if (afterid && afterid != res.data.users.id) {
							this.updateUser(true)
						} else {
							this.updateUser(false)
						}
						uni.setStorageSync("afterid", res.data.users.id)

						if (res.data.users.sex == -1) {
							this.reLaunch("/pages/user/sex")
							return
						}

						uni.switchTab({
							url: '/pages/index/index'
						});

					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			appleLogin() {
				let that = this;
				console.log('点击苹果登录');
				uni.login({
					provider: 'apple',
					success: function(loginRes) {
						// 登录成功 
						console.log(loginRes, '苹果登录信息')
						uni.getUserInfo({
							provider: 'apple',
							success(data) {
								// 获取用户信息成功
								console.log(data, '苹果用户信息');
								// data.userInfo.openId  调登录接口
								that.appleLoginByApi(data.userInfo.openId);


							},
							fail: function(errs) {
								// 登录失败  
								console.log(errs, '苹果用户信息失败')
							}
						})
					},
					fail: function(err) {
						// 登录失败  
						console.log(err, '苹果登录信息失败')
					}
				});
			},
			guideHide() {
				this.guideShow = false;
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (this.isPassLogin) {
							uni.showLoading({
								title: '登录中...'
							});
							login({
								phone: this.form.mobile,
								code: '',
								source: 1,
								userName: this.form.mobile,
								password: this.form.password
							}).then(res => {
								uni.hideLoading()
								if (res.code == 0) {
									this.setLoginType('phone')
									uni.setStorageSync("login_info", {
										phone: this.form.mobile,
										code: this.form.password
									})
									this.setPassword(this.form.password)

									uni.setStorageSync("refresh_token", res.data.token.refresh_token)
									uni.setStorageSync("token", res.data.token.token)
									uni.setStorageSync("users", res.data.users)
									getApp().globalData.users = res.data.users
									this.setUsers(res.data.users)
									let afterid = uni.getStorageSync("afterid")
									if (afterid && afterid != res.data.users.id) {
										this.updateUser(true)
									} else {
										this.updateUser(false)
									}
									uni.setStorageSync("afterid", res.data.users.id)
									getApp().globalData.token = res.data.token.token
									getApp().globalData.refresh_token = res.data.token.refresh_token
									uni.hideLoading()
									console.log(res.data.users.sex, 'users')
									if (res.data.users.sex == -1) {
										this.reLaunch("/pages/user/sex")
										return
									}
									uni.switchTab({
										url: '/pages/index/index'
									});
								} else {
									uni.showToast({
										title: res.msg,
										icon: "none"
									})
								}
							}).catch(err => {
								uni.hideLoading()
								uni.showToast({
									title: err.msg,
									icon: 'none'
								})
							})
						} else {
							uni.showLoading({
								title: '发送中...'
							});
							this.$u.api.getCode({
								phone: this.form.mobile
							}).then(res => {
								uni.hideLoading()
								this.navigateTo("/pages/login/code", {
									mobile: this.form.mobile,
									from: "login"
								})
							}).catch(err => {
								uni.hideLoading()
								console.log(err)
							})
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			changeLoginType() {
				this.isPassLogin = !this.isPassLogin
				let mobile = this.form.mobile
				this.form.password = ''
				if (this.isPassLogin) {
					this.$refs.uForm.setRules(this.rules);
					this.submitBtnText = "登录"
				} else {
					this.$refs.uForm.setRules(Object.assign({}, this.rules, {
						password: []
					}));
					this.submitBtnText = "获取验证码"
				}
				this.form.mobile = mobile
			},
			wxLogin() {
				uni.showLoading({
					title: '登陆中...'
				});
				let _this = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res.provider)
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log(loginRes, '微信登录');
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											console.log('用户信息：' + JSON.stringify(infoRes));
											uni.setStorageSync("wxUserInfo", infoRes)
											_this.isWechatLogin()
										}
									});
								},
								fail: (err) => {
									uni.hideLoading()
									console.log(err, "微信登陆失败")
								}
							});
						}
					}
				});
			},
			isWechatLogin() {
				let infoRes = uni.getStorageSync("wxUserInfo")
				is_wechat_login({
					openid: infoRes.userInfo.openId
				}).then(res => {
					if (res.code == 0) {
						this.setLoginType('wx')
						if (res.data == 0) {
							uni.hideLoading()
							this.reLaunch("/pages/user/sex")
						} else {
							this.wechatLogin()
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err, '验证微信登陆失败')
				})
			},
			wechatLogin() {
				let infoRes = uni.getStorageSync("wxUserInfo")
				wechat_login({
					openid: infoRes.userInfo.openId
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						console.log(res, '微信登陆')

						uni.setStorageSync("refresh_token", res.data.token.refresh_token)
						uni.setStorageSync("token", res.data.token.token)
						uni.setStorageSync("users", res.data.users)
						getApp().globalData.users = res.data.users
						this.setUsers(res.data.users)
						let afterid = uni.getStorageSync("afterid")



						if (afterid && afterid != res.data.users.id) {
							this.updateUser(true)
						} else {
							this.updateUser(false)
						}
						uni.setStorageSync("afterid", res.data.users.id)

						if (res.data.users.sex == -1) {
							this.reLaunch("/pages/user/sex")
							return
						}

						uni.switchTab({
							url: '/pages/index/index'
						});

					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.apple {
		width: 280rpx;
		height: 60rpx;
		border-radius: 8rpx;
		color: #000000;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.big {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #000;
	}

	/deep/ .uni-input-input {
		text-align: center;
		color: #fff;
	}

	.login-content {
		padding: 150rpx 80rpx 0;

		.logo {
			width: 100%;
		}

		.submitBtn {
			margin-top: 50rpx;
		}

		.tips {
			font-size: 12px;
			color: #cccccc;
			text-align: center;
		}

		.passworld-btn {
			text-align: center;
			font-size: 32rpx;
			color: #edd0b2;
			margin-top: 20px;
		}

		.login-content-text {
			display: flex;
			justify-content: space-between;
			color: #edd0b2;
			margin-top: 20px;
		}

		.input-group {
			width: 100%;
			padding: 0 10px;
			background-color: #f5f5f5;
			border-radius: 60rpx;
		}

		.submitBtn {
			margin-top: 20px;
		}

		.footer {
			display: flex;
			align-items: center;
			flex-direction: column;
			position: absolute;
			bottom: 20px;
			left: 0;
			right: 0;

			.wechat {
				display: flex;
				align-items: center;
				flex-direction: column;
			}

			image {
				width: 68rpx;
				height: 54rpx;
			}

			text {
				font-size: 22rpx;
				color: #999999;

				&.tips {
					margin-top: 20px;
				}
			}
		}
	}
</style>
