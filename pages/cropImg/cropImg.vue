<template>
	<view class="mask-content" v-if="cropUsers.id">
		<!-- <view class="mask-img-group">
			<view class="mask-img-item" v-for="item in cropUsers.images" :key="item.id" v-if="item.image">
				<image mode="aspectFill" class="mask-img" :src="item.image" @click="cropHandle(item.image)"></image>
			</view>
		</view> -->
		<crop-img avatarSrc="" :footer="false" class="avatar-cut" selWidth="300rpx" selHeight="550rpx" @upload="uploadImg" inner stretch="x" @changeTitle="changeTitle">
		</crop-img>
		<m-crop @changeTitle="changeTitle" @saveHndle="saveShow" style="position: absolute;left: -750rpx; top: -2000rpx;"></m-crop>
	</view>
</template>

<script>
	import cropImg from "@/components/img-cropping/cropping.vue"
	import mCrop from "@/components/crop/crop.vue"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			cropImg,
			mCrop
		},
		data() {
			return {
				data: [],
				currentWebview:null,
				titleType:1
			}
		},
		computed: {
			...mapGetters([
				"cropUsers"
			])
		},
		watch:{
			titleType(val){
				let title = "图片加载中..."
				if(val == 2){
					title = "裁切照片"
					this.saveShow()
				} else if(val == 3){
					title = "添加马赛克"
					this.saveShow()
				}
				uni.setNavigationBarTitle({
					title
				})
			}
		},
		onNavigationBarButtonTap(ev) {
			if(ev.index == 0){
				this.setCropUser({})
				uni.navigateBack({
				    delta: 1
				});
			} else {
				if(this.titleType == 2){
					uni.$emit("saveAvatar")
					this.currentWebview.setTitleNViewButtonStyle(1, {
						width: '0'
					});
				} else {
					uni.$emit("saveCrop")
				}
			}
		},
		onLoad(options) {
			uni.showLoading({
				title:"图片加载中..."
			})
			uni.$on('cutResult', this.setRect)
			let pages = getCurrentPages()
			let page = pages[pages.length - 1];
			this.currentWebview = page.$getAppWebview();
			this.currentWebview.setTitleNViewButtonStyle(1, {
				width: '0'
			});
			this.$nextTick(()=>{
				this.cropHandle(options.img)
			})
		},
		onUnload() {
			uni.$off('cutResult', this.setRect)
		},
		methods: {
			...mapMutations([
				"setCropUser"
			]),
			cropHandle(img) {
				setTimeout(()=>{
					uni.$emit("cropUserPhoto", img)
				},500)
				
			},
			uploadImg(data) {
				uni.$emit("moscPhoto", data.path)
			},
			setRect({
				res,
				res2,
				index
			}) {
				let user = {...this.cropUsers, res, res2}
				this.setCropUser(user)
				uni.$emit("publishAddUser", [user])
				uni.navigateBack({
				    delta: 2
				});
			},
			saveShow(){
				this.currentWebview.setTitleNViewButtonStyle(1, {
					width: '60'
				});
			},
			changeTitle(type){
				this.titleType = type
			}
		}

	}
</script>

<style scoped>
	.mask-content {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50px;
		padding-bottom: 20px;
		justify-content: center;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}

	.mask-nav {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 690rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.mask-title {
		color: #555555;
		flex: 1;
	}

	.mask-img-item {
		width: 211rpx;
		height: 211rpx;
		margin-left: 30rpx;
		margin-top: 30rpx;
		background-color: #CCCCCC;
	}

	.mask-img {
		width: 211rpx;
		height: 211rpx;

	}

	.mask-img-group {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.avatar-cut {
		position: absolute;
		left: -9999px;
		top: -9999px;
	}
</style>
