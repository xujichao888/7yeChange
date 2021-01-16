<template>
	<view class="">
		<icon class="delete" @click="remove(item)" type="clear" size="22" style="position: absolute;right: -10rpx; top: -10rpx; z-index: 2;" />
		<canvas canvas-id="original" id="original" style="width: 300px;height: 300px;"></canvas>
		<canvas canvas-id="original2" id="original2" style="width: 300px;height: 300px;"></canvas>
		<button type="default" @click="upload">上传</button>
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser';
	const testHtml = require('./html.js');
	export default {
		components:{
			jyfParser
		},
		data() {
			return {
				imgUrl:'',
				html:`<div>你好<a href="/pages/me/me">点我</a><div>`
			}
		},
		mounted() {
			let sysInfo = uni.getSystemInfoSync();
			this.contextOriginal = uni.createCanvasContext('original')
			this.contextOriginal2 = uni.createCanvasContext('original2')
		},
		methods: {
			upload(){
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original'],
					success: (res) => {
						this.cut(res.tempFilePaths[0])
					},
				})
			},
			cut(url){
				let _this = this
				uni.getImageInfo({
					src: url,
					success: (res) => {
						this.contextOriginal.drawImage(res.path, 0, 0, 300, 300)
						console.log(this.contextOriginal, 'this.contextOriginal')
						this.$nextTick(() => {
							this.contextOriginal.draw()
							setTimeout(()=>{
								uni.canvasGetImageData({
								  canvasId: 'original',
								  x: 0,
								  y: 0,
								  width: 300,
								  height: 300,
								  success(res) {
									_this.putImg(res)  
								  },
								  fail(err) {
								  	console.log(err, '获取图片资源失败')
								  }
								})
							},3000)
						})
					}
				});
			},
			putImg(res){
				this.contextOriginal2.clearRect(0, 0, 300, 300);
				uni.canvasPutImageData({
					canvasId: 'original2',
					x: 0,
					y: 0,
					width: 300,
					data: Uint8ClampedArray.from(res.data),
					success() {
						console.log('cussess')
					},
					fail(err) {
						console.log(err, '填充图片失败')
					}
				})
			}
		}
	}
</script>

<style scoped>
	.keyboard-btn{
		position: fixed;
		z-index: 999;
		left: 0;
		bottom: 0;
		
	}
	.delete{
		background-color: red;
		border-radius: 50%;
	}
</style>
