<template>
	<view class="container">
		<view class="jump" :style="{'top':statusBarHeight+'px'}" @click="jump">跳过</view>
		<swiper @change='change'  :indicator-dots="false" :autoplay="false" :current="current" :interval="3000" :indicator-active-color="indicatorActiveColor" :duration="300" style="width: 100%;height: 100%;" :indicator-color="indicatorColor">
			<swiper-item style="width: 100%;height: 100%;position: relative;">
				<view class="swiper-item bg" style="width: 100%;height: 100%;">
					<image src="../../static/guide/one.png" mode="widthFix" style="width: 80%;"></image>
				</view>
			</swiper-item>
			<swiper-item style="width: 100%;height: 100%;position: relative;">
				<view class="swiper-item bg" style="width: 100%;height: 100%;">
					<image src="../../static/guide/three.png" mode="widthFix" style="width: 80%;"></image>
				</view>
				<!-- <view class="go" @click="go">立即开启</view> -->
			</swiper-item>
			<swiper-item style="width: 100%;height: 100%;position: relative;">
				<view class="swiper-item bg" style="width: 100%;height: 100%;">
					<image src="../../static/guide/two.png" mode="widthFix" style="width: 80%;"></image>
				</view>
			</swiper-item>
			<swiper-item style="width: 100%;height: 100%;position: relative;opacity: 1;">
				<view class="swiper-item bg" style="width: 100%;height: 100%;background-color: #000;background-image: none;">
					<!-- <image src="../../static/guide/two.png" mode="widthFix" style="width: 80%;"></image> -->
				</view>
			</swiper-item>
		</swiper>
		<view style="position: fixed;width: 750upx;height: 180upx;bottom: 0;left: 0;z-index: 9999;display: flex;justify-content: center;align-items: center;">
			<view v-for="(item,index) in 3" :key="index" style="width: 16upx;height: 16upx;border-radius: 100px;background-color: rgba(255,255,255,.5);margin: 0 14upx;" :style="{'background-color':current===index?'#fff':'rgba(255,255,255,.5)'}"></view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				indicatorColor:'rgba(255,255,255,.4)',
				indicatorActiveColor:'rgba(255,255,255,1)',
				bg:'../../static/guide/one.png',
				statusBarHeight:0,
				current:0
			}
		},
		onLoad() {
			
		},
		created() {
			let that = this;
			uni.getSystemInfo({
				success(data) {
					that.statusBarHeight = data.statusBarHeight;
				}
			})
		},
		destroyed() {
			console.log('卸载');
			uni.setStorageSync('one_login',1);
		},
		mounted() {
			// uni.removeStorageSync('one_login')
		},
		methods:{
			change(e){
				if(e.detail.current>2){
					this.$emit('guideHide')
				}
				this.current = e.detail.current;
				
			},
			jump(){
				this.$emit('guideHide')
			},
			go(){
				uni.reLaunch({
					url:"/pages/login/login"
				})
			}
		}
	}
</script>

<style scoped>
	.go{
		width: 400upx;
		height: 90upx;
		border-radius: 1000px;
		background-image: linear-gradient(to right,#bf8a55,#e99a4c);
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 175upx;
		bottom: 20upx;
		color: #fff;
		z-index: 999;
	}
	.jump{
		position: fixed;
		top: 40upx;
		right:20upx;
		padding: 14upx 40upx;
		border: 1upx solid #fff;
		z-index: 99;
		color: #fff;
		border-radius: 1000px;
	}
	.container{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: #000;
	}
	.bg{
		background-image: url(../../static/guide/bg.png);
		background-color: #000000;
		background-size: 100% auto;
		background-position: 100% 0;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
	}

</style>
