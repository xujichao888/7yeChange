<template>
	<view class="uni-popup-share">
		<view class="uni-share-title">
			<view class="close">
				<uni-icons color="#000000" type="closeempty" size="20" @click="close"></uni-icons>
			</view>
			<view class="title">
				<view class="money-group">
					<text style="padding-bottom: 10rpx;">￥ </text>
					<text class="money-text">{{data.money}}</text>
				</view>
				<text class="money-count">{{data.count}}个钻石</text>
			</view>
		</view>
		<view class="uni-share-content">
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in list" :key="item.id">
					<view class="label">
						<image class="icon" :src="item.icon"></image>
						<text>{{item.name}}</text>
					</view>
					
					<radio :value="item.id" :checked="item.id === provider" /> 
				</label>
			</radio-group>
		</view>
		<view class="uni-share-button-box">
			<m-button class="submitBtn" circle type="warning" @click.native="next">确认支付</m-button>
		</view>
	</view>
</template>

<script>
	import mButton from "@/components/button/button.vue"
	export default {
		components: {
			mButton
		},
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: '分享到'
			},
			data: {
				type: Object,
				default: () => ({})
			},
			platform:{
				type:String
			}
		},
		inject: ['popup'],
		data() {
			return {
				provider: 'wxpay',
				list: [{
						id: 'wxpay',
						name: '微信支付',
						icon:"/static/vip/wx.png"
					},
					{
						id: 'alipay',
						name: '支付宝支付',
						icon:"/static/vip/zfb.png"
					}
				]
			}
		},
		created() {
		},
		methods: {
			/**
			 * 选择内容
			 */
			next(item, index) {
				this.$emit('select', {
					provider: this.provider
				}, () => {
					this.popup.close()
				})
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
			},
			radioChange(evt) {
				this.provider = evt.target.value
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup-share {
		background-color: #fff;
		border-top-right-radius: 30rpx;
		border-top-left-radius: 30rpx;

		.zs {
			width: 45rpx;
			height: 39rpx;
		}
	}

	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		
		position: relative;
		.close {
			position: absolute;
			left: 30rpx;
			top: 30rpx;
			width: 100rpx;
			height: 100rpx;
		}
		.title{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 70rpx 0;
			.money-group{
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				font-size: 38rpx;
				color: #333333;
				padding-bottom: 10rpx;
				.money-text{
					font-size: 62rpx;
					font-weight: bold;
				}
			}
			.money-count{
				font-size: 24rpx;
				color: #999999;
			}
		}
	}

	.uni-share-title-text {
		font-size: 18px;
		color: #000000;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 10px 0;
		box-sizing: border-box;
		width: 690rpx;
		margin: 0 auto;
		flex-wrap: wrap;
		border-top: 1rpx solid #efecec;
		.prop-item {
			width: 210rpx;
			margin: 0 15rpx 15rpx 15rpx;
			background-color: #f7f7f7;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 20rpx;

			&.active {
				background-color: #eac9aa;
			}

			.num {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-bottom: 5rpx;

				.num-text {
					font-size: 16px;
					color: #000000;
					font-weight: bold;
				}
			}

			.money {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}

	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		width: 360px;
	}

	.uni-share-content-item {
		width: 90px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 10px 0;
		align-items: center;
	}

	.uni-share-content-item:active {
		background-color: #f5f5f5;
	}

	.uni-share-image {
		width: 30px;
		height: 30px;
	}

	.uni-share-text {
		margin-top: 10px;
		font-size: 14px;
		color: #3B4144;
	}

	.uni-share-button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 10px 15px;
	}

	.uni-share-button {
		flex: 1;
		border-radius: 50px;
		color: #666;
		font-size: 16px;
	}

	.uni-share-button::after {
		border-radius: 50px;
	}

	.submitBtn {
		width: 690rpx;
		margin: 20rpx auto;
	}

	.input-group {
		width: 690rpx;
		background-color: #f7f7f7;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
		margin: 0rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.uni-list-cell {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 690rpx;
		.label{
			display: flex;
			flex-direction: row;
			align-items: center;
			text{
				font-size: 30rpx;
				padding-left: 30rpx;
			}
			padding: 30rpx 0;
		}
		.icon{
			width: 52rpx;
			height: 52rpx;
		}
	}
</style>
