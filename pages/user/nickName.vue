<template>
	<view class="user-name">
		<view class="name">
			<text class="title">起个名字吧</text>
		</view>
		<view class="content">
			<view class="avatar-wrap">
				<!-- <icon v-if="imgData.path" @click="imgData.path = ''" type="clear" size="22" class="close-btn" />
				<crop-img :avatarSrc="imgData.path" v-if="!imgData.path" class="avatar-cut" selWidth="500upx" selHeight="500upx"
				 @upload="uploadAvatr" inner stretch="x">
					<uni-icons color="#aaaaaa" type="plusempty" size="30" />
				</crop-img> -->
				<view class="avatar-cut" v-if="!imgData.path" @click="toHeadSelectPage">
					<uni-icons color="#aaaaaa" type="plusempty" size="30" />
				</view>
				<image v-else class="avatar-img" :src="imgData.path" @click="popAvatarShow"></image>
			</view>
			<view class="input-wrap">
				昵称
				<view class="input-group">
					<u-input type="text" maxlength="7" v-model="userName" height="80" placeholder="请输入..." />
				</view>
			</view>
			<view class="input-wrap" style="margin-top: 40rpx;">
				生日
				<view class="input-group" style="position: relative;">
					<view style="background-color: red;position: absolute;left: 0;top: 0;right: 0;bottom: 0;z-index: 10;opacity: 0;"
					 @click="visible=true">

					</view>
					<u-input type="text" v-model="birthday" maxlength="7" disabled height="80" placeholder="点击选择生日..." />
				</view>
			</view>
		</view>
		<m-button class="next-btn" circle type="warning" @click.native="next">下一步</m-button>
		<upload-progress :show="progressShow" :percent='percent' @uploadEnd="uploadEnd"></upload-progress>

		<w-picker :disabled-after="true" :value="birthday == '' ? this.endDate(): birthday" :visible.sync="visible" mode="date" fields="day"
		 @confirm="onConfirm" ref="date"></w-picker>

		<uni-popup ref="popupAvatar" type="share" :maskClick="false">
		    <view class="popup-service-group">
		    	<text @click="selectAvatar('confirm')" class="popup-service-item">重新选择</text>
				<text @click="selectAvatar('cancel')" class="popup-service-item popup-service-item-cancel">取消</text>
		    </view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getNowDate
	} from '@/utils/param.js'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import cropImg from "@/components/img-cropping/cropping.vue"
	import {
		baseUrl
	} from "@/common/baseUrl.js"
	import mCrop from "@/components/crop/crop.vue"
	import mButton from "@/components/button/button.vue"
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		init_user_info,
		upload_avatar,
		login,
		wechat_login,
		upload_url_avatar
	} from "@/common/http.nvue.api.js"
	import uploaProgress from '@/components/upload-progress/progress.vue'

	export default {
		components: {
			mCrop,
			mButton,
			cropImg,
			uploaProgress,
			wPicker
		},
		data() {
			return {
				visible: false,
				birthday: '',
				progressShow: false,
				percent: 0,
				imgData: {
					path: '',
					width: 0,
					height: 0
				},
				originalImg: {},
				context: null,
				userName: '',
				imgUrl: '',
				show: false,
				width: '200',
				height: '200',
				newImgData: null,
				uploadTask: null
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'loginTypes',
				'cratePassword'
			])
		},
		onLoad() {
			uni.$on('uploadAvatar', this.uploadAvatar)
		},
		onUnload() {
			uni.$off('uploadAvatar', this.uploadAvatar)
		},
		methods: {
			...mapMutations([
				'setUsers',
				'updateUser',
				'setPassword'
			]),
			selectAvatar(type){
				this.$refs.popupAvatar.close()
				if(type == "cancel"){
					return
				} 
				this.toHeadSelectPage()
			},
			popAvatarShow(){
				this.$refs.popupAvatar.open()
			},
			toHeadSelectPage(){
				let sex = this.vuex_user.sex
				uni.navigateTo({
					url:`/pages/user/headSelect?sex=${sex}`
				})
			},
			endDate() {
				return getNowDate(false, 20);
			},
			onConfirm(ev) {
				this.birthday = ev.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			uploadAvatar(data) {
				this.imgData.path = data.path
				uni.setStorageSync("users", { ...this.userInfo,
					avatarimg: data.path
				})
				getApp().globalData.users = {
					...this.userInfo,
					avatarimg: data.path
				}
				this.setUsers({ ...this.userInfo,
					avatarimg: data.path
				})
			},
			progressUpdate() {
				if (this.uploadTask) {
					this.uploadTask.onProgressUpdate(res => {
						this.percent = res.progress
						if (this.percent == 100) {
							setTimeout(() => {
								this.uploadEnd()
							}, 1500)
						}
					})
				}
			},
			uploadEnd() {
				this.progressShow = false
				setTimeout(() => {
					this.percent = 0
				}, 300)
			},
			next() {
				if (this.imgData.path === "") {
					uni.showToast({
						title: "请上传头像！",
						icon: "none",
					})
					return
				}
				if (this.userName === "") {
					uni.showToast({
						title: "请填写名称！",
						icon: "none",
					})
					return
				}
				if (!this.birthday) {
					uni.showToast({
						title: "请选择生日！",
						icon: "none",
					})
					return
				}
				
				if (this.loginTypes == 'wx') {
					this.wechatLogin()
				} else if (this.loginTypes == 'apple') {
					this.initUser();
				} else {
					this.login()
				}
			},
			wechatLogin() {
				let infoRes = uni.getStorageSync("wxUserInfo")
				uni.showLoading({
					title: '加载中...'
				});
				wechat_login({
					openid: infoRes.userInfo.openId
				}).then(res => {
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
						this.initUser()

					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			login() {
				uni.showLoading({
					title: '加载中...'
				});
				let login_info = uni.getStorageSync("login_info")
				login({
					phone: login_info.phone,
					code: login_info.code,
					source: 0,
					userName: login_info.phone,
					password: this.cratePassword
				}).then(res => {
					if (res.code == 0) {
						this.setPassword("")
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

						this.initUser()
					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					this.setPassword("")
					uni.hideLoading()
					uni.showToast({
						title: err.msg,
						icon: 'none'
					})
				})
			},
			initUser() {
				// console.log(this.birthday)
				init_user_info({
					sex: Number(this.vuex_user.sex),
					nickname: this.userName,
					userId: this.userInfo.id,
					avatarimg: this.imgData.path,
					birthday: this.birthday
				}).then(res => {
					uni.hideLoading()
					uni.setStorageSync("users", {
						...this.userInfo,
						sex: Number(this.vuex_user.sex),
						nickname: this.userName,
						avatarimg: this.imgData.path
					})
					getApp().globalData.users = {
						...this.userInfo,
						sex: Number(this.vuex_user.sex),
						nickname: this.userName,
						avatarimg: this.imgData.path
					}
					this.setUsers({
						...this.userInfo,
						sex: Number(this.vuex_user.sex),
						nickname: this.userName,
						avatarimg: this.imgData.path
					})
					uni.setStorageSync(`${this.userInfo.id}_isOne`, true)
					this.reLaunch("/pages/index/index")
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: err,
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modalBody {
		display: flex;
		align-items: center;
		background: white;
		justify-content: center;
		box-sizing: border-box;
		padding: 20px;
	}

	.user-name {
		margin-top: 44px;

		.name {
			text-align: center;
			font-size: 40rpx;
			color: #333333;
		}

		.content {
			padding: 10px 20px 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;

			.input-wrap {
				width: 100%;

				.input-group {
					margin-top: 15px;
					padding: 0 10px;
					background-color: #E6E6E6;
					border-radius: 60rpx;
				}
			}

			.avatar-wrap {
				width: 200rpx;
				height: 200rpx;
				margin: 60px 0 40px;
				text-align: center;
				position: relative;

				.avatar-cut,
				.avatar-img {
					width: 100%;
					height: 100%;
					background-color: #E6E6E6;
					overflow: hidden;
					border-radius: 50%;
				}
				.avatar-cut{
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.close-btn {
					position: absolute;
					right: 5rpx;
					top: 5rpx;
					z-index: 1;
				}
			}
		}

		.next-btn {
			padding: 0 20px;
			box-sizing: border-box;
			width: 100%;
			position: absolute;
			bottom: 30px;
		}
	}

	.photo {
		width: 50px;
		height: 50px;
		background: red;
	}
	.popup-service-group{
		width: 750rpx;
		display: flex;
		flex-direction: column;
	}
	.popup-service-item{
		flex: 1;
		background-color: white;
		font-size: 32rpx;
		color: #171717;
		text-align: center;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
	}
	.popup-service-item-text_msg{
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		border-bottom-color: #f6f6f6;
		border-bottom-width: 2rpx;
	}
	.popup-service-item-image_msg{
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	.popup-service-item-cancel{
		margin-top: 20rpx;
		background-color: #EFEFEF;
		border-radius: 20rpx;
	}
</style>
