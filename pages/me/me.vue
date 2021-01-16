<template>
	<view class="me-content" v-if="userInfo.id">
		<view style="background-color: white;">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view>&nbsp;</view>
		</view>
		<view class="user-box" @click="toPage">
			<view class="info u-p-l-30">
				<view class="u-m-r-30">
					<u-avatar :src="userInfo.avatarimg" size="140"></u-avatar>
				</view>
				<view class="name">
					<view class="u-font-18">
						<view style="flex-direction: row;align-items: center;display: flex;">
							<text style="margin-right: 10upx;">{{userInfo.nickname}}</text>
							<image v-if="userInfo.level&&userInfo.sex==1" :src="`/static/icons/leve/leve${userInfo.level}.png`" style="width: 120rpx;"
							 mode="widthFix"></image>
							<!-- <image :src="`/static/icons/leve/leve1.png`" style="width: 120rpx;" mode="widthFix"></image> -->
						</view>
					</view>
					<view class="u-font-14 u-tips-color">
						<image v-if="userInfo.sex == 0" class="sex sex-nv" src="/static/icons/index/nv.png"></image>
						<image v-else-if="userInfo.sex == 1" class="sex" src="/static/icons/index/nan.png"></image>
						<text>ID : {{userInfo.id}}</text>
					</view>
				</view>
			</view>
			<view class="u-p-r-30">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		<view class="cell-wrap">
			<u-cell-group class="u-cell-group">
				<u-cell-item title="我的档案" @click="editHandel">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/files.png"></image>
					<text v-if="!ispPerfect" class="perfect">待完善</text>
				</u-cell-item>
				<u-cell-item v-if="userInfo.sex == 0" title="认证中心" :arrow="false">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/atte.png"></image>
					<text slot="right-icon">{{userInfo.status == 1 ? '已认证' : '未认证'}}</text>
				</u-cell-item>
				<u-cell-item v-if="userInfo.sex ==1" title="会员" @click="toJumpPage('vip')">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/vip.png"></image>
				</u-cell-item>
				<u-cell-item title="账号与安全" @click="toJumpPage('safe')">
					<image class="u-cell-icon safe-icon" slot="icon" src="../../static/icons/me/safe.png"></image>
				</u-cell-item>
				<!-- <u-cell-item title="权限管理" @click="toJumpPage('authority')">
					<image class="u-cell-icon safe-icon" slot="icon" src="../../static/icons/me/safe.png"></image>
				</u-cell-item> -->
				<!-- <u-cell-item title="黑名单">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/black.png"></image>
				</u-cell-item>
				<u-cell-item title="意见反馈">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/msg.png"></image>
				</u-cell-item> -->
				<u-cell-item title="分享给朋友" @click="openShare">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/share.png"></image>
				</u-cell-item>
				<!-- <u-cell-item title="设置">
					<image class="u-cell-icon" slot="icon" src="../../static/icons/me/set.png"></image>
				</u-cell-item> -->
			</u-cell-group>
			<view class="exit" @click="exit">
				<text>退出</text>
			</view>
		</view>
		<uni-popup id="popupShare" ref="popupShare" type="share" @change="popupChange">
			<uni-popup-share title="分享到" @select="selectShare"></uni-popup-share>
		</uni-popup>
		<uni-popup ref="popupmes" type="message">
			<uni-popup-message type="error" message="网络连接断开" :duration="0"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import {
		get_share_content
	} from "@/common/http.nvue.api.js"
	import uniPopupShare from '@/components/uni-popup/uni-popup-share.vue'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		paramJson
	} from '@/utils/param.js'
	export default {
		components: {
			uniPopupShare
		},
		data() {
			return {
				shareContent: {}
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				"networkState",
				'txIm'
			]),
			ispPerfect() {
				if (this.userInfo.id) {
					let _u = this.userInfo
					if (!_u.height || !_u.width || _u.nickname === "" || _u.birthday == "0001-01-01T00:00:00Z" ||
						_u.vocation === "" || _u.hobbystr === "" || _u.ment === "" || _u.food === "" ||
						_u.travellocation === "" || _u.mode === "" || _u.target === "" || _u.describe === "" ||
						_u.citystr === "") {
						return false
					}
					if (_u.sex == 1 && _u.vehicle === "") {
						return false
					}
					if (_u.sex == 0 && (_u.bust === "" || waist === "" || _u.hips === "" || _u.cup === "")) {
						return false
					}
					return true
				} else {
					return true
				}
			}
		},
		onShow() {
			if (this.userInfo && this.userInfo.type == 0) {
				uni.showTabBar()
			}
		},
		onLoad() {
			uni.$on('updateUserListUserInfo', this.updateUserInfo)
		},
		onHide() {
			this.setPrevPage("/pages/me/me")
		},
		watch: {
			networkState: {
				handler(val) {
					let _this = this

					function changeState(state) {
						if (!_this.$refs.popupmes) {
							setTimeout(() => {
								changeState()
							}, 500)
							return
						}
						if (val) _this.$refs.popupmes.close()
						else _this.$refs.popupmes.open()
					}
					changeState(val)
				},
				immediate: true
			}
		},
		methods: {
			...mapMutations([
				'setUsers',
				'setPrevPage',
				'removeMesslist',
				'setExitState',
				'setChoose'
			]),
			toPage() {
				let userid = this.userInfo.id
				uni.navigateTo({
					url: `/pages/user/info?userid=${userid}&edit=1`
				});
			},
			editHandel() {
				uni.navigateTo({
					url: `/pages/service/compile?userid=${this.userInfo.id}&sex=${this.userInfo.sex}&usertype=0`
				})
			},
			updateUserInfo(users) {
				if (users.id == this.userInfo.id)
					this.setUsers(users)
			},
			openShare() {
				this.$refs.popupShare.open()
				get_share_content().then(res => {
					if (res.code == 0) {
						this.shareContent = res.data[Math.floor(Math.random() * (res.data.length))]
					} else {
						ubi.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					console.log(err, '分享内容获取失败')
				})
			},
			popupChange(ev) {
				if (ev.show) {
					uni.hideTabBar()
				} else {
					setTimeout(() => {
						uni.showTabBar()
					}, 250)

				}
			},
			selectShare(data) {
				let scene = data.index == 0 ? "WXSceneSession" : "WXSenceTimeline"

				uni.share({
					provider: "weixin",
					scene,
					type: 0,
					href: this.shareContent.link,
					title: this.shareContent.title,
					summary: this.shareContent.content,
					imageUrl: this.shareContent.icon,
					success: (res) => {
						uni.showToast({
							title: "分享成功！"
						})
						setTimeout(() => {
							this.$refs.popupShare.close()
							uni.hideTabBar()
						}, 500)
					},
					fail: function(err) {
						uni.showToast({
							title: "分享失败！",
							icon: "none"
						})
					}
				});
			},
			toJumpPage(page) {
				uni.navigateTo({
					url: `/pages/${page}/index`
				})
			},
			exit() {
				uni.removeStorageSync("token")
				uni.removeStorageSync("users")
				uni.removeStorageSync("wxUserInfo")
				this.removeMesslist()
				this.txIm.logout()
				this.setExitState(true)
				this.setChoose(false)
				uni.$off('senImg')
				uni.reLaunch({
					url: `/pages/login/login`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F6F6F6;
	}

	.me-content {
		background-color: #F6F6F6;

		.user-box {
			background-color: #fff;
			padding: 40rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.info {
				display: flex;
				align-items: center;

				.name {
					.sex {
						width: 19rpx;
						height: 21rpx;
						margin-right: 10rpx;
					}

					.sex-nv {
						width: 14rpx;
						height: 21rpx;
					}
				}
			}
		}

		.u-cell-group {
			.u-cell-icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;

				&.safe-icon {
					width: 30rpx;
					height: 34rpx;
				}
			}

		}

		.cell-wrap {
			margin-top: 20rpx;
		}

		.exit {
			box-sizing: border-box;
			width: 100%;
			padding: 13px 16px;
			font-size: 14px;
			box-sizing: border-box;
			color: #606266;
			margin-top: 80rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			background-color: white;
			position: relative;

			&:after {
				content: ' ';
				position: absolute;
				left: 0;
				top: 0;
				pointer-events: none;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				-webkit-transform-origin: 0 0;
				transform-origin: 0 0;
				width: 199.8%;
				height: 199.7%;
				-webkit-transform: scale(0.5, 0.5);
				transform: scale(0.5, 0.5);
				border-top: 1rpx solid #e4e7ed;
				border-bottom: 1rpx solid #e4e7ed;
				z-index: 2;
			}
		}

		.perfect {
			color: #e1b893;
			;
		}
	}
</style>
<style lang="scss">
</style>
