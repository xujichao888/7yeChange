<template>
	<view class="content">
		<view class="vip-nav-bar">
			<view class="left">
				<view class="text">
					<text class="label">当前等级 </text>
					<text class="value">{{userLeve}}</text>
				</view>
				<view class="text">
					<text class="label">剩余钻石</text>
					<text class="value">{{diamond}}</text>
					<image src="/static/vip/zuanshi@3x.png"></image>
				</view>
			</view>
			<image class="deposit-btn" src="/static/vip/chongzhi@3x.png" @click="recharge"></image>
		</view>
		<view class="scoll-wrap" style="width: 100%;">
			<view class="title">
				<text>尊享特权</text>
				<text class="resetBtn" @click="reset">重置</text>
			</view>
			<scroll-view class="scroll-view" scroll-y="true">
				<view style="display: inline-block;">
					<view style="width: 260rpx;box-sizing: border-box;border-right:1upx solid #e9dbce;">
						<view style="width: 100%;height: 140upx;position: relative;">
							<view class="l-font" style="position: absolute;right:12upx;top: 40upx;">套餐等级</view>
							<view class="inner"></view>
							<view class="l-font" style="position: absolute;left:12upx;bottom: 40upx;">套餐权限</view>
						</view>
						<view v-for="(item,index) in left" :key="item.key" class="left_item">{{item.text}}</view>
					</view>
				</view>
				<scroll-view scroll-x="true" style="white-space: nowrap;width;width: 430rpx; height: auto;" :style="{height:scrollX_H + 'upx'}">
					<view style="display: inline-block;">
						<view style="display: flex;" id="iscroll-x_height">
							<view :style="{'width':(active===index&&trans)?0:'80px'}" @click="longpress(index)" v-for="(item,index) in content"
							 class="bor-r r-col" :key="item.name">
								<!--border-right:1upx solid #e9dbce;-->
								<view @click="closeThis" class="jb" v-if="active===index">
									x
								</view>
								<view v-if="index===active" style="position: absolute;left: 0;right:0;bottom: 0;top: 0;" class="bor"></view>
								<view style="width: 100%;height: 140upx;text-align: center;line-height: 140upx;font-weight: bold;color: #c19d3f;">
									{{item.name}}
								</view>

								<view v-if="cindex!=='name' && cindex !== 'id' && cindex !== 'type'" v-for="(citem,cindex) in item" :key="cindex"
								 class="left_item">
									<text v-if="cindex=='recharge' || cindex=='rights7' || cindex=='rights4'">{{citem}}</text>
									<text v-else-if="citem.type == 'text'">{{citem[citem.val]}}</text>
									<view v-else style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;">
										<image :src="citem[citem.val]" v-if="citem" mode="widthFix" style="width: 36upx;"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</scroll-view>
		</view>
		<view class="submitBtnGroup">
			<m-button class="submitBtn" circle type="warning" @click.native="openVip">开通会员</m-button>
		</view>
		
		<!-- <drag-button @back="back" @reset="reset"></drag-button> -->
		<uni-popup id="popupProp" ref="popupProp" type="share">
			<uni-popup-prop :platform="platform" :data="prodData" title="充值" @select="select" :diamond="diamond"></uni-popup-prop>
		</uni-popup>
		<uni-popup id="popupPayment" ref="popupPayment" type="share">
			<uni-popup-payment :platform="platform" :data="paymentData" title="" @select="selectPayment"></uni-popup-payment>
		</uni-popup>
		<uni-popup id="popupVip" ref="popupVip" type="share">
			<uni-popup-vip :platform="platform" :data="leveList" title="开通会员" @select="selectVip" :diamond="diamond"></uni-popup-vip>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		get_order,
		get_props,
		get_user_diamond,
		appstore_callback,
		get_leve,
		buy_level
	} from "@/common/http.nvue.api.js"
	import {
		regFenToYuan
	} from '@/utils/param.js'
	import uniPopupProp from '@/components/uni-popup/uni-popup-prop.vue'
	import uniPopupVip from '@/components/uni-popup/uni-popup-vip.vue'
	import uniPopupPayment from '@/components/uni-popup/uni-popup-payment.vue'
	import dragButton from "@/components/drag-button/drag-button.vue"
	import mButton from "@/components/button/button.vue"
	let iapChannel = null
	export default {
		components: {
			dragButton,
			uniPopupProp,
			uniPopupPayment,
			mButton,
			uniPopupVip
		},
		computed:{
			...mapGetters([
				'userInfo'
			])
		},
		data() {
			return {
				userLeve:'',
				is_review: true, //是否是苹果沙盒环境
				diamond: 0,
				trans: false,
				active: -1,
				title: 'Hello',
				original: [],
				leveList:[],
				content: [],
				left: [],
				removeContent: [],
				scollHeight: 0,
				windowTop: 40,
				showView: false,
				iscrollXH: {},
				prodData: [],
				paymentData: {},
				wxUserInfo: null,
				provider: "",
				platform: "",
				productId: "goods1",
				appResultGoods: [],
				scrollX_H:0
			}

		},
		async onLoad() {
			let that = this;
			this.platform = uni.getSystemInfoSync().platform
			this.getTabData()
			this.getpRrops()
			this.getUserDiamond();
			if (this.platform == 'ios') {
				// uni.removeStorageSync('ios_pay_error_store');
				// uni.removeStorage({
				// 	key:'ios_pay_error_store',
				// 	success() {
				// 		console.log('清除成功!')
				// 	}
				// })
				this.prodData = await that.getpRropsMy();
				// this.getChannels()
				plus.payment.getChannels((channels) => {
					console.log("获取到channel" + JSON.stringify(channels))
					for (var i in channels) {
						console.log(i)
						var channel = channels[i];
						if (channel.id === 'appleiap') {
							iapChannel = channel;
							// this.requestOrder();
							let productIds = that.prodData.map(item => item.appstore);
							iapChannel.requestOrder(productIds, function(event) {
								for (var index in event) {
									var OrderItem = event[index];
									console.log("Title:" + OrderItem.title + "Price:" + OrderItem.price + "Description:" + OrderItem.description +
										"ProductID:" + OrderItem.productid);
								}
								that.appResultGoods = event;
							}, function(errormsg) {
								console.log("获取支付通道失败：" + errormsg.message);
							});
						}
					}
					if (!iapChannel) {
						console.log(22)
						this.errorMsg()
					}
				}, (error) => {
					this.errorMsg()
				});
			}
		},
		mounted() {
			let _this = this
			uni.getSystemInfo({
				success(res) {
					_this.scollHeight = res.windowHeight
					_this.windowTop = res.windowTop + 100
					_this.$nextTick(() => {
						_this.showView = true
					})
				}
			});
			this.original = JSON.parse(JSON.stringify(this.content))
		},
		methods: {
			...mapMutations([
				'setUsers'
			]),
			selectVip(data){
				if(this.diamond < data.money){
					uni.showModal({
						title: '提示',
						content: '钻石余额不足！',
						cancelText:'再想想',
						confirmText:'立即充值',
						success: (res) => {
							if (res.confirm) {
								this.$refs.popupVip.close()
								setTimeout(()=>{
									this.recharge()
								},150)
							}
						}
					});
					return
				}
				this.buyLeveL(data)
			},
			buyLeveL({current, money}){
				uni.showLoading({
					title:"开通会员中..."
				})

				buy_level({
					id:current
				}).then(res=>{
					uni.hideLoading()
					if(res.code == 0){
						uni.showToast({
							title:"会员开通成功！"
						})
						if(this.userInfo.level < current){
							uni.setStorageSync("users", {...this.userInfo, level:current})
							getApp().globalData.users = {...this.userInfo, level:current}
							this.setUsers({...this.userInfo, level:current})
							this.userLeve = this.leveList.find(item=>item.id == current).name
						}
						this.diamond -= money
						this.$refs.popupVip.close()
					} else {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
					
				}).catch(err=>{
					console.log(err)
					uni.hideLoading()
				})
			},
			openVip(){
				this.$refs.popupVip.open()
			},
			getTabData() {
				get_leve().then(res => {
					if (res.code == 0) {
						let data = res.data || {}
						this.leveList = data.level || []
						let lv = this.leveList.find(item=>item.id == this.userInfo.level)
						if(lv) this.userLeve = lv.name
						else this.userLeve = "非会员"
						let left = [{
							key: 'recharge',
							text: '价格',
							sort: "0"
						}]
						for (let attr in data.title) {
							let obj = {
								key: attr,
								text: data.title[attr],
								sort: attr.replace('rights', '')
							}
							left.push(obj)
						}

						this.scrollX_H = left.length * 70 + 140
						this.left = left.sort(this.sortBy("sort", true))
						let content = data.level.map(item => {
							let i = {
								id: item.id,
								name: item.name,
								recharge: item.recharge
							}
							for (let attr in item) {
								if (data.title[attr]) {

									// i[attr] = item[attr]
									if (attr == 'rights1' || attr == 'rights2') {
										i[attr] = {
											'-1': '不限可置顶',
											'1': '/static/vip/duihao@3x.png',
											'0': '/static/vip/x@3x.png',
											'val': item[attr],
											'type': item[attr] == -1 ? 'text' : 'img'
										}
									} else if (attr == 'rights3') {
										i[attr] = {
											'-1': '时间不截止',
											'1': '/static/vip/duihao@3x.png',
											'0': '/static/vip/x@3x.png',
											'val': item[attr],
											'type': item[attr] == -1 ? 'text' : 'img'
										}
									} else if (attr == 'rights5') {
										i[attr] = {
											'-1': '不限',
											'1': '本省',
											'0': '/static/vip/x@3x.png',
											'val': item[attr],
											'type': item[attr] == 0 ? 'img' : 'text'
										}
									} else if (attr == 'rights8') {
										i[attr] = {
											'-1': '派对群聊',
											'1': '派对',
											'0': '/static/vip/x@3x.png',
											'val': item[attr],
											'type': item[attr] == 0 ? 'img' : 'text'
										}
									} else if (attr == 'rights4' || attr == 'rights7') {
										i[attr] = item[attr]
									} else {
										i[attr] = {
											'1': '/static/vip/duihao@3x.png',
											'0': '/static/vip/x@3x.png',
											'val': item[attr],
											'type': 'img'
										}
									}
								}
							}
							return i
						})
						this.content = content
					} else {
						uni.showToast({
							title: res.msg
						})
					}

				}).catch(err => {
					console.log(err)
				})
			},
			sortBy(attr, rev) {
				//第二个参数没有传递 默认升序排列
				if (rev == undefined) {
					rev = 1;
				} else {
					rev = (rev) ? 1 : -1;
				}

				return function(a, b) {
					a = a[attr];
					b = b[attr];
					if (a - b < 0) {
						return rev * -1;
					}
					if (a - b > 0) {
						return rev * 1;
					}
					return 0;
				}
			},
			getUserDiamond() {
				get_user_diamond().then(res => {
					console.log(res, '砖石数量')
					if (res.code == 0) {
						this.diamond = res.data || 0
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
			async getpRropsMy() {
				let res = await get_props();
				let prodData = res.data.map(item => {
					return {
						...item,
						money: regFenToYuan(item.money)
					}
				});
				if (this.platform == "ios") {
					prodData = prodData.filter((item) => {
						return item.appstore
					})
				};
				return prodData
			},
			getpRrops() {
				get_props().then(res => {
					if (res.code == 0) {
						this.prodData = res.data.map(item => {
							return {
								...item,
								money: regFenToYuan(item.money)
							}
						})
						if (this.platform == "ios") {
							this.prodData = this.prodData.filter((item) => {
								return item.appstore
							})

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

			requestOrder() {
				uni.showLoading({
					title: '检测支付环境...'
				})
				let productIds = this.prodData.map(item => item.appstore);
				console.log(productIds, iapChannel)
				iapChannel.requestOrder(productIds, (orderList) => { //必须调用此方法才能进行 iap 支付
					console.log('requestOrder success666: ' + JSON.stringify(orderList));
					uni.hideLoading();
				}, (e) => {
					console.log('requestOrder failed: ' + JSON.stringify(e));
					uni.hideLoading();
					// this.errorMsg()
				});
			},
			errorMsg() {
				uni.showModal({
					content: "暂不支持苹果 iap 支付",
					showCancel: false
				})
			},
			longpress(index) {
				this.active = index;
			},
			closeThis() {
				this.trans = true;
				setTimeout(() => {
					this.trans = false;
					let res = this.content.splice(this.active, 1);

					this.active = -1;
					this.removeContent.push(res[0])
				}, 0)
			},
			back() {
				if (this.removeContent.length) {
					let remove_len = this.removeContent.length
					let current = this.removeContent[this.removeContent.length - 1]
					let _index = this.original.findIndex(item => item.title == current.title)

					if (_index == this.original.length - 1) {
						this.content.push(...this.removeContent.splice(remove_len - 1, 1))
						return
					}
					let _nextIndex = this.content.findIndex(item => item.title == this.original[_index + 1].title)
					if (_nextIndex == -1) {
						this.content.push(...this.removeContent.splice(remove_len - 1, 1))
						return
					}
					this.content.splice(_nextIndex, 0, ...this.removeContent.splice(remove_len - 1, 1))
				}
			},
			reset() {
				this.content = [...this.original]
			},
			select(data) {
				console.log(data, '选择哪个')
				this.paymentData = data
				if (this.platform == 'ios') {
					this.provider = "appleiap"
					this.$refs.popupProp.close()
					this.getOrder()
				} else {
					this.$refs.popupProp.close()
					this.$refs.popupPayment.open()
				}
			},
			selectPayment(data) {
				this.provider = data.provider
				this.$refs.popupPayment.close()
				this.getOrder()
			},
			async getOrder() {
				uni.showLoading({
					title: "支付中..."
				})
				if (this.platform == "android" && this.provider == 'wxpay') {
					this.wxUserInfo = uni.getStorageSync("wxUserInfo")
					if (!this.wxUserInfo) {
						this.wxUserInfo = await this.wxLogin()
					}
				}
				let paymenttype, openId = ""
				if (this.platform == "ios") {
					paymenttype = 2
					console.log('在这执行');



				} else {
					if (this.provider == 'wxpay') {
						paymenttype = 0
						openId = this.wxUserInfo.userInfo.openId
					} else {
						paymenttype = 1
					}
				}




				get_order({
					isdebug: 0,
					paymenttype,
					propsid: this.paymentData.current,
					tradetype: "0",
					openId,
					custom_money: this.paymentData.current == 0 ? this.paymentData.money * 100 : 0
				}).then(res => {
					uni.hideLoading();
					// console.log(res, 'ios下订单再自己服务器')
					if (res.code == 0) {
						this.paymentHandle(res.data)
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
							console.log(res.provider, "支付列表")
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
												resolve(infoRes)
											}
										})
									},
									fail: (err) => {
										console.log(err, "微信登陆失败")
										uni.showToast({
											title: JSON.stringify(err),
											icon: "none"
										})
									}
								});
							} else {
								reject("微信未授权")
							}
						},
						fail: (err) => {
							uni.showToast({
								title: JSON.stringify(err),
								icon: "none"
							})
							reject(err)
						}
					})
				})
			},
			async paymentHandle(_orderInfo) {
				let that = this;
				let orderInfo
				if (this.platform == 'ios') {
					uni.showLoading({
						mask: true
					})
					orderInfo = {
						productid: this.paymentData.appstore
					}
				} else {
					orderInfo = _orderInfo
				}
				console.log(orderInfo, this.provider, 'orderInfo')
				uni.requestPayment({
					provider: this.provider,
					orderInfo,
					success: async (res) => {
						console.log(res, '成功')
						uni.hideLoading();
						if (this.platform == 'ios') {
							//appstore apple 验证 接口
							let data = {
								receipt: res.transactionReceipt,
								order_id: _orderInfo.order_id,
								is_review: that.is_review
							};
							console.log(data, 'appstore 支付成功回调参数')
							let payRes = await that.appstoreCallback(data)
							if (payRes.code === 0) {
								console.log(payRes, 'appstore 支付回调成功');
								uni.showToast({
									title: "支付成功"
								});
								that.getUserDiamond();
							} else {
								console.log('appstore 支付回调失败');
								uni.showToast({
									title: "支付失败，请重试"
								});
								uni.setStorageSync('ios_pay_error_store', data);
							}


							return
						}
						this.getUserDiamond()
					},
					fail: function(err) {
						console.log(err)
						uni.hideLoading();
						uni.showToast({
							title: "支付失败",
							icon: "none"
						})
					}
				});
			},
			async appstoreCallback(data) {
				let payRes = await appstore_callback(data);
				return payRes
			},
			async recharge() {
				let that = this;
				if (this.platform == 'ios') {
					let data = uni.getStorageSync('ios_pay_error_store');
					if (data) {
						uni.showLoading({
							mask: true,
							title: '上一交易数据恢复中'
						})
						let payRes = await that.appstoreCallback(data);
						uni.hideLoading();
						if (payRes.code === 0) {
							console.log(payRes, 'appstore 支付回调成功2');
							// uni.hideLoading();
							setTimeout(() => {
								uni.showToast({
									title: '恢复成功'
								});
							})
							that.getUserDiamond();
						} else {
							// uni.hideLoading();
							setTimeout(() => {
								uni.showToast({
									title: '恢复失败，请点击充值重试,或联系客服'
								});
							})
							console.log('appstore 支付回调失败2');
						}
					}

				}
				this.$refs.popupProp.open()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.l-font {
		font-weight: bold;
		color: #c19d3f;
	}

	.inner {
		border-left: 1px solid #ede2d8;
		width: 0;
		height: 580upx;
		transform: rotate(-62deg);
		-ms-transform: rotate(-62deg);
		-moz-transform: rotate(-62deg);
		-webkit-transform: rotate(-62deg);
		-o-transform: rotate(-62deg);
		display: inline-block;
		position: absolute;
		z-index: 1;
		top: -290upx;
		left: 0;
	}

	.r-col {
		width: 80px;
		height: 1247upx;
		box-sizing: border-box;
		position: relative;
		transition: width 0s ease;
		overflow: hidden;
	}

	.bor {
		/* border-right:none!important; */

		border-top: 2upx solid #eec988 !important;
		border-left: 2upx solid #eec988 !important;
		border-bottom: 2upx solid #eec988 !important;
		border-right: 2upx solid #eec988 !important;
	}

	.bor-r {
		border-right: 1upx solid #e9dbce;

		&:last-of-type {
			border-right: 0;
		}
	}

	.jb {
		position: absolute;
		right: 0;
		top: 0;
		background-image: url(/static/vip/yuanseyuanjiao@3x.png);
		background-size: cover;
		background-repeat: no-repeat;
		z-index: 10;
		width: 46upx;
		height: 38upx;
		text-align: center;
		line-height: 38upx;
	}

	/deep/ .uni-scroll-view-content {
		display: flex !important;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.left_item {
		width: 100%;
		height: 70upx;
		text-align: center;
		line-height: 70upx;
		color: #333333;
		font-size: 26upx;
	}

	.left_item:nth-child(2n) {
		background-color: #fbf9f8;
	}

	.left_item:nth-child(2n+1) {
		background-color: #ffffff;
	}

	.vip-nav-bar {
		width: 100%;
		height: 100px;
		background-image: linear-gradient(to right, #eed3b6, #e1b995);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;

		.text {
			font-size: 28rpx;
			color: #666666;
			display: flex;
			align-items: center;

			.label {
				width: 140rpx;
				display: block;
			}

			.value {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				padding-right: 10rpx;
			}

			image {
				width: 51rpx;
				height: 45rpx;
			}
		}

		.deposit-btn {
			width: 143rpx;
			height: 110rpx;
		}
	}

	.scoll-wrap {
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		padding: 0 30rpx;

		.title {
			background-image: url(/static/vip/zhuangshixian@3x.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: 375rpx 19rpx;
			height: 60px;
			text-align: center;
			line-height: 60px;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			position: relative;

			.resetBtn {
				position: absolute;
				right: 0;
				display: block;
				font-weight: normal;
				font-size: 28rpx;
				top: 10rpx;
			}
		}

		.scroll-view {
			width: 100%;
			border: 1rpx solid #e9dbce;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			overflow-x: hidden;
			overflow-y: scroll;
		}
	}
	.submitBtnGroup{
		margin-top: 50rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		padding: 0 20upx;
		padding-bottom: 50rpx;
	}
	.submitBtn {
		
		flex-grow: 1;
	}
</style>
