<template>
	<view class="uni-popup-share" :style="{'transform':'translateY('+height+'px)','padding-bottom':height+'px'}">
		<view class="uni-share-title">
			<view class="left">
				<text>剩余</text>
				<image class="zs" src="/static/vip/zuanshi@3x.png"></image>
				<text>{{diamond}}</text>
			</view>
			<text class="uni-share-title-text">{{title}}</text>
		</view>
		<view class="uni-share-content">
			
			<view class="prop-item" @click="current = item.id" :class="{active: current == item.id}" v-for="item in data"
			 :key="item.id">
			 <text class="num-text">{{item.name}}</text>
				<view class="num">
					<image class="zs" src="/static/vip/zuanshi@3x.png"></image>
					<text class="money">{{item.recharge}}</text>
				</view>
			</view>
		</view>
		<!-- <view class="input-group" v-if="platform == 'android'">
			<u-input type="number" v-model="money" height="80" placeholder="其他金额" />
		</view> -->
		<view class="uni-share-button-box">
			<m-button class="submitBtn" circle :type="current == 0 && !money ? 'defaule' : 'warning'" @click.native="next">立即开通</m-button>
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
				type: Array,
				default: () => ([])
			},
			platform: {
				type: String
			},
			diamond:{
				type: String | Number,
				default: 0
			}
		},
		inject: ['popup'],
		data() {
			return {
				money: '',
				current: 0,
				height: 38
			}
		},
		mounted() {
			let that = this;
			that.height = uni.getSystemInfoSync().safeAreaInsets.bottom;
		},
		methods: {
			/**
			 * 选择内容
			 */
			next(item, index) {
				if (this.current == 0) {
					return
				}
				this.$emit('select', {
					money: this.data.find(item => item.id == this.current).recharge,
					current: this.current
				}, () => {
					this.popup.close()
				})
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
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
		height: 60px;
		position: relative;

		.left {
			position: absolute;
			left: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 26rpx;
			color: #999999;
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
		padding: 10px 15rpx 0;
		flex-wrap: wrap;

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
	}
</style>
