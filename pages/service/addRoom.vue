<template>
	<view class="content">
		<crop-img class="roomImg" selWidth="690upx" selHeight="320upx" :avatarSrc="coverImg" @upload="upload" inner stretch="x">
		</crop-img>
		<view class="m-form">
			<uni-forms ref="form" :value="formData" :rules="rules" errShowType="toast">
				<uni-forms-item class="uni-forms-item" label="房间名称" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入.." />
				</uni-forms-item>
				<uni-forms-item class="uni-forms-item" label="公告" name="notice">
					<uni-easyinput type="text" v-model="formData.notice" placeholder="请输入.." />
				</uni-forms-item>
				<view class="m-uni-forms">
					<text class="label">房间类型</text>
					<radio-group @change="radioChange" class="radio-group">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
							<view>
								<radio :value="item.value" :checked="item.value == formData.attr" />
							</view>
							<view>{{item.name}}</view>
						</label>
					</radio-group>
				</view>
				<view class="m-uni-forms">
					<text class="label">开始时间</text>
					<view class="form-item-date">
						<view class="date-start date" :class="{error:startDateError}" @click="pickerShow('start')">
							<text class="date-text">{{starttime || '请选择'}}</text>
						</view>
					</view>
				</view>
				<view class="m-uni-forms">
					<text class="label">结束时间</text>
					<view class="form-item-date">
						<view class="date-end date" :class="{error:endDateError}" @click="pickerShow('end')">
							<text class="date-text">{{endtime || '请选择'}}</text>
						</view>
					</view>
				</view>
				<m-button class="submitBtn" circle type="warning" @click.native="submit">保存</m-button>
			</uni-forms>
		</view>
		<w-picker :visible.sync="visible" mode="date" :value="startDate" :disabled-after="disabledAfter"
		 fields="second" @confirm="onConfirm" @cancel="onCancel" ref="date"></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		baseUrl
	} from "@/common/baseUrl.js"
	import {
		create_room
	} from "@/common/http.nvue.api.js"

	import {
		getDate,
		getNowDate
	} from '@/utils/param.js'
	import mButton from "@/components/button/button.vue"
	import cropImg from "@/components/img-cropping/cropping.vue"
	import uniForms from "@/components/form/uni-forms/uni-forms.vue"
	import uniFormsItem from "@/components/form/uni-forms-item/uni-forms-item.vue"
	import uniEasyinput from "@/components/form/uni-easyinput/uni-easyinput.vue"
	export default {
		components: {
			cropImg,
			uniForms,
			uniFormsItem,
			uniEasyinput,
			mButton,
			wPicker
		},
		data() {
			return {
				disabledAfter:false,
				timeType:"",
				visible:false,
				coverImg: '',
				startDate: getNowDate(true),
				starttime: "",
				endtime: "",
				startDateError: false,
				endDateError: false,
				formData: {
					name: '',
					notice: '',
					attr: '2'
				},
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入房间名称',
						}]
					},
					notice: {
						rules: [{
							required: true,
							errorMessage: '请输入公告',
						}]
					},
					attr: {
						rules: []
					}
				},
				items: [{
						value: '2',
						name: '自由上麦',
						checked: 'true'
					},
					{
						value: '4',
						name: '排序'
					},
					{
						value: '8',
						name: '主席模式'
					}
				]
			}
		},
		onLoad() {
		},
		methods: {
			upload(data) {
				this.coverImg = data.path
			},
			submit() {
				if (this.coverImg == '') {
					uni.showToast({
						title: "请上传图片",
						icon: "none"
					})
					return
				}
				this.$refs.form.submit().then(res => {
					if (this.starttime == '') {
						uni.showToast({
							title: "请填选择开始时间",
							icon: "none"
						})
						this.startDateError = true
						return
					}
					if (this.endtime == '') {
						uni.showToast({
							title: "请选择结束时间",
							icon: "none"
						})
						this.endDateError = true
						return
					}
					let stime = (new Date(this.starttime)).getTime()
					let etime = (new Date(this.endtime)).getTime()
					if (stime > etime) {
						uni.showToast({
							title: "开始时间不能大于截止时间！",
							icon: "none"
						})
						this.startDateError = true
						return
					}
					this.createRomm()
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			radioChange: function(evt) {
				this.formData.attr = evt.detail.value
			},
			bindDateChange(e, data) {
				if (data == 'starttime') {
					this.startDate2 = e.detail.value
					this.startDateError = false
				} else {
					this.endDate = e.detail.value
					this.endDateError = false
				}
				this[data] = e.detail.value
			},
			createRomm() {
				uni.showLoading({
					title: "房间创建中..."
				})
				let token = uni.getStorageSync('token')
				uni.uploadFile({
					url: `${baseUrl}/room/createroom`,
					timeout:10000,
					header: {
						token
					},
					formData: {
						name: this.formData.name,
						starttime: this.starttime,
						endtime: this.endtime,
						attr: Number(this.formData.attr),
						notice: this.formData.notice
					},
					files: [{
						name: 'img',
						uri: this.coverImg
					}],
					success: (res) => {
						uni.hideLoading()
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							uni.showToast({
								title: "创建成功",
							})
							uni.navigateBack({
								delta:1
							})
							uni.$emit('updateRoom') 
						} else {
							uni.showToast({
								title: result.msg,
								icon: "none"
							})
						}
					},
					fail(err) {
						uni.hideLoading()
						console.error(err)
					}
				})
			},
			pickerShow(type){
				this.timeType = type
				this.disabledAfter = false
				if(type = "start"){
					if(this.endtime == '') this.startDate = getNowDate(true)
					else {
						let stime = (new Date(this.starttime)).getTime()
						let etime = (new Date(this.endtime)).getTime()
						if(stime > etime){
							this.starttime = this.endtime
							this.disabledAfter = true
						}
					}
				} else {
					if(this.starttime == '') this.startDate = getNowDate(true)
				}
				this.visible = true
			},
			onCancel(){
				
			},
			onConfirm(ev){
				if(this.timeType == 'start'){
					this.starttime = ev.value
					this.startDateError = false
				} else {
					this.endtime = ev.value
					this.endDateError = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		min-height: 100vh;
		background-color: white;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx;
		box-sizing: border-box;

		.m-form {
			width: 100%;
			padding: 40rpx 0;

			.m-uni-forms {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-bottom: 22px;

				.label {
					width: 65px;
				}
			}

			.radio-group,
			.uni-list-cell,
			.form-item-date {
				flex: 1;
				display: flex;
				align-items: center;
				flex-direction: row;
				box-sizing: border-box;
				padding-left: 3px;
			}

			.form-item-date {
				.line {
					width: 50rpx;
					text-align: center;
				}

				.date {
					flex: 1;
					min-height: 34px;
					margin-left: 10rpx;
					border: 1px solid #c8c7cc;
					border-radius: 4px;
					padding: 0 10px;

					&.error {
						border-color: #dd524d;
					}

					.date-text {
						line-height: 34px;
						box-sizing: border-box;
					}
				}
			}

		}

		.submitBtn {
			margin-top: 60rpx;
		}
		.roomImg{
			width: 690rpx;
			height: 320rpx;
		}
	}
</style>
