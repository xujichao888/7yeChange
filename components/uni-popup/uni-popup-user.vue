<template>
	<view class="uni-popup-share" :style="{'transform':'translateY('+height+'px)','padding-bottom':height+'px'}">
		<view class="uni-share-title">
			<image class="icon-btn" src="/static/icons/index/comments@3x.png"></image>
			<text class="uni-share-title-text">{{title}}</text>
		</view>
		<view class="uni-share-content">
			<view class="uni-share-content-box">
				<view class="uni-share-content-item" v-for="(item,id) in message_list" :key="id" @click.stop="select(id)">
					<view class="user-info-wrap">
						<image class="avatar" :src="item.userInfo.avatar"></image>
						<view class="user-info">
							<text>{{item.userInfo.nickname}}</text>
							<text class="text-id">ID: {{item.userInfo.userid}}</text>
						</view>
					</view>
					<icon v-if="popusers.includes(id)" type="success" size="26"/>
				</view>
			</view>
		</view>
		<!-- <view class="uni-share-button-box">
			<m-button class="submitBtn" circle type="default" @click.native="close">取消</m-button>
		</view> -->
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import mButton from "@/components/button/button.vue"
	export default {
		name: 'UniPopupShare',
		components:{
			mButton
		},
		props: {
			title: {
				type: String,
				default: '转发'
			},
			popusers:{
				type: Array,
				default: () => {
					return []
				}
			}
		},
		inject: ['popup'],
		computed:{
			...mapGetters([
				'message_list'
			])
		},
		data() {
			return {
				height:38
			}
		},
		created() {
			console.log(this.message_list, 'mmm')

		},
		mounted() {
			let that = this;
			that.height = uni.getSystemInfoSync().safeAreaInsets.bottom;
		},
		methods: {
			/**
			 * 选择内容
			 */
			select(id) {
				this.$emit('select',id)
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
		background-color: #F6F6F6;
		padding-bottom: 2px;
	}
	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
		background-color: white;
		margin-bottom: 2px;
		padding: 0 10px;
		justify-content: space-between;
	}
	.uni-share-title-text {
		font-size: 14px;
		color: #666;
	}
	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
	}
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		width: 360px;
		background-color: #F6F6F6;
	}
	
	.uni-share-content-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: white;
		padding: 5px 10px;
		margin: 2px 0;
		justify-content: space-between;
	}
	.user-info-wrap{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
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
	.submitBtn{
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		width: 100%;
	}
	.avatar{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}
	.uni-share-content-box{
		display: flex;
		flex-direction: column;
	}
	.user-info{
		display: flex;
		flex-direction: column;
		padding: 2px;
		margin-left: 5px;
	}
	.text-id{
		color: #999999;
		font-size: 26rpx;
	}
	.icon-btn {
		width: 40rpx;
		height: 38rpx;
	}
	.check{
		width: 50rpx;
		height: 50rpx;
	}
</style>
