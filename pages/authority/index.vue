<template>
	<view class="content" style="min-height: 100vh;">
		<view v-for="(item, index) in data" :key="index">
			<view v-if="item.type == 'switch'" class="uni-list-cell solid-b">
				<view class="uni-list-cell-db">{{item.rightsname}}</view>
				<switch @change="changeState($event, item)" :checked="item.val" color="#edd0b2" style="transform:scale(0.7)" />
			</view>
			<view class="tag-group" v-else-if="item.type == 'input'">
				<text class="tag-label">{{item.rightsname}}</text>
				<view class="right-item" @click="inputPopshow(item)">
					<text class="tag-text">{{item.val}}</text>
					<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
				</view>
			</view>
			<view class="uni-list-cell" v-else-if="item.type == 'pop'">
				<view class="uni-list-cell-left tag-text">
					{{item.rightsname}}
				</view>
				<view class="uni-list-cell-db uni-list-cell-switch">
					<picker @change="bindPickerChange($event, item)" :value="item.val" :range="item.data">
						<view class="uni-input">
							<text class="text-switch tag-text">{{item.data[item.val]}}</text>
							<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="btn-group">
			<m-button class="btn" circle type="warning" @click.native="save">保存</m-button>
		</view>
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog mode="input" inputType="number" :title="title" :value="value" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		get_user_authority,
		update_user_authority
	} from "@/common/http.nvue.api.js"
	import mButton from "@/components/button/button.vue"
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopupDialog,
			mButton
		},
		data() {
			return {
				current:{},
				data: [],
				userid: 0,
				height: 18,
				title: '',
				value: ''
			}
		},
		onLoad(options) {
			this.userid = options.userid
			this.getUserAuthority()
		},
		computed: {
			...mapGetters([
				"userInfo"
			])
		},
		methods: {
			getUserAuthority() {
				get_user_authority({
					userid: this.userid
				}).then(res => {
					if (res.code == 0) {
						let data = res.data || []

						for (let i = 0; i < data.length; i++) {
							if (data[i].rights == 'rights1' || data[i].rights == 'rights2' || data[i].rights == 'rights3' || data[i].rights ==
								'rights6' || data[i].rights == 'rights8') {
								data[i].type = 'switch'
								if (data[i].rights == 'rights1' || data[i].rights == 'rights2' || data[i].rights == 'rights3') {
									data[i].val = data[i].actualval == -1 ? true : false
								} else {
									data[i].val = data[i].actualval == 1 ? true : false
								}
							} else if (data[i].rights == 'rights5' || data[i].rights == 'rights7') {
								data[i].type = 'pop'
								if (data[i].rights == 'rights5') {
									data[i].data = ['关闭', '本省', '全国'],
										data[i].val = data[i].actualval == -1 ? 2 : data[i].actualval
								} else if (data[i].rights == 'rights7') {
									data[i].data = ['1', '2', '3', '4', '5', '6'],
										data[i].val = data[i].actualval - 1
								}

							} else if (data[i].rights == 'rights4') {
								data[i].type = 'input'
								data[i].val = data[i].actualval
							}
						}
						this.data = res.data
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
			changeState(e, item) {
				let val = e.target.value
				item.val = val
				if (item.rights == 'rights1' || item.rights == 'rights2' || item.rights == 'rights3') {
					item.actualval = val ? -1 : 1
				} else {
					item.actualval = val ? 1 : 0
				}
			},
			bindPickerChange(e, item) {
				let val = e.detail.value
				item.val = val
				if (item.rights == 'rights5') {
					item.actualval = val == 2 ? -1 : val
				} else if (item.rights == 'rights7') {
					item.actualval = val + 1
				}
			},
			inputPopshow(item) {
				this.title = item.rightsname
				this.value = item.val
				this.current = item
				this.$refs.popupDialog.open()
			},
			dialogConfirm(done,value) {
				if(value.trim() !== ''){
					this.current.actualval = value
					this.current.val = value
				}
				done()
			},
			save(){
				uni.showLoading({
					title:"保存中..."
				})
				let data = this.data.map(item=>{
					return {
						actualval: Number(item.actualval), 
						rights:item.rights,
						useval:item.useval,
						rightsname:item.rightsname
					}
				})
				update_user_authority({
					userid:this.userid,
					data:data
				}).then(res=>{
					uni.hideLoading()
					if(res.code == 0){
						uni.navigateBack({
							delta:1
						})
					} else {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.log(err, 'eeee')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20px;
		background-color: white;
	}

	.uni-list-cell {
		width: 100%;
		height: 110rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #F6F6F6;
	}

	.tag-group {
		height: 110rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #F6F6F6;
		width: 100%;

		.right-item {
			flex: 1;
			text-align: right;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
		}

		.tag-text {
			text-align: right;
			color: #999999;
		}
	}

	.uni-list-cell-switch {
		width: 500rpx;
		text-align: right;
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

	/deep/ .uni-switch-input {
		margin-right: 0rpx !important;
	}
</style>
