<template>
	<view class="filter-content">
		<view class="addTime">
			<text>注册时间</text>
			<view class="m-uni-forms">
				<view class="form-item-date">
					<view class="date-start date" @click="pickerShow('start')">
						<text class="date-text">{{beginregtime || '开始时间'}}</text>
					</view>
				</view>
			</view>
			<view class="m-uni-forms">
				<view class="form-item-date">
					<view class="date-end date" @click="pickerShow('end')">
						<text class="date-text">{{endregtime || '结束时间'}}</text>
					</view>
				</view>
			</view>
		</view>
		<m-select label="年龄" type="age" :list="age" mode="mutil-column" @confirm="confirmHandle" :value="ageVal">
		</m-select>
		<m-select label="身高" type="height" :list="height" mode="mutil-column" @confirm="confirmHandle" :value="heightVal">
		</m-select>
		<m-select label="体重" type="weight" :list="weight" mode="mutil-column" @confirm="confirmHandle" :value="weightVal">
		</m-select>
		<m-select v-if="userInfo.type > 0 || isShowCity" class="multiple-select" :labelWidth="120" label="常驻城市" mode="mutil-column-auto"
		 type="province" multiple :data="provinceData" :list="province" @confirm="confirmHandle" @remove="removehandle"
		 :value="provinceVal">
		</m-select>
		<!-- <view class="tag-group" v-else-if="selfCity">
			<text class="tag-label">常驻城市</text>
			<text class="tag-text">{{userInfo.citystr}}</text>
			<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
		</view> -->
		<m-select label="情感情况" type="feel" :labelWidth="120" :list="feel" @confirm="confirmHandle" :value="feelVal">
		</m-select>
		<!-- <view class="like-wrap">
			<text>兴趣爱好</text>
			<view class="like-group">
				<view class="like-item" :class="{active:item.check}" v-for="item in like" :key="item.id" @click="changeLike(item)">
					{{item.label}}
				</view>
			</view>
		</view> -->
		<view class="btn-group">
			<m-button class="btn" circle type="warning" @click.native="save">确定</m-button>
		</view>
		<w-picker :visible.sync="visible" mode="date" :value="startDate" :disabled-after="disabledAfter" fields="second"
		 @confirm="onConfirm" ref="date"></w-picker>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		age,
		height,
		weight,
		feel
	} from "@/common/filter.js"
	import {
		getNowDate
	} from '@/utils/param.js'
	import wPicker from "@/components/w-picker/w-picker.vue";
	import province from "@/common/province.js"
	import mSelect from '@/components/m-select/select.vue'
	import mButton from "@/components/button/button.vue"
	import {
		get_like_data,
		get_user_authority
	} from "@/common/http.nvue.api.js"

	export default {
		components: {
			mSelect,
			mButton,
			wPicker
		},
		data() {
			return {
				selfCity: false,
				isShowCity: false,
				timeType: "",
				endregtime: "",
				beginregtime: "",
				visible: false,
				startDate: getNowDate(true),
				disabledAfter: false,
				show: true,
				age: age,
				ageVal: [0, 0],
				height: height,
				heightVal: [0, 0],
				weight: weight,
				weightVal: [0, 0],
				province: province,
				provinceVal: [0, 0],
				provinceData: [],
				feel: feel,
				feelVal: [0],
				feelLabel: "不限",
				like: []
			}
		},
		computed: {
			...mapGetters([
				"userInfo"
			]),
		},
		onLoad() {
			if(this.userInfo.type == 0) this.getUserAuthority()
		},
		methods: {
			getUserAuthority() {
				get_user_authority({
					userid: this.userInfo.id
				}).then(res => {
					if (res.code == 0) {
						if (!res.data.length) {
							return
						}
						let rights5 = res.data.find(item => item.rights == 'rights5')
						if (!rights5 || rights5.actualval == 0) {
							return
						}
						if (rights5.actualval == 2) {
							this.isShowCity = true
							return
						}
						if (!this.userInfo.city.length || this.userInfo.city[0] == '0') {
							return
						}
						if (rights5.actualval == 1) {
							let p = this.province.filter(item => item.value == -1 || item.value == this.userInfo.city[0].substring(0, 2))
							p[1].children = p[1].children.filter(item => item.value == this.userInfo.city[0])
							this.province = p
							this.isShowCity = true
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
			getLikeData() {
				get_like_data().then(res => {
					if (res.code == 0) {
						this.like = res.data.map(item => {
							return {
								id: item.id,
								label: item.hobby,
								check: false
							}
						})
						this.like.unshift({
							id: 0,
							label: "不限",
							check: true
						})
					} else {
						uni.showToast({
							title: res.msg
						})
					}
				}).catch(err => {
					console.error(err)
				})
			},
			pickerShow(type) {
				this.timeType = type
				this.disabledAfter = false
				if (type = "start") {
					if (this.endregtime == '') this.startDate = getNowDate(true)
					else {
						let stime = (new Date(this.beginregtime)).getTime()
						let etime = (new Date(this.endregtime)).getTime()
						if (stime > etime) {
							this.endregtime = this.beginregtime
							this.disabledAfter = true
						}
					}
				} else {
					if (this.beginregtime == '') this.startDate = getNowDate(true)
				}
				this.visible = true
			},
			onConfirm(ev) {
				if (this.timeType == 'start') {
					this.beginregtime = ev.value
					if (this.endregtime) {
						let stime = (new Date(this.beginregtime)).getTime()
						let etime = (new Date(this.endregtime)).getTime()
						if (stime > etime) {
							this.beginregtime = this.endregtime
						}
					}

				} else {
					this.endregtime = ev.value
					if (this.beginregtime) {
						let stime = (new Date(this.beginregtime)).getTime()
						let etime = (new Date(this.endregtime)).getTime()
						if (stime > etime) {
							this.endregtime = this.beginregtime
						}
					}
				}
			},
			confirmHandle(data) {
				let type = data.type
				let index
				if (data.mode == 'mutil-column-auto') {
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
					this[type + 'Val'] = [index]
				}
			},
			removehandle({
				val,
				type
			}) {
				let p = val.split('-')[0]
				let c = val.split('-')[1]
				let parent = this[type].find(item => item.value == p)
				let index = this[type].findIndex(item => item.value == p)
				let lastIndex = parent.children.findIndex(item => item.value == c)
				let _index = this[type + "Data"].findIndex(item => item[0] == index && item[1] == lastIndex)
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
				let param = this.getParam()
				uni.switchTab({
					url: '/pages/index/index',
					success() {
						uni.$emit('updatePageIndex', param)
					}
				});
			},
			getParam() {
				let resAge = this.sort(this.ageVal[0], this.ageVal[1], 'age')
				let beginage = resAge.start
				let endage = resAge.end
				let resHeight = this.sort(this.heightVal[0], this.heightVal[1], 'height')
				let beginheight = resHeight.start
				let endheight = resHeight.end
				let resWeight = this.sort(this.weightVal[0], this.weightVal[1], 'weight')
				let beginweight = resWeight.start
				let endweight = resWeight.end
				let emotion = this.feelVal[0] == 0 ? "" : this.feel[this.feelVal[0]].label
				let hoobyid = this.like.filter(item => item.check && item.id != 0)
				hoobyid = hoobyid.map(item => item.id)
				let city = this.getCityCode(this.provinceData)

				return {
					endregtime: this.endregtime,
					beginregtime: this.beginregtime,
					beginage,
					endage,
					beginheight,
					endheight,
					beginweight,
					endweight,
					emotion,
					hoobyid: hoobyid.join(","),
					city: city
				}
			},
			getCityCode(arr) {
				if (!arr.length) {
					return ''
				}
				let res = []
				for (let i = 0; i < arr.length; i++) {
					let p = this.province[arr[i][0]]
					let c = p.children[arr[i][1]]
					res.push(c.value)
				}
				return res.join(",")
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
						background: #EFD3B6;
						color: #555555;
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

			position: absolute;
			bottom: 20px;
			left: 20px;
			right: 20px;
		}

		.addTime {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 90rpx;
			border-bottom: 1px solid #F6F6F6;
		}

		.date-text {
			color: #999999;
		}

		.tag-group {
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #F6F6F6;
		}

		.tag-label {
			width: 150rpx;
		}

		.tag-text {
			width: 500rpx;
			text-align: right;
			font-size: 28rpx;
			color: #999999;
			lines: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			/* #ifndef APP-PLUS */
			white-space: nowrap;
			/* #endif */
			/* #ifdef APP-PLUS */
			text-overflow: ellipsis;
			/* #endif */
		}
	}
</style>
