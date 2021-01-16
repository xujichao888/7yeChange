<template>
	<view class="payment">
		<view class="uni-padding-wrap">
			<text class="title">选择支付方式</text>
			<radio-group class="radio-group" @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view>
						<radio :value="item.value" :checked="item.value === current" />
						<text>{{item.name}}</text>
					</view>
				</label>
				<label class="uni-list-cell uni-list-cell-pd" v-if="platform == 'ios'">
					<view>
						<radio value="appleiap" :checked="current === 'appleiap'" />
						<text>苹果应用内支付</text>
					</view>
				</label>
			</radio-group>
		</view>
		<m-button class="submitBtn" circle type="warning" @click.native="getOrder">确认支付</m-button>
	</view>
</template>

<script>
	import {
		get_order,
		get_props
	} from "@/common/http.nvue.api.js"
	import mButton from "@/components/button/button.vue"

	let iapChannel = null

	export default {
		components: {
			mButton,
		},
		data() {
			return {
				wxUserInfo: null,
				productId: "goods1",
				data: [],
				wxUserInfo: null,
				platform: "",
				items: [{
						value: 'wxpay',
						name: '微信',
						checked: 'true'
					},
					{
						value: 'alipay',
						name: '支付宝'
					}
				],
				current: "wxpay"
			}
		},
		onLoad() {
			this.platform = uni.getSystemInfoSync().platform
			this.getpRrops()
		},
		methods: {
			radioChange: function(evt) {
				this.current = evt.target.value;
			},
			getChannels() { //uni-app中将此function里的代码放入vue页面的onLoad生命周期中  
				plus.payment.getChannels((channels) => {
					console.log("获取到channel" + JSON.stringify(channels))
					for (var i in channels) {
						var channel = channels[i];
						if (channel.id === 'appleiap') {
							iapChannel = channel;
							this.requestOrder();
						}
					}
					if (!iapChannel) {
						this.errorMsg()
					}
				}, (error) => {
					this.errorMsg()
				});
			},
			requestOrder() {
				uni.showLoading({
					title: '检测支付环境...'
				})
				let productIds = this.data.map(item => item.propsid)
				iapChannel.requestOrder(productIds, (orderList) => { //必须调用此方法才能进行 iap 支付
					console.log('requestOrder success666: ' + JSON.stringify(orderList));
					uni.hideLoading();
				}, (e) => {
					console.log('requestOrder failed: ' + JSON.stringify(e));
					uni.hideLoading();
					this.errorMsg()
				});
			},
			getpRrops() {
				get_props().then(res => {
					if (res.code == 0) {
						console.log(res, '道具')
						this.data = res.data
						if (this.platform == "ios") {
							this.getChannels()
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			async getOrder() {
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				    console.log(loginRes.authResult);
				  },
				  fail(err) {
				  	console.log(err, 'err');
				  }
				});
				return
				let paymenttype
				switch (this.current) {
					case "wxpay":
						paymenttype = 0
						break;
					case "alipay":
						paymenttype = 1
						break;
					case "appleiap":
						paymenttype = 2
						break;
				}
				get_order({
					isdebug: 0,
					paymenttype,
					propsid: this.data[0].propsid,
					tradetype: "0",
					openId: paymenttype == 0 ? "" : ""
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.payment(res.data)
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
			wxLogin() {
				return new Promise((resolve, reject) => {
					let _this = this
					uni.getProvider({
						service: 'oauth',
						success: function(res) {
							if (~res.provider.indexOf('weixin')) {
								uni.showModal({
									title: '授权',
									content: '微信授权',
									success: function(res) {
										if (res.confirm) {
											uni.login({
												provider: 'weixin',
												success: function(loginRes) {
													console.log(loginRes, '微信登录');
													uni.getUserInfo({
														provider: 'weixin',
														success: function(infoRes) {
															console.log('用户信息：' + JSON.stringify(infoRes));
															uni.setStorageSync("wxUserInfo", infoRes)
															resolve(infoRes)
														}
													})
												},
												fail: (err) => {
													reject(err, "微信登陆失败")
												}
											})
										}
									}
								});

							} else {
								reject("微信未授权")
							}
						},
						fail: (err) => {
							console.log(err, 'rrr')
							reject(err)
						}
					})
				})
			},
			payment(_orderInfo) {
				let orderInfo
				if (this.current == 'appleiap') {
					orderInfo = {
						productid: this.productId
					}
				} else {
					orderInfo = _orderInfo
				}
				uni.requestPayment({
					provider: this.current,
					orderInfo,
					success: function(res) {
						uni.showToast({
							title: "支付成功"
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 500)
					},
					fail: function(err) {
						console.log(err)
						uni.showToast({
							title: "支付失败",
							icon: "none"
						})
					}
				});
			},
			errorMsg() {
				uni.showModal({
					content: "暂不支持苹果 iap 支付",
					showCancel: false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.payment {
		padding: 30rpx 30rpx;
		min-height: 100vh;
		background-color: white;

		.title {
			font-size: 30rpx;
			color: #606266;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #CCCCCC;
			display: block;
		}

		.radio-group {
			margin-top: 20rpx;
			display: flex;
			align-items: center;

			label {
				margin-right: 50rpx;
			}
		}

		.submitBtn {
			position: fixed;
			bottom: 30rpx;
			width: 690rpx;
			left: 30rpx;
		}
	}
</style>
