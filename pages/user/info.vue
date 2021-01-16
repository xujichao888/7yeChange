<template>
	<view class="user-info-content" v-if="option.id" style="min-height: 100vh;">
		<view class="user-box">
			<view class="info">
				<!-- <view class="u-m-r-30" @click="updatePhoto(-1, true)">
					<u-avatar :src="option.avatarimg" size="140"></u-avatar>
				</view> -->
				<view class="">
					<crop-img style="position: fixed; bottom: -9999px; left: -9999px;" :isShow="!isPush" :avatarSrc="option.avatarimg" class="avatar-cut u-m-r-30" :footer="false" selWidth="500upx"
					 @end="changeTitle" @changeTitle="changeTitle" :disable="!edit" selHeight="500upx" @upload="uploadImg" inner
					 stretch="x">
						<uni-icons color="#aaaaaa" type="plusempty" size="30" />
					</crop-img>
					<image class="avatar-cut u-m-r-30" :src="option.avatarimg" @click="popAvatarShow"></image>
				</view>
				<view class="name">
					<view class="u-font-18 name-group">
						<view style="flex-direction: row;align-items: center;display: flex;">
							<text style="margin-right: 10upx;">{{option.nickname}}</text>
							<image v-if="option.level&&option.sex==1" :src="`/static/icons/leve/leve${option.level}.png`" style="width: 120rpx;"
							 mode="widthFix"></image>
							<!-- <image :src="`/static/icons/leve/leve1.png`" style="width: 120rpx;" mode="widthFix"></image> -->
						</view>
						<text class="service-create u-font-12 color-e8" v-if="option.servicecreate == 1">客服创建</text>
						<!-- <image class="addr-icon" v-if="addr" src="../../static/img/index/addr.png"></image>
						<text class="addr-content">{{addr}}</text> -->
					</view>
					<view class="u-font-12 color-e8 p-2">
						<text>ID：</text>
						<text>{{option.id}}</text>
					</view>
					<view class="u-font-12 color p-2 text-group">
						<image class="sex sex-nv" v-if="option.sex == 0" src="/static/icons/index/nv.png"></image>
						<image class="sex" v-else-if="option.sex == 1" src="/static/icons/index/nan.png"></image>
						<text v-if="option.age">{{option.age}}岁</text>
						<text v-if="option.age && option.constellation"> · </text>
						<text v-if="option.constellation" class="m-r-10">{{option.constellation}}座</text>
						<text v-if="option.height"> {{option.height}}cm</text>
						<text v-if="option.height && option.weight"> · </text>
						<text v-if="option.weight" class="m-r-10">{{option.weight}}kg</text>
						<text v-if="(option.height && option.weight) && option.sanwei"> · </text>
						<text v-if="option.sanwei">{{sanwei}}</text>
					</view>
					<view class="u-font-12 color p-2">
						<text v-if="option.citystr">常驻：</text>
						<text v-if="option.citystr">{{option.citystr}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="cell-wrap">
			<view class="cell">
				<view class="label">职业 </view>
				<view class="value">{{option.vocation}} </view>
			</view>
			<view class="cell">
				<view class="label">兴趣爱好 </view>
				<view class="value">
					<text>{{option.hobbystr}}</text>
				</view>
			</view>
			<view class="cell">
				<view class="label">空闲时间 </view>
				<view class="value">{{option.freetime}} </view>
			</view>
			<view class="cell">
				<view class="label">最近想去 </view>
				<view class="value">{{option.travellocation}} </view>
			</view>
			<view class="cell">
				<view class="label">喜欢类型 </view>
				<view class="value">{{option.target}} </view>
			</view>
			<view class="cell">
				<view class="label">喜爱的食物 </view>
				<view class="value">{{option.food}} </view>
			</view>
		</view>
		<view class="photo-wrap" v-if="userInfo.type > 0 || userid == userInfo.id || showPhoto">
			<view class="label underline">照片墙</view>
			<view class="ptoto-group">
				<view class="photo" v-for="(item,index) in data" :key="index">
					<view class="default" v-if="item.image == ''" style="position: relative;">
						<u-icon size="60" v-if="edit" color="#CCCCCC" name="plus" @click="updatePhoto(index)"></u-icon>
						<!-- <image class="photo_default" v-else src="../../static/img/photo_default.png"></image> -->
					</view>
					<view v-else-if="item.image" class="default" :class="{bgf6:userInfo.type == 0 && userid != userInfo.id}" style="position: relative;">
						<icon v-if="edit" class="delete delete-icon-7ye" @click="remove(item)" type="clear" size="22" style="position: absolute;right: -10rpx; top: -10rpx; z-index: 2;" />
						<image mode="aspectFill" :src="item.image" @click.prevent="preview(item.image)" @longpress.prevent="logoTime(item.image)"></image>
					</view>
				</view>
			</view>
		</view>
		<m-crop v-if="!isPush || isShare" @saveHndle="saveShow" style="position: absolute;left: -750rpx; top: -2000rpx;" @changeTitle="changeTitle"></m-crop>
		<m-button v-if="userInfo.type > 0 && hideBtn != 1" class="send-btn" circle type="warning" @click.native="sendMessage">发送消息</m-button>
		<m-button v-else-if="hideBtn != 1 && userInfo.type == 0" class="send-btn" circle type="warning" @click.native="sendMessage">转发给客服</m-button>
		<upload-progress :show="progressShow" :percent='percent' @uploadEnd="uploadEnd"></upload-progress>
		<uni-popup ref="popupService" type="share" :maskClick="false">
		    <view class="popup-service-group">
		    	<text @click="selectServiceType(item.type)" class="popup-service-item" :class="'popup-service-item-' + item.type" v-for="item in messList" :key="item.type">{{item.name}}</text>
				<text @click="selectServiceType('cancel')" class="popup-service-item popup-service-item-cancel">取消</text>
		    </view>
		</uni-popup>
		<uni-popup ref="popupuser" type="bottom" @change="popupUserChange">
			<uni-popup-user @select="userSelect" :popusers="popusers"></uni-popup-user>
		</uni-popup>
		<uni-popup ref="popupAvatar" type="share" :maskClick="false">
		    <view class="popup-service-group">
		    	<text @click="selectAvatar('confirm')" class="popup-service-item">重新选择</text>
				<text @click="selectAvatar('cancel')" class="popup-service-item popup-service-item-cancel">取消</text>
		    </view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupUser from '@/components/uni-popup/uni-popup-user.vue'
	import uploadProgress from '@/components/upload-progress/progress.vue'
	import cropImg from "@/components/img-cropping/cropping.vue"
	import {
		baseUrl
	} from "@/common/baseUrl.js"
	import mCrop from "@/components/crop/crop.vue"
	import mButton from "@/components/button/button.vue"
	import {
		get_user_info,
		upload_photo,
		upload_avatar,
		delete_photo,
		push_message,
		get_user_authority,
		upload_url_avatar
	} from "@/common/http.nvue.api.js"
	import cup from "@/common/cup.js"
	import {
		formatCity,
		formatDate,
		getConstellation
	} from "@/utils/param.js"
	import calculateStar from "@/common/calculateStar.js"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			mCrop,
			mButton,
			cropImg,
			uploadProgress,
			uniPopupUser
		},
		data() {
			return {
				showPhoto:false,
				isShow:false,
				isShare:false,
				popupImg:"",
				messList:[
					{
						type:'mosaic',
						name:"打码转发"
					},
					{
						type:'share',
						name:"直接转发"
					}
				],
				popusers:[],
				longTach:0,
				hideBtn: 0,
				isPush: false,
				progressShow: false,
				percent: 0,
				uploadTask: null,
				currentWebview: null,
				titleType: 1,
				sendData: {},
				uploadIndex: 0,
				sanwei: "",
				edit: 0,
				data: [],
				option: {},
				pic: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2063973452,3809158584&fm=26&gp=0.jpg"
			}
		},
		computed: {
			...mapGetters([
				"userInfo",
				"message_list",
				"currentUser",
				'txIm',
				'clientInfo',
				'networkState',
				'chatViewIsTabbar'
			]),
			addr() {
				let str = ""
				if (this.option.city && this.option.city.length) {
					for (let i = 0; i < this.option.city.length; i++) {
						let addr = formatCity(this.option.city[i])
						if (addr.province && addr.city) {
							str += `${addr.province.label}-${addr.city.label} `
						}
					}
				}
				return str
			}
		},
		watch: {
			titleType(val) {
				let title = ""
				if (val == 1) {
					title = "个人信息"
					this.currentWebview.setTitleNViewButtonStyle(1, {
						width: '0'
					});
				}
				if (val == 2) {
					title = "上传头像"
					this.saveShow()
				}
				if (val == 3) {
					title = "添加马赛克"
				}
				uni.setNavigationBarTitle({
					title
				})
			}
		},
		onNavigationBarButtonTap(ev) {
			if (this.titleType == 1) {
				uni.navigateBack({
					delta: 1
				});
			} else {
				if (ev.index == 0) {
					uni.$emit("closeCrop")
				} else {
					if (this.titleType == 2) {
						uni.$emit("saveAvatar")
					} else {
						uni.$emit("saveCrop")
					}

				}
			}
		},
		onShow() {
			this.isPush = false
			setTimeout(()=>{
				this.isShow = true
			},500)
			
		},
		onHide() {
			this.isShow = false
		},
		onLoad(option) {
			this.longTach = option.longTach
			this.hideBtn = option.hideBtn
			let pages = getCurrentPages()
			let page = pages[pages.length - 1];
			this.currentWebview = page.$getAppWebview();
			this.currentWebview.setTitleNViewButtonStyle(1, {
				width: '0'
			});
			uni.$on('uploadAvatar', this.uploadUrlAvatar)
			uni.$on("sendPeerMessage", this.sendPeerMessage)
			this.userid = option.userid
			this.edit = this.userid == this.userInfo.id || option.edit
			uni.$off('crop', this.setRect)
			uni.$on('cutResult', this.setRect)
			if(this.userInfo.type == 0) this.getUserAuthority()
			this.getInfo()
		},
		onUnload() {
			uni.$off('uploadAvatar', this.uploadUrlAvatar)
			uni.$off("sendPeerMessage", this.sendPeerMessage)
			uni.$off('cutResult', this.setRect)
		},
		methods: {
			...mapMutations([
				'setCurrentUser',
				'setUsers',
				'addMessage',
				'setServiceInfo',
				'pushSendMessage',
				'chageSendMesState',
				'setCropUser'
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
				let sex = this.option.sex
				uni.navigateTo({
					url:`/pages/user/headSelect?sex=${sex}`
				})
			},
			getUserAuthority() {
				get_user_authority({
					userid: this.userInfo.id
				}).then(res => {
					if (res.code == 0) {
						if (!res.data.length) {
							return
						}
						let rights6 = res.data.find(item => item.rights == 'rights6')
						if (!rights6 || rights6.actualval == 0) {
							return
						}
						if (rights6.actualval == 1) {
							this.showPhoto = true
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
			selectServiceType(type){
				this.$refs.popupService.close()
				setTimeout(()=>{
					uni.showTabBar()
				},300)
				if(type == "cancel"){
					this.isShare = false
					this.popupImg = ""
					return
				} 
				if(type == "share"){
					uni.navigateTo({
						url:`/pages/forward/index?img=${this.popupImg}`,
						success:()=> {
							this.isShare = false
							this.popupImg = ""
						}
					})
				}
				else {
					this.setCropUser(this.option)
					uni.getImageInfo({
						src:this.popupImg,
						success:(res) => {
							this.isShare = true
							uni.$emit("moscPhoto", res.path)
						}
					})
				}
			},
			userSelect(id){
				if(this.popusers.includes(id)){
					let index = this.popusers.findIndex(item=>item == id)
					this.popusers.splice(index, 1)
				} else {
					this.popusers.push(id)
				}
			},
			popupUserChange(e){
				this.popusers = []
				if(!e.show){
					this.isShare = false
					this.popupImg = ""
				}
			},
			logoTime(img) {
				if(this.userInfo.type > 0 ){
					if(this.option.servicecreate == 1 && this.longTach){
						this.popupImg = ""
						this.isPush = true
						this.isShare = false
						this.setCropUser(this.option)
						uni.navigateTo({
							url: `/pages/cropImg/cropImg?img=${img}`
						});
					} else {
						this.isPush = false
						this.$refs.popupService.open()
						this.popupImg = img
					}
				}
			},
			saveShow() {
				this.currentWebview.setTitleNViewButtonStyle(1, {
					width: '40'
				});
			},
			changeTitle(type) {
				this.titleType = type
			},
			uploadUrlAvatar(data){
				uni.showLoading({
					title:"上传中..."
				})
				upload_url_avatar({
					avatarimg: data.path,
					userid:  Number(this.option.id) 
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.option.avatarimg = data.path
						if(this.userInfo.id == this.option.id){
							uni.setStorageSync("users", { ...this.userInfo,
								avatarimg: data.path
							})
							getApp().globalData.users = {
								...this.userInfo,
								avatarimg: data.path
							}
							this.setUsers({
								...this.userInfo,
								avatarimg: data.path
							})
						}
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
			uploadImg(data) {
				let originalavatar = this.userInfo.avatarimg

				let token = uni.getStorageSync('token')
				this.uploadTask = uni.uploadFile({
					url: `${baseUrl}/users/useravatarimg`,
					timeout:10000,
					header: {
						token
					},
					formData: {
						userid: Number(this.userid),
						originalavatar: originalavatar || "",
					},
					files: [{
							name: 'newbase',
							uri: data.path
						},
						{
							name: 'originalbase',
							uri: data.path
						}
					],
					success: (res) => {
						if (res.statusCode && res.statusCode != 200) {
							uni.showToast({
								title: 'code:' + res.statusCode + '图片上传失败',
								icon: "none"
							})
							this.uploadEnd()
							return
						}
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							this.option.avatarimg = result.data
							if(this.userInfo.id == this.option.id){
								uni.setStorageSync("users", { ...this.userInfo,
									avatarimg: result.data
								})
								getApp().globalData.users = {
									...this.userInfo,
									avatarimg: result.data
								}
								this.setUsers({
									...this.userInfo,
									avatarimg: result.data
								})
							}
						} else {
							uni.showToast({
								title: result.msg,
								icon: "none"
							})
						}
						this.uploadEnd()
					},
					fail(err) {
						this.uploadEnd()
						console.log(err)
					}
				})
				
				this.progressShow = true
				//this.progressUpdate()
			},
			progressUpdate() {
				if (this.uploadTask) {
					this.uploadTask.onProgressUpdate(res => {
						console.log(res, 999)
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
			setRect({
				res,
				res2,
				index
			}) {
				this.changeTitle(1)
				if(this.isShare){
					uni.navigateTo({
						url:`/pages/forward/index?img=${res.path}`,
						success:()=> {
							this.isShare = false
							this.popupImg = ""
						}
					})
					return
				}
				if (this.isUploadAvatar) {
					this.uploadAvatr(res, res2)
				} else {
					this.uploadIndex = index
					this.uploadPhoto(res, res2)
				}
			},
			uploadAvatr(res, res2) {
				uni.showLoading({
					title: "上传中.."
				})
				let originalavatar = this.userInfo.avatarimg

				let token = uni.getStorageSync('token')
				this.uploadTask = uni.uploadFile({
					url: `${baseUrl}/users/useravatarimg`,
					header: {
						token
					},
					formData: {
						userid: Number(this.userid),
						originalavatar: originalavatar || "",
					},
					files: [{
							name: 'newbase',
							uri: res.path
						},
						{
							name: 'originalbase',
							uri: res2.path
						}
					],
					success: (res) => {
						uni.hideLoading()
						if (res.statusCode && res.statusCode != 200) {
							uni.showToast({
								title: 'code:' + res.statusCode + '图片上传失败',
								icon: "none"
							})
							this.uploadEnd()
							return
						}
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							this.option.avatarimg = result.data
							uni.setStorageSync("users", { ...this.userInfo,
								avatarimg: result.data
							})
							getApp().globalData.users = {
								...this.userInfo,
								avatarimg: result.data
							}
							this.setUsers({
								...this.userInfo,
								avatarimg: result.data
							})
						} else {
							this.uploadEnd()
							uni.showToast({
								title: result.msg,
								icon: "none"
							})
						}
					},
					fail(err) {
						this.uploadEnd()
						uni.hideLoading()
						console.error(err)
					}
				})
				this.progressShow = true
				//this.progressUpdate()
			},
			uploadPhoto(res, res2) {
				uni.showLoading({
					title: "上传中.."
				})
				let originalavatar = this.userInfo.avatarimg

				let token = uni.getStorageSync('token')
				this.uploadTask = uni.uploadFile({
					url: `${baseUrl}/users/uploaduserimg`,
					timeout:10000,
					header: {
						token
					},
					formData: {
						id: this.data[this.uploadIndex].id,
						userid: this.userInfo.id,
						order: this.uploadIndex,
						originalavatar: this.data[this.uploadIndex].image || ""
					},
					files: [{
							name: "newbase",
							uri: res.path
						},
						{
							name: "originalbase",
							uri: res2.path
						}
					],
					success: (res) => {
						uni.hideLoading()
						if (res.statusCode && res.statusCode != 200) {
							uni.showToast({
								title: 'code:' + res.statusCode + '图片上传失败',
								icon: "none"
							})
							this.uploadEnd()
							return
						}
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							this.data[this.uploadIndex].image = result.data
						} else {
							uni.showToast({
								title: result.msg,
								icon: "none"
							})
						}
						this.uploadEnd()
					},
					fail(err) {
						this.uploadEnd()
						uni.hideLoading()
						console.error(err)
					}
				});
				this.progressShow = true
				//this.progressUpdate()
			},
			preview(url) {
				uni.previewImage({
					urls: [url],
				});
			},
			getInfo() {
				get_user_info({
					userid: this.userid
				}).then(res => {
					this.option = res.data || {}
					if (this.option.id) {
						let birthday = formatDate(res.data.birthday)
						this.option.birthday = birthday
						this.option.constellation = getConstellation(birthday)
						this.data = this.restImgs(this.option.images)
						if (this.option.sex == 0) {
							this.sanwei = ""
							if (this.option.bust) this.sanwei += `·${this.option.bust}`
							if (this.option.waist) this.sanwei += `/${this.option.waist}`
							if (this.option.hips) this.sanwei += `/${this.option.hips}`
							if (this.option.cup) this.sanwei += `/${this.option.cup}`
						}
						if (this.edit == 0) {
							if (this.userInfo == 1 && this.option.servicecreate == 1) this.edit = 1
						}
					}

				}).catch(err => {
					console.error(err)
				})
			},
			restImgs(imgs) {
				let res = []
				for (let i = 0; i < 9; i++) {
					let item = imgs.find(item => item.order == i)
					if (item) {
						res.push(item)
					} else {
						res.push({
							image: '',
							id: 0
						})
					}
				}
				return res
			},
			topage() {
				this.navigateTo("/pages/user/nickName")
			},
			updatePhoto(index, isUploadAvatar) {
				if (isUploadAvatar) {
					if (!this.edit) return
					this.isUploadAvatar = true
				} else {
					this.isUploadAvatar = false
				}
				uni.$emit("crop", index)
			},
			remove(obj) {
				delete_photo({
					userid: this.userInfo.id,
					originalavatar: obj.image,
					id: obj.id
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						obj.image = ''
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					uni.hideLoading()
					console.error(err)
				})
			},
			sendMessage() {
				if (this.userInfo.type == 0) {
					if (!this.networkState) return
					this.setServiceInfo()
					let perfect = true
					if (!this.userInfo.birthday || !this.userInfo.city || !this.userInfo.city.length || !this.userInfo.height || !this
						.userInfo.weight) {
						perfect = false
					}
					this.sendData = {
						userid: this.userInfo.id,
						userInfo: {
							userid: this.userInfo.id,
							nickname: this.userInfo.nickname,
							avatar: this.userInfo.avatarimg
						},
						message: {
							isSelf: true,
							type: 2,
							date: new Date().getTime(),
							info: {
								userid: this.option.id,
								avatarimg: this.option.avatarimg,
								sex: this.option.sex,
								nickname: this.option.nickname,
								addr: this.option.citystr,
								age: this.option.age,
								constellation: this.option.constellation,
								height: this.option.height || '',
								weight: this.option.weight || '',
								sanwei: this.sanwei,
								hobby: this.option.hobby,
								freetime: this.option.freetime,
								travellocation: this.option.travellocation,
								target: this.option.target,
							},
							id: new Date().getTime(),
							perfect
						}
					}
					this.txIm.sendMessageText(JSON.stringify(this.sendData), this.currentUser.userInfo.userid + '', true, true, true)

					this.sendData.userid = this.currentUser.userInfo.userid
					this.sendData.userInfo = {
						userid: this.currentUser.userInfo.userid,
						nickname: this.currentUser.userInfo.nickname,
						avatar: this.currentUser.userInfo.avatar,
						cid: this.currentUser.userInfo.cid
					}
					this.sendData.message.id = this.sendData.message.id + '' + this.userInfo.id
					this.addMessage(this.sendData)
					this.pushSendMessage({
						userid: this.sendData.userid,
						mid: this.sendData.message.id
					})
					uni.switchTab({
						url: `/pages/chat-view/chat-view`
					})
					return
				}

				if (this.message_list[this.option.id]) {
					this.setCurrentUser(this.message_list[this.option.id])
				} else {
					this.setCurrentUser({
						userInfo: {
							userid: this.option.id,
							nickname: this.option.nickname,
							avatar: this.option.avatarimg
						},
						message: []
					})
				}
				
				if(this.chatViewIsTabbar){
					uni.switchTab({
						url: `/pages/chat-view/chat-view`
					})
				} else {
					uni.navigateTo({
						url: `/pages/chat-view/chat-view`
					})
				}
			},
			sendPeerMessage(res) {
				if(!this.isShow) return
				if (res.code == 0 || res.code == 4) {
					if (res.code == 4) this.pushMessage(this.sendData)
				} else {
					this.chageSendMesState()
					console.log("发送失败")
				}
			},
			pushMessage(data) {
				let targetUsrId = this.currentUser.userInfo.userid
				get_user_info({
					userid: targetUsrId
				}).then(res => {
					let title = res.data.nickname
					let cid = res.data.uinpush.cid
					let platform = res.data.uinpush.platform
					if (this.userInfo.uinpush.cid != cid) {
						push_message({
							body: '卡片',
							title,
							cid,
							click_type: "none",
							pushType: platform,
							url: ""
						}).then(res => {
							console.log("推送成功")
						}).catch(err => {
							console.log(err, "推送失败")
						})
					}
				}).catch(err => {
					console.error(err)
				})

			},
		}
	}
</script>
<style lang="scss" scoped>
	.user-info-content {
		background-color: white;
		padding: 0 30rpx;
		padding-bottom: 40rpx;

		.user-box {
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

					.color {
						color: #555555;
					}

					.addr-content {
						font-size: 26rpx;
						color: #e1b893;
						line-height: 1.2;
					}

					.addr-icon {
						width: 17rpx;
						height: 20rpx;
					}

					.user-name {
						padding-right: 20rpx;
						box-sizing: border-box;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.name-group {
						display: flex;
						align-items: center;
					}
				}
			}

		}

		.cell {
			font-size: 32rpx;
			color: #555555;
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			padding: 10rpx 0;

			.label {
				flex-shrink: 0;
			}

			.value {
				flex-grow: 1;
				font-size: 36rpx;
				color: #151515;
				// padding-top: 5rpx;
				padding: 10rpx 0;
				padding-left: 36rpx;
				// background-color: red;
			}
		}

		.cell-wrap {
			padding-bottom: 40rpx;
		}

		.photo-wrap {
			padding-top: 40rpx;

			.underline {
				font-size: 32rpx;
				color: #555555;
			}

			.ptoto-group {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				padding-top: 20rpx;
				justify-content: space-between;

				.photo {
					width: 223rpx;
					height: 223rpx;
					margin-top: 12rpx;
				}

				.default {
					width: 223rpx;
					height: 223rpx;
					background-color: #F6F6F6;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 223rpx;
						height: 223rpx;
					}

					.photo_default {
						width: 47rpx;
						height: 39rpx;
					}

					&.bgf6 {
						background-color: #F6F6F6;
					}
				}
			}
		}

		.send-btn {
			margin-top: 80rpx;
			margin-bottom: 40rpx;
		}

		.avatar-cut,
		.avatar-img {
			width: 190rpx;
			height: 190rpx;
			background-color: #E6E6E6;
			overflow: hidden;
			border-radius: 50%;
		}

		.m-r-10 {
			margin-right: 10rpx;
		}

		.color-e8 {
			color: #919191;
		}

		.p-2 {
			padding: 2rpx 0;
		}

		.service-create {
			padding-top: 9rpx;
		}
		
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
	.popup-service-item-mosaic{
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		border-bottom: 2rpx solid #F6F6F6;
	}
	.popup-service-item-share{
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	.popup-service-item-cancel{
		margin-top: 20rpx;
		background-color: #EFEFEF;
		border-radius: 20rpx;
	}
</style>
