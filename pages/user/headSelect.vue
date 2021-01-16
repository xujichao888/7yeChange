<template>
	<view style="padding-top: 48upx;min-height: 100vh;background-color: #fff;">
		<view class="container">
			<view v-if="sex==1" class="items" @click="current=index" v-for="(item,index) in man_list" :key="index" :class="[{'mr':!((index+1)%4===0)},{'bor':current===index}]">
				<image :src="item.path" style="width: 100%;height: 100%;"></image>
			</view>
			<view v-if="sex==0" class="items" @click="current=index" v-for="(item,index) in w_list" :key="index" :class="[{'mr':!((index+1)%4===0)},{'bor':current===index}]">
				<image :src="item.path" style="width: 100%;height: 100%;"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get_avatar
	} from "@/common/http.nvue.api.js"
	export default{
		data(){
			return {
				sex:0,
				current:-1,
				man_list:[],
				w_list:[]
			}
		},
		onLoad(options) {
			this.sex = options.sex
			this.getAvatar()
		},
		onNavigationBarButtonTap(e) {
			if(this.current == -1){
				uni.showToast({
					title:"请选择头像",
					icon:"none"
				})
				return
			}
			let list = []
			if(this.sex == 0){
				list = this.w_list
			} else if(this.sex == 1){
				list = this.man_list
			}
			let avatar = list[this.current]
			uni.$emit('uploadAvatar', avatar)
			uni.navigateBack({
				delta:1
			})		
		},
		methods:{
			getAvatar(){
				uni.showLoading({
					title:"加载中..."
				})
				get_avatar({
					sex:this.sex + ''
				}).then(res=>{
					uni.hideLoading()
					if(res.code == 0){
						let data = res.data || []
						data = data.map(item=>{
							return {
								id:item,
								path:item
							}
						})
						if (this.sex == 1) this.man_list = data
						else this.w_list = data
					} else {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.log(err)
				})
			}
			
		}
	}
</script>

<style scoped>
	
	.container{
		width: calc(750upx - 96upx);
		margin: 0 48upx;
		/* background-color: #fff; */
		display: flex;
		flex-wrap: wrap;
	}
	.mr{
		margin-right: 2upx;
	}
	.items{
		width: 162upx;height: 182upx;box-sizing: border-box;border: 2upx solid rgba(0,0,0,0);background-color: #FEF8F3;
		margin-bottom: 2upx;
		padding-top: 20upx;
	}
	.bor{
		border: 2upx solid #11CD86;
	}
</style>
