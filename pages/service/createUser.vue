<template>
	<view class="filter-content">
		<!-- <m-select label="选择标签" type="tag" :labelWidth="120" multiple :list="tag" @confirm="confirmHandle" @remove="removehandle"
		 :data="tagData" :value="tagVal"></m-select> -->
		<m-select v-if="leve.length" label="会员等级" type="leve" :labelWidth="120" :list="leve" @confirm="confirmHandle" :value="leveVal"></m-select>
		<view class="uni-list-cell solid-b" v-if="sexVal[0]== 1">
			<view class="uni-list-cell-db">微信认证</view>
			<switch @change="changeState" color="#edd0b2" style="transform:scale(0.7)" />
		</view>
		<view class="ewm-text">微信二维码</view>		
		<view class="avatar-wrap ewmWrap">
			<icon v-if="ewm" @click="ewm = ''" type="clear" size="22" class="rem-close-btn delete-icon-7ye" />
			
			<!-- <u-icon size="40rpx" color="#edd0b2" v-if="imgData.path" class="close-btn" name="minus-square-fill" @click="imgData.path = ''"></u-icon> -->
			<!-- <m-crop v-if="!imgData.path" class="avatar-cut"></m-crop> -->
			<view v-if="!ewm" class="avatar-img" @click="uploadEwm">
				<uni-icons color="#aaaaaa" type="plusempty" size="30" />
			</view>
			<image v-else class="avatar-img" :src="ewm"></image>
		</view>
		<m-select label="性别" type="sex" :labelWidth="120" :list="sex" @confirm="confirmHandle" :value="sexVal"></m-select>
		<view class="avatar-wrap">
			<!-- <icon v-if="imgData.path" @click="imgData.path = ''" type="clear" size="22" class="close-btn" /> -->
			<!-- <u-icon size="40rpx" color="#edd0b2" v-if="imgData.path" class="close-btn" name="minus-square-fill" @click="imgData.path = ''"></u-icon> -->
			<!-- <m-crop v-if="!imgData.path" class="avatar-cut"></m-crop> -->
			<!-- <crop-img v-if="!imgData.path" class="avatar-cut" selWidth="500upx" selHeight="500upx" @upload="uploadImg" inner
			 stretch="x">
				<uni-icons color="#aaaaaa" type="plusempty" size="30" />
			</crop-img> -->
			<view class="avatar-cut" v-if="!imgData.path" @click="toHeadSelectPage">
				<uni-icons color="#aaaaaa" type="plusempty" size="30" />
			</view>
			<image v-else class="avatar-img" :src="imgData.path" @click="popAvatarShow"></image>
		</view>
		<view class="select_input colum">
			<text class="y_text">昵称</text>
			<input class="uni-input" maxlength="7" placeholder="请输入..." v-model="nickname" />
			<view class="clear-data" v-if="nickname !== ''" @click="clearThis('nickname')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">手机</text>
			<input class="uni-input"  type="number" placeholder="请输入..." v-model="phone" />
			<view class="clear-data" v-if="phone !== ''" @click="clearThis('phone')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">密码</text>
			<input class="uni-input"  placeholder="请输入..." v-model="pass_word" />
			<view class="clear-data" v-if="pass_word !== ''" @click="clearThis('pass_word')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<!-- <view class="select_input">
			<text>出生日期</text>
			<view class="uni-input date">
				<picker mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{birthday}}</view>
				</picker>
			</view>
		</view> -->
		<view class="select_input solid-b" style="background-color: rgba(0,0,0,0);">
			<text class="y_text" style="width: 200rpx;">出生日期</text>
			<view class="uni-input date" style="padding: 0;display: flex;justify-content: flex-end;background-color: rgba(0,0,0,0);">
				<view @click="visible = true">
					<view class="uni-input" style="background-color: rgba(0,0,0,0);border: none;height: 110rpx;display: flex;align-items: center;">
						{{birthday}}
						<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">身高</text>
			<input type="digit"  class="uni-input" placeholder="请输入(cm)..." v-model="height" />
			<view class="clear-data" v-if="height !== ''" @click="clearThis('height')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">体重</text>
			<input type="digit"   class="uni-input" placeholder="请输入(kg)..." v-model="weight" />
			<view class="clear-data" v-if="weight !==''" @click="clearThis('weight')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view v-if="sexVal[0]== 1">
			<view class="select_input colum">
				<text class="y_text">胸围</text>
				<input type="digit" class="uni-input" placeholder="请输入..." v-model="bust" />
				<view class="clear-data" v-if="bust !==''" @click="clearThis('bust')">
					<u-icon name="close" color="#ffffff" size="10"></u-icon>
				</view>
			</view>
			<view class="select_input colum">
				<text class="y_text">腰围</text>
				<input type="digit" class="uni-input" placeholder="请输入..." v-model="waist" />
				<view class="clear-data" v-if="waist !==''" @click="clearThis('waist')">
					<u-icon name="close" color="#ffffff" size="10"></u-icon>
				</view>
			</view>
			<view class="select_input colum">
				<text class="y_text">臀围</text>
				<input type="digit" class="uni-input" placeholder="请输入..." v-model="hips" />
				<view class="clear-data" v-if="hips !==''" @click="clearThis('hips')">
					<u-icon name="close" color="#ffffff" size="10"></u-icon>
				</view>
			</view>
			<m-select :fontSize="28" :minHeight="110" label="罩杯" type="cup" :list="cup" @confirm="confirmHandle" :value="cupVal">
			</m-select>
		</view>
		<m-select class="multiple-select" :fontSize="28" :minHeight="110" :labelWidth="120" label="常驻城市" mode="mutil-column-auto" type="province" multiple
		 :data="provinceData" :list="province" @confirm="confirmHandle" @remove="removehandle" :value="provinceVal">
		</m-select>
		<view class="select_input colum">
			<text class="y_text">职业</text>
			<input  class="uni-input" placeholder="请输入..." v-model="vocation" />
			<view class="clear-data" v-if="vocation !== ''" @click="clearThis('vocation')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<m-select label="情感情况" :fontSize="28" :minHeight="110" type="feelCompile" :labelWidth="120" :list="feelCompile" @confirm="confirmHandle" :value="feelCompileVal">
		</m-select>
		<view class="select_input solid-b">
			<text class="y_text">是否字母圈</text>
			<view class="btn-right-group">
				<view class="_btn" @click="sadomasochism = 1" :class="{active:sadomasochism == 1}">是</view>
				<view class="_btn" @click="sadomasochism = 0" :class="{active:sadomasochism == 0}">否</view>
			</view>
		</view>

		<!-- <view class="like-wrap">
			<text>兴趣爱好</text>
			<view class="like-group solid-t">
				<view class="like-item" :class="{active:item.check}" v-for="item in like" :key="item.id" @click="changeLike(item)">
					{{item.label}}
				</view>
			</view>
		</view> -->
		<view class="select_input colum">
			<text class="y_text">兴趣爱好</text>
			<input class="uni-input " placeholder="请输入..."  v-model="hobbystr" />
			<view class="clear-data" v-if="hobbystr !==''" @click="clearThis('hobbystr')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">喜欢什么类型的约会对象</text>
			<input class="uni-input"  placeholder="请输入..." v-model="ment" />
			<view class="clear-data" v-if="ment !== ''" @click="clearThis('ment')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">喜欢的食物</text>
			<input class="uni-input"  placeholder="请输入..." v-model="food" />
			<view class="clear-data" v-if="food !== ''" @click="clearThis('food')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">最近想去什么地方旅行</text>
			<input class="uni-input"  placeholder="请输入..." v-model="travellocation" />
			<view class="clear-data" v-if="travellocation !== ''" @click="clearThis('travellocation')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">喜欢哪种约会方式</text>
			<input class="uni-input"  placeholder="请输入..." v-model="mode" />
			<view class="clear-data" v-if="mode !== ''" @click="clearThis('mode')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum" v-if="sexVal[0]== 0">
			<text class="y_text">爱车型号</text>
			<input class="uni-input"  placeholder="请输入..." v-model="vehicle" />
			<view class="clear-data" v-if="vehicle !== ''" @click="clearThis('vehicle')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">想找一个什么样的人?</text>
			<textarea class="uni-textarea" placeholder="请输入..." v-model="target" />
			<view class="clear-data down" v-if="target !== ''" @click="clearThis('target')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="select_input colum">
			<text class="y_text">介绍一下下自己是个怎么样的人?</text>
			<textarea class="uni-textarea" placeholder="请输入..." v-model="describe" />
			<view class="clear-data down" v-if="describe !== ''" @click="clearThis('describe')">
				<u-icon name="close" color="#ffffff" size="10"></u-icon>
			</view>
		</view>
		<view class="btn-group">
			<m-button class="btn" circle type="warning" @click.native="save">保存</m-button>
		</view>
		<upload-progress :show="progressShow" :percent='percent' @uploadEnd="uploadEnd"></upload-progress>
		<w-picker :value="birthday == '' ? this.getNowDate(): birthday" :visible.sync="visible" mode="date"
		 fields="day" @confirm="onConfirm" ref="date"></w-picker>
		 <uni-popup ref="popupAvatar" type="share" :maskClick="false">
		     <view class="popup-service-group">
		     	<text @click="selectAvatar('confirm')" class="popup-service-item">重新选择</text>
		 		<text @click="selectAvatar('cancel')" class="popup-service-item popup-service-item-cancel">取消</text>
		     </view>
		 </uni-popup>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import uploadProgress from '@/components/upload-progress/progress.vue'
	import cropImg from "@/components/img-cropping/cropping.vue"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {baseUrl} from "@/common/baseUrl.js"
	import mCrop from "@/components/crop/crop.vue"
	import {
		feelCompile,
		leve,
		cup
	} from "@/common/filter.js"
	import province from "@/common/province.js"
	import mSelect from '@/components/m-select/select.vue'
	import mButton from "@/components/button/button.vue"
	import {
		get_like_data,
		get_tag,
		get_user_info,
		compile_user,
		upload_avatar,
		creater_user,
		get_leve
	} from "@/common/http.nvue.api.js"
	import {
		paramJson,
		getDate,
		formatCity,
		formatDate,
		getNowDate
	} from '@/utils/param.js'

	export default {
		components: {
			mSelect,
			mButton,
			mCrop,
			cropImg,
			uploadProgress,
			wPicker
		},
		data() {
			return {
				visible:false,
				status:false,
				userid:0,
				phone:"",
				pass_word:"",
				ewm:'',
				progressShow:false,
				percent:0,
				uploadTask:null,
				imgData:{
					path:'',
					width:0,
					height:0
				},
				originalImg:{},
				hobbystr:"",
				bust:"",
				cup:"",
				waist:"",
				hips:"",
				birthday:"",
				sexVal:[0],
				sex:[
					{
						value:1,
						label:"男"
					},
					{
						value:0,
						label:"女"
					}
				],
				height: "",
				weight: "",
				vocation: "",
				sadomasochism: 1,
				ment:"",
				target:"",
				food:"",
				travellocation:"",
				mode:"",
				vehicle:"",
				describe:"",
				province: province,
				provinceVal: [0, 0],
				provinceData: [],
				feelCompile: feelCompile,
				feelCompileVal: [0],
				cup:cup,
				cupVal: [0],
				leve: [],
				leveVal: [0],
				like: [],
				tag: [{
					value: "-1",
					label: "不限"
				}],
				tagVal: [0],
				tagData: [],
				nickname: ''
			}
		},
		computed: {
			...mapGetters([
				"userInfo"
			]),
			startDate() {
				return getDate('start');
			},
			endDate() {
				return getDate('end');
			}
		},
		onLoad(option) {
			uni.$on('cutResult', this.setImgInfo)
			uni.$on('uploadAvatar', this.uploadAvatar)
			this.init()
		},
		onUnload() {
			uni.$off('cutResult', this.setImgInfo)
			uni.$off('uploadAvatar', this.uploadAvatar)
		},
		methods: {
			...mapMutations([
				'setUsers'
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
				let sex = this.sexVal[0] == 0 ? 1 : 0
				uni.navigateTo({
					url:`/pages/user/headSelect?sex=${sex}`
				})
			},
			setImgInfo({
				res,
				res2
			}) {
				this.imgData.path = res.path
				this.imgData.width = res.width
				this.imgData.height = res.height
				this.originalImg = res2
				this.uploadAvatr()
			},
			getNowDate(){
				return getNowDate(false, 20)
			},
			onConfirm(ev){
				this.birthday = ev.value
			},
			changeState(e){
				this.status = e.detail.value
			},
			progressUpdate(){
				if(this.uploadTask){
					this.uploadTask.onProgressUpdate(res=>{
						this.percent = res.progress
						if(this.percent == 100){
							setTimeout(()=>{
								this.uploadEnd()
							},1500)
						}
					})
				}
			},
			uploadEnd(){
				this.progressShow = false
				setTimeout(()=>{
					this.percent = 0
				},300)
			},
			uploadAvatar(data){
				this.imgData.path = data.path
				// let token = uni.getStorageSync("token")
				
				// this.uploadTask = uni.uploadFile({
				// 	url: `${baseUrl}/fileupload/addimg`,
				// 	header: {
				// 		token
				// 	},
				// 	files: [
				// 		{
				// 			name: "id",
				// 			uri: data.path
				// 		}
				// 	],
				// 	success: (res) => {
				// 		if(res.statusCode && res.statusCode != 200){
				// 			uni.showToast({
				// 				title: 'code:' + res.statusCode + '图片尺寸过大请压缩后上传',
				// 				icon: "none"
				// 			})
				// 			return
				// 		}
				// 		let result = JSON.parse(res.data)
				// 		if (result.code == 0) {
				// 			this.imgData.path = result.data[0]
				// 		} else {
				// 			uni.showToast({
				// 				title: result.msg,
				// 				icon: "none"
				// 			})
				// 		}
				// 		this.uploadEnd()
				// 	},
				// 	fail(err) {
				// 		this.uploadEnd()
				// 		console.error(err)
				// 	}
				// })
				// this.progressShow = true
				//this.progressUpdate()
			},
			uploadEwm(){
				uni.chooseImage({
				    count: 1,
				    success: (data) =>{
				        let token = uni.getStorageSync("token")
				        this.uploadTask = uni.uploadFile({
				        	url: `${baseUrl}/fileupload/addimg`,
				        	header: {
				        		token
				        	},
				        	files: [
				        		{
				        			name: "id",
				        			uri: data.tempFilePaths[0]
				        		}
				        	],
				        	success: (res) => {
				        		if(res.statusCode && res.statusCode != 200){
				        			uni.showToast({
				        				title: 'code:' + res.statusCode + '图片上传失败',
				        				icon: "none"
				        			})
									this.uploadEnd()
				        			return
				        		}
				        		let result = JSON.parse(res.data)
				        		if (result.code == 0) {
				        			this.ewm = result.data[0]
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
				        		console.error(err)
				        	}
				        })
				        this.progressShow = true
				        //this.progressUpdate()
				    }
				 });
			},
			uploadAvatr(){
				
			},
			bindDateChange(e){
				this.birthday = e.target.value
			},
			init() {			
				Promise.all([get_tag(),get_leve()])
					.then(([tag, leve]) => {
						if (tag.code == 0) {
							this.tag = [{
								value: "-1",
								label: "不限"
							}]
							let res = tag.data.map(item => {
								return {
									value: item.id + '',
									label: item.tagname,
								}
							})
							this.tag.push(...res)
						} else {
							uni.showToast({
								title: tag.msg
							})
						}
						if (leve.code == 0) {
							let data = leve.data.level || []
							data.unshift({
								id:0,
								name:"非会员"
							})
							this.leve = data.map(item=>{
								return {
									value:item.id,
									label:item.name
								}
							})
						} else {
							uni.showToast({
								title: leve.msg
							})
						}
					}).catch(err => {
						console.error(err)
					})
			},
			confirmHandle(data) {
				let type = data.type
				let index

				if (data.type == "tag") {
					index = this[type].findIndex(item => item.value === data.val[0].value)
					this[type + 'Val'] = [index]
					if (index == 0) {
						this[type + 'Data'] = []
					} else {
						let zero = this[type + 'Data'].some(item => item == 0)
						if (zero) {
							this[type + 'Data'] = []
						} else {
							let include = this[type + 'Data'].some(item => item == index)
							if (!include) {
								this[type + 'Data'].push(index)
							}
						}
					}
				} else if (data.mode == 'mutil-column-auto') {
					//改成单选
					this[type + 'Data'] = []
					
					index = this[type].findIndex(item => item.value === data.val[0].value)
					let lastIndex = this[type][index].children.findIndex(item => item.value === data.val[1].value)
					this[type + 'Val'] = [index, lastIndex]
					if (index == 0) {
						this[type + 'Data'] = []
					} else {
						let zero = this[type + 'Data'].some(item => item[0] == 0)
						if (zero) {
							this[type + 'Data'] = []
						} else {
							let include = this[type + 'Data'].some(item => item[0] == index && item[1] == lastIndex)
							if (!include) {
								this[type + 'Data'].push([index, lastIndex])
							}
						}
					}
				} else if (data.mode == 'mutil-column') {
					index = this[type][0].findIndex(item => item.value === data.val[0].value)
					let lastIndex = this[type][1].findIndex(item => item.value === data.val[1].value)
					this[type + 'Val'] = [index, lastIndex]
				} else {
					index = this[type].findIndex(item => item.value === data.val[0].value)
					if(data.type == 'sex' && this[type + 'Val'][0] != index) this.imgData.path = ""
					this[type + 'Val'] = [index]
				}
			},
			removehandle({
				val,
				type
			}) {
				let _index
				if (type == "province") {
					let p = val.split('-')[0]
					let c = val.split('-')[1]
					let parent = this[type].find(item => item.value == p)
					let index = this[type].findIndex(item => item.value == p)
					let lastIndex = parent.children.findIndex(item => item.value == c)
					_index = this[type + "Data"].findIndex(item => item[0] == index && item[1] == lastIndex)
				} else {
					let index = this[type].findIndex(item => item.value == val)
					_index = this[type + "Data"].findIndex(item => item == index)
				}
				if (_index > -1) {
					this[type + "Data"].splice(_index, 1)
				}

			},
			changeLike(obj) {
				obj.check = !obj.check
				if (obj.check && obj.id == 0) {
					for (let i = 1; i < this.like.length; i++) {
						this.like[i].check = false
					}
					return
				}
				if (obj.id != 0 && obj.check) {
					this.like[0].check = false
					return
				}
				let iSelect = this.like.some(item => item.check)
				if (!iSelect) {
					this.like[0].check = true
				}
			},
			save() {
				if(!this.imgData.path || this.nickname === '' || !this.ewm || this.phone == ''){
					let title = ""
					if(!this.ewm) title = "请上传二维码"
					else if(!this.imgData.path) title = "请上传头像"
					else if(this.nickname === '') title = "请输入昵称"
					else if(this.phone == '') title = "请输入手机号"
					else if(!(/^1[3|4|5|7|8]\d{9}$/.test(this.phone))) title = "手机号码有误"
					
					uni.showToast({
						title,
						icon:"none"
					})
					return
				}
				uni.showLoading({
					title:"正在提交..."
				})

				let data = {
					avatarimg: this.imgData.path,
					  nickname: this.nickname,
					  password: this.pass_word,
					  phone: this.phone,
					  sex: this.sexVal[0] == 0 ? 1 : 0,
					  wechatcode: this.ewm
				}
				
				creater_user(data).then(res=>{
					
					if(res.code == 0){
						if(res.code == 0){
							this.userid = res.data
							this.compileHser()
						}
					} else {
						uni.hideLoading()
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.log(err)
				})
				
			},
			compileHser(){
				let param = this.getParam()
				compile_user(param).then(res=>{
					uni.hideLoading()
					if(res.code == 0){
						console.log(res,'编辑用户成功')
						uni.redirectTo({
							url: `/pages/user/info?userid=${this.userid}&edit=1&longTach=1`
						});
						
					} else {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.error(err)
				})
			},
			getParam() {
				//let tagid = this.getTagId()
				let level = this.leve[this.leveVal[0]].value
				let avatar = this.imgData
				
				let hoobyid = this.like.filter(item => item.check && item.id != 0)
				
				let _permanent_city = this.getCityCode(this.provinceData)
				let permanent_city = _permanent_city.map(item=>{
					return{
						city:item.city,
						cityname:item.label
					}
				})
				let emotion = this.feelCompileVal[0] == 0 ? "" : this.feelCompile[this.feelCompileVal[0]].label
				let res = {
					status:this.status ? 1 : 0,
					tagid:"",
					nickname: this.nickname,
					birthday:this.birthday,
					height:Number(this.height),
					weight:Number(this.weight),
					permanent_city,
					city:_permanent_city.length ? _permanent_city[0].city : "",
					cityName:_permanent_city.length ? _permanent_city[0].label : "",
					hobbystr:this.hobbystr,
					vocation:this.vocation,
					emotion,
					sadomasochism:this.sadomasochism,
					ment:this.ment,
					food:this.food,
					travellocation:this.travellocation,
					mode:this.mode,
					vehicle:"",
					target:this.target,
					describe:this.describe,
					userid:Number(this.userid),
					bust:0,
					waist:0,
					hips:0,
					cup:"",
					level
				}
				if(this.sexVal[0] == 0){
					res.vehicle = this.vehicle
					
				} else {
					res.bust = Number(this.bust) 
					res.waist = Number(this.waist)
					res.hips = Number(this.hips)
					res.cup = this.cupVal[0] == 0 ? "" : this.cup[this.cupVal[0]].label
				}
				return res
			},
			clearThis(key){
				//点击清除内容
				this[key] = '';
			},
			getCityCode(arr) {
				if (!arr.length) {
					return []
				}
				let res = []
				for (let i = 0; i < arr.length; i++) {
					let p = this.province[arr[i][0]]
					let c = p.children[arr[i][1]]
					res.push({
						city:c.value
					})
				}
				return res
			},
			getTagId() {
				let tags = this.tag.filter((item, index) => this.tagData.includes(index))
				return tags.map(item => item.value).join(",")
			},
			sort(n1, n2, type) {

				let res = {
					start: 0,
					end: 0
				}
				if (n1 == 0) {
					return res
				}
				let s = this[type][0][n1].value
				let n = this[type][1][n2].value
				let start
				let end
				if (Number(s) > Number(n)) {
					start = n
					end = s
				} else {
					start = s
					end = n
				}
				res.start = start == -1 ? 0 : Number(start)
				res.end = end == -1 ? 0 : Number(end)
				return res
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
	.filter-content {
		width: 100%;
		padding: 20px;

		.arrow {
			display: flex;
			align-items: center;

			.arrow-text {
				padding-right: 5px;
				text-align: right;
				color: #999999;
			}
		}

		.multiple-select {
			min-height: 90rpx;
			padding: 10rpx 0;
		}

		.like-wrap {
			text {
				font-size: 30rpx;
				color: #333333;
				height: 90rpx;
				line-height: 90rpx;
			}

			.like-group {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.like-item {
					width: 150rpx;
					height: 50rpx;
					width: 147rpx;
					text-align: center;
					line-height: 50rpx;
					border: 1px solid #EEEEEE;
					margin: 10rpx;
					border-radius: 30rpx;

					&.active {
						background: #EEEEEE;
					}
				}
			}
		}

		.btn-group {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn {
				flex: 1;
			}
			margin: 40rpx auto 20rpx;
		}
		.ewm-text{
			font-size: 28rpx;
			color: #333333;
			text-align: left;
			margin-top: 10px;
		}
		.select_input {
			border-bottom: 1px solid #F6F6F6;
			display: flex;
			align-items: center;
			justify-content: space-between;
			// height: 90rpx;
			// line-height: 90rpx;
			.date{
				padding: 0 15rpx;
				margin-left: 45rpx;
			}
			.uni-input {
				flex: 1;
				box-sizing: border-box;
				padding-left: 10rpx;
				text-align: right;
				font-size: 28rpx;
				color: #999999;
				background-color: #F6F6F6;
				height: 110rpx;
				border-radius: 5rpx;
				text-indent: 20rpx;
				
				&.uni-input-text-left {
					text-align: left;
					margin-left: 100rpx;
				}
				&.uni-input-text-left-30{
					text-align: left;
					margin-left: 30rpx;
				}
			}

			.arrow-text {
				color: #999999;
			}

			.btn-right-group {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				._btn{
					width: 140rpx;
					height: 50rpx;
					line-height: 50rpx;
					border: 1rpx solid #eeeeee;
					text-align: center;
					color: #999999;
					border-radius: 30rpx;
					margin-left: 30rpx;
					&.active{
						background-color: #eeeeee;
						color: #555555;
					}
				}
			}
			&.colum{
				flex-direction: column;
				height: auto;
				align-items: flex-start;
				border-bottom: 0;
				.uni-input{
					padding-left: 0;
				}
				.uni-textarea{
					height: 200rpx;
					background-color: #F6F6F6;
					border-radius: 10rpx;
					width: 100%;
					font-size: 28rpx;
					color: #999999;
					box-sizing: border-box;
					padding: 15rpx;
				}
			}
		}

		.select-placeholder {
			color: #999999;
			text-align: right;
			font-weight: normal;
			font-size: 22rpx;
			font-size: 28rpx;
		}

		.text_color_9 {
			color: #999999;
		}
		.avatar-wrap {
			width: 200rpx;
			height: 200rpx;
			margin: 50px auto 50px;
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
			.rem-close-btn{
				position: absolute;
				right: -15rpx;
				top: -15rpx;
				z-index: 1;
			}
		}
		.ewmWrap{
			width: 400rpx!important;
			height: 400rpx!important;
			margin: 20px auto 20px!important;
			.avatar-cut,
			.avatar-img {
				border-radius: 0!important;
				display: flex!important;
				align-items: center!important;
				justify-content: center!important;
			}
		}
	}
	
	/deep/ .pdl-10{
		padding-left: 20rpx;
	}
	/deep/ .text-p{
		padding-left: 20rpx;
		padding-top: 20rpx;
	}
	.solid-b{
		border-bottom: 1px solid #F6F6F6;
	}
	.solid-t{
		border-top: 1px solid #F6F6F6;
	}
	.filter-content {
		width: 100%;
		padding: 20px;
	
		.arrow {
			display: flex;
			align-items: center;
	
			.arrow-text {
				padding-right: 5px;
				text-align: right;
				color: #999999;
			}
		}
	
		.multiple-select {
			// min-height: 110rpx;
			padding: 10rpx 0;
		}
	
		.like-wrap {
			text {
				font-size: 28rpx;
				color: #333333;
				height: 110rpx;
				line-height: 110rpx;
			}
	
			.like-group {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				height: 110rpx;
				.like-item {
					width: 150rpx;
					height: 50rpx;
					width: 147rpx;
					text-align: center;
					line-height: 50rpx;
					border: 1px solid #EEEEEE;
					margin: 10rpx;
					border-radius: 30rpx;
	
					&.active {
						background: #EFD3B6;
						color: #555555;
						border: none;
					}
				}
			}
		}
	
		.btn-group {
			display: flex;
			align-items: center;
			justify-content: space-between;
	
			.btn {
				flex: 1;
			}
			margin: 40rpx auto 20rpx;
		}
	
		.select_input {
			
			display: flex;
			align-items: center;
			justify-content: space-between;
			// height: 90rpx;
			// line-height: 90rpx;
			position: relative;
			.y_text{
				height: 110rpx;
				width: 100%;
				line-height: 110rpx;
				font-size: 28rpx;
			}
			.clear-data{
				position: absolute;
				width: 26rpx;
				height: 26rpx;
				border-radius: 1000px;
				background-color: #999999;
				color: #fff;
				text-align: center;
				line-height: 26rpx;
				right: 0;
				top: 152rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.down{
				top: 187rpx;
			}
			.date{
				padding: 0 15rpx;
				display: flex;
				align-items: center;
				// margin-left: 45rpx;
			}
			.uni-input {
				flex: 1;
				box-sizing: border-box;
				// padding-left: 10rpx;
				text-align: left;
				font-size: 28rpx;
				color: #999999;
				background-color: #F6F6F6;
				height: 70rpx;
				border-radius: 5rpx;
				
				&.uni-input-text-left {
					text-align: left;
					margin-left: 100rpx;
				}
				&.uni-input-text-left-30{
					text-align: left;
					margin-left: 30rpx;
				}
			}
	
			.arrow-text {
				color: #999999;
			}
	
			.btn-right-group {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				._btn{
					width: 140rpx;
					height: 50rpx;
					line-height: 50rpx;
					border: 1rpx solid #eeeeee;
					text-align: center;
					color: #999999;
					border-radius: 30rpx;
					margin-left: 30rpx;
					&.active{
						background-color:#EFD3B6;
						color: #555555;
						border: none;
					}
				}
			}
			&.colum{
				flex-direction: column;
				height: auto;
				align-items: flex-start;
				border-bottom: 0;
				.y_text{
					height: 110rpx;
					width: 100%;
					line-height: 110rpx;
					font-size: 28rpx;
				}
				.uni-input{
					// padding-left: 20rpx;
					width: 100%;
					height: 110rpx;
					border-bottom: 1px solid #F6F6F6;
					border-top: 1px solid #F6F6F6;
					background-color: rgba(0,0,0,0);
				}
				.uni-textarea{
					height: 179rpx;
					background-color:rgba(0,0,0,0);
					border-radius: 10rpx;
					width: 100%;
					font-size: 28rpx;
					color: #999999;
					box-sizing: border-box;
					// padding: 15rpx;
					border-bottom: 1px solid #F6F6F6;
					border-top: 1px solid #F6F6F6;
					box-sizing: border-box;
					padding: 0 20rpx;
				}
			}
		}
	
		.select-placeholder {
			color: #999999;
			text-align: right;
			font-weight: normal;
			font-size: 22rpx;
			font-size: 28rpx;
		}
	
		.text_color_9 {
			color: #999999;
		}
		.avatar-wrap {
			width: 200rpx;
			height: 200rpx;
			margin: 50px auto 50px;
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
		
			.close-btn {
				position: absolute;
				right: 5rpx;
				top: 5rpx;
				z-index: 1;
			}
		}
		.uni-list-cell {
			height: 110rpx;
			display:flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
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
