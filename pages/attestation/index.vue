<template>
	<view class="attestation">
		<text class="title">
			认证码
		</text>
		<view class="input-group">
			<u-input v-model="code" type="number" placeholder="请输入..."/>
		</view>
		<text class="tips">
			认证是为了保证用户的真实性，目前仅提供微信人工认
			证服务。
		</text>
		<view class="service">添加客服微信获取<text class="red">认证码</text></view>
		<image class="ewm" src="/static/img/mv.jpg"></image>
		<m-button class="submitBtn" circle type="warning" @click.native="submit">确定</m-button>
	</view>
</template>

<script>
	import mButton from "@/components/button/button.vue"
	export default{
		components:{
			mButton,
		},
		data(){
			return {
				code:""
			}
		},
		methods:{
			submit(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.attestation{
		box-sizing: border-box;
		padding: 50rpx;
		width: 100vw;
		min-height: 100vh;
		background-color: white;
	}
	.title{
		color: #333333;
		font-size: 34rpx;
		
	}
	.input-group{
		padding: 0rpx 20rpx 0 30rpx;
		background-color: #ededed;
		border-radius: 40rpx;
		margin-top: 30rpx;
		margin-bottom: 20rpx;
	}
	.tips{
		font-size: 28rpx;
		color: #999999;
		padding-bottom: 50rpx;
		border-bottom: 1rpx solid #DDDDDD;
		display: block;
	}
	.service{
		padding: 40rpx 0;
		font-size: 32rpx;
		font-weight: 400;
		color: #333333;
		.red{
			color: #FF6191;
		}
	}
	.submitBtn{
		position: fixed;
		bottom: 30rpx;
		width: 650rpx;
		left: 50rpx;
	}
	.ewm{
		width: 450rpx;
		height: 450rpx;
		display: block;
		margin: 30rpx auto 0;
	}
</style>
