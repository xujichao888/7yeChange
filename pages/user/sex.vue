<template>
	<view class="user-sex">
		<view class="sex">
			<text class="title">选择您的性别</text>
		</view>
		<view class="content">
			<text class="tips">选择后无法更改</text>
			<view class="sexImg">
				<!-- <image @click="setSex(1)" src="/static/img/nan.png"></image>
				<image @click="setSex(0)" src="/static/img/nv.png"></image> -->
				<view class="item" :class="{active:sex === 1}" @click="setSex(1)">
					男士
				</view>
				<view class="item" :class="{active:sex === 0}" @click="setSex(0)">
					女士
				</view>
			</view>
		</view>
		<uni-popup ref="popupsex" type="bottom" :maskClick="false">
			<view class="pop-content" :style="{'transform': platform == 'ios' ? 'translateY('+height+'px)' : '0','padding-bottom': platform == 'ios' ? height+'px' : '50rpx'}">
				<text class="title">性别选择后无法更改</text>
				<m-button class="submitBtn" circle type="default" @click.native="cancel">取消</m-button>
				<m-button class="submitBtn" circle type="warning" @click.native="next">确定</m-button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import mButton from "@/components/button/button.vue"
	export default {
		components: {
			mButton
		},
		data() {
			return {
				sex: -1,
				height: 0,
				platform:''
			}
		},
		onLoad() {},
		mounted() {
			let that = this;
			this.platform = uni.getSystemInfoSync().platform
			if(this.platform == 'ios'){
				that.height = uni.getSystemInfoSync().safeAreaInsets.bottom;
			}
			//that.height = uni.getSystemInfoSync().safeAreaInsets.bottom;
			
		},
		methods: {
			setSex(sex) {
				this.sex = sex
				this.$u.vuex('vuex_user', {
					sex
				})
				this.$refs.popupsex.open()
			},
			cancel() {
				this.$refs.popupsex.close()
				this.sex = -1
			},
			next() {
				if (this.sex == -1) {
					uni.showToast({
						title: "请选择性别",
						icon: "none"
					})
					return
				}
				this.$refs.popupsex.close()
				this.$nextTick(() => {
					this.reLaunch("/pages/user/nickName")
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: white;
	}

	.user-sex {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url("/static/sex/nv.png") no-repeat left center, url("/static/sex/nan.png") no-repeat right center;
		background-size: 266rpx auto, 200rpx auto;
		margin-top: 44px;

		.sex {
			font-size: 40rpx;
			color: #333333;
			text-align: center;
		}

		.content {
			padding: 10px 20px 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.tips {
				color: #999999;
				text-align: center;
			}

			.sexImg {
				margin-top: 50px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				image {
					width: 200rpx;
					height: 200rpx;
					margin: 0 40rpx;
				}

				.item {
					width: 220rpx;
					height: 220rpx;
					background-color: #CCCCCC;
					font-size: 44rpx;
					color: #333333;
					margin-top: 100rpx;
					border-radius: 50%;
					margin-top: 100rpx;
					line-height: 220rpx;
					text-align: center;

					&.active {
						background-color: #deb58a;
					}
				}
			}
		}

		.pop-content {
			width: 100%;
			height: 100%;
			background-color: white;
			padding: 20rpx 200rpx 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.title {
				font-size: 30rpx;
				padding: 15rpx 0;
			}

			.submitBtn {
				margin-top: 30rpx;
				width: 100%;
			}
		}
	}
</style>
