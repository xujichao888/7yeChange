<template>
	<view class="filter-image">
		<u-toast ref="uToast" />
		<u-icon :name="icon" @click="getImage"></u-icon>
		<u-mask :show="show">
			<view class="uni-content-info" v-if="isShowImg">
				<view class='cropper-content'>
					<view class="uni-corpper" :style="'width:'+cropperInitW+'px;height:'+cropperInitH+'px;background:rgba(0,0,0,.5);'">
						<view class="uni-corpper-content" :style="'width:'+cropperW+'px;height:'+cropperH+'px;left:'+cropperL+'px;top:'+cropperT+'px'">
							<image :src="imageSrc" :style="'width:'+cropperW+'px;height:'+cropperH+'px'"></image>
							<view class="uni-corpper-crop-box" @touchstart.stop.prevent="contentStartMove" @touchmove.stop.prevent="contentMoveing"
							 @touchend.stop.prevent="contentTouchEnd" :style="'left:'+cutL+'px;top:'+cutT+'px;right:'+cutR+'px;bottom:'+cutB+'px'">
								<view class="uni-cropper-view-box">
									<view class="uni-cropper-dashed-h"></view>
									<view class="uni-cropper-dashed-v"></view>
									<view class="uni-cropper-line-t" data-drag="top" @touchstart.stop.prevent="dragStart" @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-line-r" data-drag="right" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-line-b" data-drag="bottom" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-line-l" data-drag="left" @touchstart.stop.prevent="dragStart" @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-point point-t" data-drag="top" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-point point-tr" data-drag="topTight"></view>
									<view class="uni-cropper-point point-r" data-drag="right" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-point point-rb" data-drag="rightBottom" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-point point-b" data-drag="bottom" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove" @touchend.stop.prevent="dragEnd"></view>
									<view class="uni-cropper-point point-bl" data-drag="bottomLeft"></view>
									<view class="uni-cropper-point point-l" data-drag="left" @touchstart.stop.prevent="dragStart"
									 @touchmove.stop.prevent="dragMove"></view>
									<view class="uni-cropper-point point-lt" data-drag="leftTop"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class='cropper-config'>
					<!-- <button type="primary reverse" @click="getImage" style='margin-top: 30rpx;'> 选择图片 </button> -->
					<m-button class="submitBtn" circle type="warning" @click.native="cut">裁切图片</m-button>
				</view>
				<canvas canvas-id="myCanvas" :style="'position:absolute;border: 1px solid red; width:'+imageW+'px;height:'+imageH+'px;top:-9999px;left:-9999px;'"></canvas>
			</view>
			<view class="modal-content">
				<!-- <u-icon name="close-circle" size="50" color="#999999" class="modal-close" @click="closeMask"></u-icon> -->
				<view class="modal-body" style="display: flex; flex-direction: column; align-items: center;">
					<view class="canvas-group" style="position: relative;margin: 0px" :style="{width: width + 'px', height: height + 'px'}">
						<canvas canvas-id="original2" id="original2" :style="{width: width + 'px', height: height + 'px'}"></canvas>
						<canvas canvas-id="target" id="target" :style="{width: width + 'px', height: height + 'px'}"></canvas>
						<canvas canvas-id="original" id="original" :style="{width: width + 'px', height: height + 'px'}"></canvas>
						<canvas @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" :style="{width: width + 'px', height: height + 'px'}"
						 canvas-id="canvas" id="canvas"></canvas>
					</view>
					<!-- <view class="btns-wrap">
						<scroll-view scroll-x="true">
							<view class="btns-group">
								<view id="demo1" class="btns-item" @click="invertColor">底片</view>
								<view id="demo2" class="btns-item" @click="adjustColor">灰色</view>
								<view id="demo3" class="btns-item" @click="deleColor">黑白</view>
								<view id="demo1" class="btns-item" @click="aloneColor">单色</view>
								<view id="demo2" class="btns-item" @click="blurImage">模糊</view>
								<view id="demo3" class="btns-item" @click="chinaImage">水墨</view>
								<view id="demo1" class="btns-item" @click="embossImage">熔铸</view>
								<view class="btns-item" @click="restImg">重置</view>
								<view class="btns-item" @click="closeMask">取消</view>
							</view>
						</scroll-view>
					</view> -->
				</view>
				<view class="footer-wrap">
					<button type="default" @click="restImg">重置</button>
				</view>
				<!-- <view class="modal-footer">
					<m-button class="submitBtn" circle type="warning" @click.native="save">保存</m-button>
				</view> -->
			</view>
		</u-mask>
	</view>
</template>

<script>
	let NUM = 5; //一次操作包含马赛克的个数
	const device = uni.getSystemInfoSync();
	let sysInfo = uni.getSystemInfoSync();
	let SCREEN_WIDTH = sysInfo.screenWidth
	let SCREEN_HEIGHT= sysInfo.screenHeight - 200
	let PAGE_X, // 手按下的x位置
		PAGE_Y, // 手按下y的位置 
		PR = sysInfo.pixelRatio, // dpi
		T_PAGE_X, // 手移动的时候x的位置
		T_PAGE_Y, // 手移动的时候Y的位置
		CUT_L, // 初始化拖拽元素的left值
		CUT_T, // 初始化拖拽元素的top值
		CUT_R, // 初始化拖拽元素的
		CUT_B, // 初始化拖拽元素的
		CUT_W, // 初始化拖拽元素的宽度
		CUT_H, //  初始化拖拽元素的高度
		IMG_RATIO, // 图片比例
		IMG_REAL_W, // 图片实际的宽度
		IMG_REAL_H, // 图片实际的高度
		DRAFG_MOVE_RATIO = 1, //移动时候的比例,
		INIT_DRAG_POSITION = 100, // 初始化屏幕宽度和裁剪区域的宽度之差，用于设置初始化裁剪的宽度
		DRAW_IMAGE_W = sysInfo.screenWidth // 设置生成的图片宽度
	import mButton from "@/components/button/button.vue"
	import {compressImage} from "@/utils/param.js"
	export default {
		components: {
			"m-button": mButton,
		},
		props: {
			icon: {
				type: String,
				default: "plus"
			}
		},
		data() {
			return {
				loading:false,
				imgH:0,
				img_radio:1,
				img_width:0,
				img_height:0,
				lastImgArr: [],
				index: null,
				imageSrc: '',
				isShowImg: false,
				// 初始化的宽高
				cropperInitW: SCREEN_WIDTH,
				cropperInitH: SCREEN_WIDTH,
				// 动态的宽高
				cropperW: SCREEN_WIDTH,
				cropperH: SCREEN_WIDTH,
				// 动态的left top值
				cropperL: 0,
				cropperT: 0,
				transL: 0,
				transT: 0,
				// 图片缩放值
				scaleP: 0,
				imageW: 0,
				imageH: 0,
				// 裁剪框 宽高
				cutL: 0,
				cutT: 0,
				cutB: SCREEN_WIDTH,
				cutR: '100%',
				qualityWidth: DRAW_IMAGE_W,
				innerAspectRadio: DRAFG_MOVE_RATIO,

				drawRatio: 1,
				context: null,
				contextOriginal: null,
				imgUrl: '',
				show: false,
				width: '200',
				height: '200',
				systemInfo: null,
				points: [],
				clickX1: 0,
				clickY1: 0,
				clickX2: 0,
				clickY2: 0,
				size: 5,
				canvasL: 0,
				canvasT: 0
			}
		},
		mounted() {
			uni.$on('crop', this.getImage)
			uni.$on("closeCrop", this.closeMask)
			uni.$on("saveCrop", this.save)
			uni.$on("moscPhoto", this.moscPhoto)
			this.systemInfo = uni.getSystemInfoSync()
			this.context = uni.createCanvasContext('canvas')
			this.contextOriginal = uni.createCanvasContext('original')
			this.target = uni.createCanvasContext('target')
			this.original2 = uni.createCanvasContext('original2')
		},
		beforeDestroy() {
			uni.$off('crop', this.getImage)
			uni.$off("closeCrop", this.closeMask)
			uni.$off("saveCrop", this.save)
			uni.$off("moscPhoto", this.moscPhoto)
		},
		methods: {
			setData: function(obj) {
				let that = this;
				Object.keys(obj).forEach(function(key) {
					that.$set(that.$data, key, obj[key])
				});
			},
			async moscPhoto(img){
				let path = img
				let result = await uni.compressImage({
					src: img,
					quality: 30,
				})
				this.$emit("changeTitle", 3)
				if (result[1].errMsg == "compressImage:ok") {
					path = result[1].tempFilePath
				} else {
					uni.showToast({
						title: "图片格式错误",
						icon: "none"
					})
					return
				}
				this.show = true
				this.cut(path)
			},
			getImage: function(index) {
				console.log(index)
				if (index != undefined || index != null) {
					this.index = index
				}
				let _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original'],
					success: async (res) => {
						this.$emit("changeTitle", 3)
						console.log(res, '上传的图片信息')
						
						let path = await this.compressImageHandler(res.tempFilePaths[0])
						
						let result = await uni.compressImage({
							src: path,
							quality: 60,
						})
						
						if (result[1].errMsg == "compressImage:ok") {
							path = result[1].tempFilePath
						} else {
							uni.showToast({
								title: "图片格式错误",
								icon: "none"
							})
							return
						}
						_this.show = true
						_this.cut(path)
					},
				})
			},
			async compressImageHandler(src){
				console.log('platform==='+device.platform)
				const tempPath = await compressImage(src,device.platform, device.brand);
				console.log('tempPath-----'+tempPath);
				return tempPath
			},
			getRect(path) {
				uni.getImageInfo({
					src: path,
					success:(res)=> {
						let imgW = res.width
						let imgH = res.height
						let img_radio = imgW / imgH
						let radio
						if(img_radio > 1){
							radio = SCREEN_WIDTH / imgW
							this.height = this.height * radio
							this.width = SCREEN_WIDTH
						} else {
							radio = SCREEN_HEIGHT / imgH
							this.width = this.width * radio
							this.height = SCREEN_HEIGHT 
							
							if(this.width > SCREEN_WIDTH){
								radio = SCREEN_WIDTH / this.width
								this.height = this.height * radio
								this.width = SCREEN_WIDTH
							}
						}
					},
					fail(err) {
						console.log(err, "图片信息获取失败")
					}
				})
			},
			loadImage: function() {
				let _this = this
				uni.showLoading({
					title: '图片加载中...',
				})

				uni.getImageInfo({
					src: _this.imageSrc,
					success: function success(res) {
						IMG_RATIO = res.width / res.height
						if (IMG_RATIO >= 1) {
							IMG_REAL_W = SCREEN_WIDTH
							IMG_REAL_H = SCREEN_WIDTH / IMG_RATIO
						} else {
							IMG_REAL_W = SCREEN_WIDTH * IMG_RATIO
							IMG_REAL_H = SCREEN_WIDTH
						}
						let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
						INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
						// 根据图片的宽高显示不同的效果   保证图片可以正常显示
						if (IMG_RATIO >= 1) {
							let cutT = Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2);
							let cutB = cutT;
							let cutL = Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2);
							let cutR = cutL;
							_this.setData({
								cropperW: SCREEN_WIDTH,
								cropperH: SCREEN_WIDTH / IMG_RATIO,
								// 初始化left right
								cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
								cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
								cutL: cutL,
								cutT: cutT,
								cutR: cutR,
								cutB: cutB,
								// 图片缩放值
								imageW: IMG_REAL_W,
								imageH: IMG_REAL_H,
								scaleP: IMG_REAL_W / SCREEN_WIDTH,
								qualityWidth: DRAW_IMAGE_W,
								innerAspectRadio: IMG_RATIO
							})
						} else {
							let cutL = Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2);
							let cutR = cutL;
							let cutT = Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2);
							let cutB = cutT;
							_this.setData({
								cropperW: SCREEN_WIDTH * IMG_RATIO,
								cropperH: SCREEN_WIDTH,
								// 初始化left right
								cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
								cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),

								cutL: cutL,
								cutT: cutT,
								cutR: cutR,
								cutB: cutB,
								// 图片缩放值
								imageW: IMG_REAL_W,
								imageH: IMG_REAL_H,
								scaleP: IMG_REAL_W / SCREEN_WIDTH,
								qualityWidth: DRAW_IMAGE_W,
								innerAspectRadio: IMG_RATIO
							})
						}
						_this.setData({
							isShowImg: true
						})
						uni.hideLoading()
					}
				})
			},
			// 拖动时候触发的touchStart事件
			contentStartMove(e) {
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},

			// 拖动时候触发的touchMove事件
			contentMoveing(e) {
				let _this = this
				let dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				let dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// 左移
				if (dragLengthX > 0) {
					if (this.cutL - dragLengthX < 0) dragLengthX = this.cutL
				} else {
					if (this.cutR + dragLengthX < 0) dragLengthX = -this.cutR
				}

				if (dragLengthY > 0) {
					if (this.cutT - dragLengthY < 0) dragLengthY = this.cutT
				} else {
					if (this.cutB + dragLengthY < 0) dragLengthY = -this.cutB
				}
				this.setData({
					cutL: this.cutL - dragLengthX,
					cutT: this.cutT - dragLengthY,
					cutR: this.cutR + dragLengthX,
					cutB: this.cutB + dragLengthY
				})

				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},

			contentTouchEnd() {

			},
			// 获取图片
			async save() {
				
				let _this = this
				uni.showLoading({
					title: '保存中...',
				});

				let mosc = await uni.canvasToTempFilePath({
					quality: 1,
					canvasId: 'original'
				});

				let mask = await uni.canvasToTempFilePath({
					quality: 1,
					canvasId: 'canvas'
				});

				let original = await uni.canvasToTempFilePath({
					quality: 1,
					canvasId: 'original2'
				});

				this.target.drawImage(mosc[1].tempFilePath, 0, 0, this.width,
					this.height)
				this.target.draw(true)

				this.target.drawImage(mask[1].tempFilePath, 0, 0, this.width,
					this.height)
				this.target.draw(true)
				setTimeout(async () => {

					let target = await uni.canvasToTempFilePath({
						quality: 1,
						canvasId: 'target'
					});

					uni.$emit('cutResult', {
						res: {
							path: target[1].tempFilePath
						},
						res2: {
							path: original[1].tempFilePath
						},
						index: _this.index
					})
					uni.hideLoading()
					this.closeMask()
				}, 500)
			},

			// 设置大小的时候触发的touchStart事件
			dragStart(e) {
				T_PAGE_X = e.touches[0].pageX
				T_PAGE_Y = e.touches[0].pageY
				CUT_L = this.cutL
				CUT_R = this.cutR
				CUT_B = this.cutB
				CUT_T = this.cutT
			},

			// 设置大小的时候触发的touchMove事件
			dragMove(e) {
				let _this = this
				let dragType = e.target.dataset.drag
				switch (dragType) {
					case 'right':
						var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_R + dragLength < 0) dragLength = -CUT_R
						this.setData({
							cutR: CUT_R + dragLength
						})
						break;
					case 'left':
						var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_L - dragLength < 0) dragLength = CUT_L
						if ((CUT_L - dragLength) > (this.cropperW - this.cutR)) dragLength = CUT_L - (this.cropperW - this.cutR)
						this.setData({
							cutL: CUT_L - dragLength
						})
						break;
					case 'top':
						var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_T - dragLength < 0) dragLength = CUT_T
						if ((CUT_T - dragLength) > (this.cropperH - this.cutB)) dragLength = CUT_T - (this.cropperH - this.cutB)
						this.setData({
							cutT: CUT_T - dragLength
						})
						break;
					case 'bottom':
						var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_B + dragLength < 0) dragLength = -CUT_B
						this.setData({
							cutB: CUT_B + dragLength
						})
						break;
					case 'rightBottom':
						var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO

						if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
						if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
						var cutB = CUT_B + dragLengthY;
						var cutR = CUT_R + dragLengthX;

						this.setData({
							cutB: cutB,
							cutR: cutR
						})
						break;
					default:
						break;
				}
			},
			touchstart({
				changedTouches
			}) {
				this.context.setLineCap('round')
				this.context.setLineJoin('round')
				this.context.setLineWidth(this.size * 6)
				this.context.globalCompositeOperation = "destination-out";


				this.clickX1 = changedTouches[0].x
				this.clickY1 = changedTouches[0].y
				this.drawLine(this.clickX1, this.clickY1);
			},
			touchmove({
				changedTouches
			}) {
				this.clickX2 = changedTouches[0].x
				this.clickY2 = changedTouches[0].y
				this.drawLine(this.clickX1, this.clickY1, this.clickX2, this.clickY2);
				this.clickX1 = this.clickX2;
				this.clickY1 = this.clickY2;
			},
			touchend() {
				this.points = [];
			},
			drawLine(x1, y1, x2, y2) {
				this.context.beginPath()
				if (x2 == undefined) {
					this.context.arc(x1, y1, this.size * 2, 0, 2 * Math.PI);
					this.context.fill();
				} else {
					this.context.moveTo(x1, y1);
					this.context.lineTo(x2, y2);
					this.context.stroke();
				}
				this.context.draw(true);
			},
			draw() {
				let point1 = this.points[0];
				let point2 = this.points[1];
				this.points.shift();
				this.context.moveTo(point1.X, point1.Y);
				this.context.lineTo(point2.X, point2.Y);
				this.context.stroke();
				this.context.draw(true);
			},
			getCanvasSize(w, h) {
				let maxW = this.systemInfo.screenWidth - 40
				let maxH = this.systemInfo.screenHeight - 200
				if (h > maxH) {
					w = maxH / h * w
					h: maxH
				}
				if (w > maxW) {
					return {
						w: maxW,
						h: maxW / w * h
					}
				}
				return {
					w,
					h
				}
			},
			closeMask() {
				this.contextOriginal.clearRect(0, 0, this.width, this.height)
				this.original2.clearRect(0, 0, this.width, this.height)
				this.context.clearRect(0, 0, this.width, this.height)
				this.target.clearRect(0, 0, this.width, this.height)
				this.context.globalCompositeOperation = "source-over";
				this.$nextTick(() => {
					setTimeout(() => {
						this.contextOriginal.draw()
						this.context.draw()
						this.original2.draw()
						this.target.draw()
						this.show = false
					}, 100)

				})
			},
			async mosaic() {

				//获取老的图片数据
				let oldImageData = await this.getImgdata('original');
				if(!oldImageData) {
					uni.showToast({
						title:"该手机不支持添加马赛克",
						icon:"none"
					})
					uni.hideLoading()
					this.$emit("saveHndle")
					return
				}
				//  创建一个跟老图片一样大的空白图片数据
				var newImageData = {
					width: oldImageData.width,
					height: oldImageData.height,
					data: Uint8ClampedArray.from(oldImageData.data)
				}

				//  设定一个马赛克矩形的值
				var size = 10;
				//  生成n个马赛克矩形开始
				for (var i = 0; i < this.width / size; i++) {
					for (var j = 0; j < this.height / size; j++) {
						//  从马赛克矩形中随机抽出一个像素点信息
						var color = this.getPxInfo(oldImageData, i * size + Math.floor(Math.random() * size), j * size + Math.floor(Math
							.random() * size));
						//  把当前马赛克矩形中的所有像素点统一成随机选出的像素点:开始
						for (var a = 0; a < size; a++) {
							for (var b = 0; b < size; b++) {
								this.setPxInfo(newImageData, i * size + a, j * size + b, color);
							}
						}
						//  把当前马赛克矩形中的所有像素点统一成随机选出的像素点：结束
					}
				}
				//  生成n个马赛克矩形结束

				//  每次写入新的imagedata，先清空画布
				this.contextOriginal.clearRect(0, 0, this.width, this.height);
				//把新的imagedata写入画布；
				this.putImgdata(newImageData.data, 'original');
				this.$emit("saveHndle")
			},
			getPxInfo(imgdata, x, y) {
				var color = [];
				var data = imgdata.data;
				var w = imgdata.width;
				var h = imgdata.height;
				color[0] = data[(y * w + x) * 4];
				color[1] = data[(y * w + x) * 4 + 1];
				color[2] = data[(y * w + x) * 4 + 2];
				color[3] = data[(y * w + x) * 4 + 3];
				return color;
			},
			//	设置某个像素点的函数
			setPxInfo(imgdata, x, y, color) {
				var data = imgdata.data;
				var w = imgdata.width;
				var h = imgdata.height;
				data[(y * w + x) * 4] = color[0];
				data[(y * w + x) * 4 + 1] = color[1];
				data[(y * w + x) * 4 + 2] = color[2];
				data[(y * w + x) * 4 + 3] = color[3];
			},
			cut(url) {
				let _this = this
				uni.getImageInfo({
					src: url,
					success: (res) => {
						let system_info = uni.getStorageSync('vuex_system_info')
						if(system_info.brand === 'samsung' && (res.orientation == 'right' || res.orientation == 'left')){
							this.img_width = res.height
							this.img_height = res.width
						} else {
							this.img_width = res.width
							this.img_height = res.height
						}
						
						this.img_radio = SCREEN_WIDTH / this.img_width
						this.width = SCREEN_WIDTH
						
						this.height = this.img_height * this.img_radio > SCREEN_HEIGHT ? SCREEN_HEIGHT : this.img_height * this.img_radio
						
						if(this.img_width >= this.img_height){
							this.imgH = this.img_height
						} else {
							if(this.img_height * this.img_radio > SCREEN_HEIGHT){
								this.imgH = this.img_height * (SCREEN_HEIGHT / this.img_height / this.img_radio)
							} else{
								this.imgH = this.img_height
							}
						}

						this.imgUrl = res.path
						this.$nextTick(() => {
							uni.showLoading({
								title: "图片处理中..."
							})
							this.show = true
							this.isShowImg = false
							setTimeout(() => {
								this.drawImgHandle()
							}, 300)
						})
					}
				});
			},
			restImg() {
				this.context.globalCompositeOperation = "source-over";
				this.context.clearRect(0, 0, this.width, this.height)
				this.context.drawImage(this.imgUrl, 0, 0, this.img_width, this.imgH, 0, 0, this.width , this.height)
				this.context.draw()
			},
			drawImgHandle() {
				
				this.contextOriginal.drawImage(this.imgUrl, 0, 0, this.img_width, this.imgH, 0, 0, this.width, this.height)
				this.context.drawImage(this.imgUrl, 0, 0, this.img_width, this.imgH, 0, 0, this.width , this.height)
				this.original2.drawImage(this.imgUrl, 0, 0, this.img_width, this.imgH, 0, 0, this.width, this.height)
				this.$nextTick(() => {
					this.contextOriginal.draw()
					this.context.draw()
					this.original2.draw()
					setTimeout(() => {
						//this.blurImage()
						this.mosaic()
					}, 300)
				})
			},
			async getImgdata(canvasId) {
				let result = await uni.canvasGetImageData({
					canvasId: canvasId,
					x: 0,
					y: 0,
					width: this.width,
					height: this.height,
				})
				return result[1]
			},
			putImgdata(data, canvasId) {
				uni.canvasPutImageData({
					canvasId: canvasId,
					x: 0,
					y: 0,
					width: this.width,
					data,
					complete() {
						uni.hideLoading()
					}
				})
			},
			gaussBlur(imgData, radius, sigma) {
				var pixes = imgData.data,
					width = imgData.width,
					height = imgData.height;

				radius = radius || 5;
				sigma = sigma || radius / 3;

				var gaussEdge = radius * 2 + 1; // 高斯矩阵的边长

				var gaussMatrix = [],
					gaussSum = 0,
					a = 1 / (2 * sigma * sigma * Math.PI),
					b = -a * Math.PI;

				for (var i = -radius; i <= radius; i++) {
					for (var j = -radius; j <= radius; j++) {
						var gxy = a * Math.exp((i * i + j * j) * b);
						gaussMatrix.push(gxy);
						gaussSum += gxy; // 得到高斯矩阵的和，用来归一化
					}
				}
				var gaussNum = (radius + 1) * (radius + 1);
				for (var i = 0; i < gaussNum; i++) {
					gaussMatrix[i] = gaussMatrix[i] / gaussSum; // 除gaussSum是归一化
				}

				//console.log(gaussMatrix);

				// 循环计算整个图像每个像素高斯处理之后的值
				for (var x = 0; x < width; x++) {
					for (var y = 0; y < height; y++) {
						var r = 0,
							g = 0,
							b = 0;

						//console.log(1);

						// 计算每个点的高斯处理之后的值
						for (var i = -radius; i <= radius; i++) {
							// 处理边缘
							var m = this.handleEdge(i, x, width);
							for (var j = -radius; j <= radius; j++) {
								// 处理边缘
								var mm = this.handleEdge(j, y, height);

								var currentPixId = (mm * width + m) * 4;

								var jj = j + radius;
								var ii = i + radius;
								r += pixes[currentPixId] * gaussMatrix[jj * gaussEdge + ii];
								g += pixes[currentPixId + 1] * gaussMatrix[jj * gaussEdge + ii];
								b += pixes[currentPixId + 2] * gaussMatrix[jj * gaussEdge + ii];

							}
						}
						var pixId = (y * width + x) * 4;

						pixes[pixId] = ~~r;
						pixes[pixId + 1] = ~~g;
						pixes[pixId + 2] = ~~b;
					}
				}
				imgData.data = pixes;
				return imgData;
			},
			handleEdge(i, x, w) {
				var m = x + i;
				if (m < 0) {
					m = -m;
				} else if (m >= w) {
					m = w + i - x;
				}
				return m;
			},
			async invertColor() {
				let result = await this.getImgdata('original');
				let binaryData = result.data
				let l = this.width * this.height * 4;
				for (let i = 0; i < l; i += 4) {
					let r = binaryData[i];
					let g = binaryData[i + 1];
					let b = binaryData[i + 2];

					binaryData[i] = 255 - r;
					binaryData[i + 1] = 255 - g;
					binaryData[i + 2] = 255 - b;
				}
				this.putImgdata(binaryData, 'original')
			},
			async adjustColor() {
				let result = await this.getImgdata();
				let binaryData = result.data
				let l = this.width * this.height * 4;
				for (let i = 0; i < l; i += 4) {
					let r = binaryData[i];
					let g = binaryData[i + 1];
					let b = binaryData[i + 2];

					binaryData[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
					binaryData[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
					binaryData[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
				}
				this.putImgdata(binaryData)

			},
			async blurImage() {
				let result = await this.getImgdata('original');
				let binaryData = result.data

				let data = this.gaussBlur(result, 26);
				this.putImgdata(binaryData, 'original')
			},
			async deleColor() {
				let result = await this.getImgdata();
				let binaryData = result.data
				let l = this.width * this.height * 4;
				let imageData_length = binaryData.length / 4;
				for (let i = 0; i < imageData_length; i++) {
					let red = binaryData[i * 4];
					let green = binaryData[i * 4 + 1];
					let blue = binaryData[i * 4 + 2];
					let gray = 0.3 * red + 0.59 * green + 0.11 * blue;
					binaryData[i * 4] = gray;
					binaryData[i * 4 + 1] = gray;
					binaryData[i * 4 + 2] = gray;
				}
				this.putImgdata(binaryData)
			},
			async chinaImage() {
				let result = await this.getImgdata();
				let binaryData = result.data
				let l = this.width * this.height * 4;
				let imageData_length = binaryData.length / 4;
				for (let i = 0; i < imageData_length; i++) {
					let red = binaryData[i * 4];
					let green = binaryData[i * 4 + 1];
					let blue = binaryData[i * 4 + 2];
					let gray = 0.3 * red + 0.59 * green + 0.11 * blue;
					let new_black;
					if (gray > 126) {
						new_black = 255;
					} else {
						new_black = 0;
					}
					binaryData[i * 4] = new_black;
					binaryData[i * 4 + 1] = new_black;
					binaryData[i * 4 + 2] = new_black;
				}
				this.putImgdata(binaryData)
			},
			async aloneColor() {
				let result = await this.getImgdata();
				let binaryData = result.data
				let l = this.width * this.height * 4;
				let imageData_length = binaryData.length / 4;
				for (let i = 0; i < imageData_length; i++) {
					binaryData[i * 4 + 1] = 0;
					binaryData[i * 4 + 2] = 0;
				}
				this.putImgdata(binaryData)
			},
			async embossImage() {
				let result = await this.getImgdata();
				let binaryData = result.data
				let l = this.width * this.height * 4;
				let imageData_length = binaryData.length / 4;
				for (let i = 0; i < imageData_length; i++) { //遍历各像素分量
					let red = binaryData[i * 4];
					let green = binaryData[i * 4 + 1];
					let blue = binaryData[i * 4 + 2];
					binaryData[i * 4] = red * 128 / (green + blue + 1);;
					binaryData[i * 4 + 1] = green * 128 / (red + blue + 1);
					binaryData[i * 4 + 2] = blue * 128 / (green + red + 1);;
				}
				this.putImgdata(binaryData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: #000000;
		height: 100%;
		box-sizing: border-box;
		.modal-body {
			width: 100%;
			.btns-wrap {
				width: 100%;
				.btns-group {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.btns-item {
						color: #606266;
						font-size: 36rpx;
						height: 44px;
						line-height: 44px;
						width: 300rpx;
						border-radius: 50rpx;
						flex-shrink: 0;
						// margin-right: 5px;
						background: #f5f5f5;
						text-align: center;
					}
				}
			}
		}

		.modal-footer {
			padding-top: 40rpx;
			width: 100%;
		}

		.modal-close {
			position: absolute;
			right: 15px;
			top: 100rpx;
		}
	}

	#img {
		margin: 20px auto 0;
	}

	.filter-image {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* pages/uni-cropper/index.wxss */

	.uni-content-info {
		width: 100%;
		height: 100%;
		background: white;
		padding-top: 84px;
		/* position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: block;
		align-items: center;
		flex-direction: column; */
	}

	.cropper-config {
		padding: 20rpx 40rpx;
	}

	.cropper-content {
		min-height: 750rpx;
		width: 100%;
	}

	.uni-corpper {
		position: relative;
		overflow: hidden;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		box-sizing: border-box;
	}

	.uni-corpper-content {
		position: relative;
	}

	.uni-corpper-content image {
		display: block;
		width: 100%;
		min-width: 0 !important;
		max-width: none !important;
		height: 100%;
		min-height: 0 !important;
		max-height: none !important;
		image-orientation: 0deg !important;
		margin: 0 auto;
	}

	/* 移动图片效果 */

	.uni-cropper-drag-box {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		cursor: move;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}

	/* 内部的信息 */

	.uni-corpper-crop-box {
		position: absolute;
		background: rgba(255, 255, 255, 0.3);
		z-index: 2;
	}

	.uni-corpper-crop-box .uni-cropper-view-box {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		outline: 1rpx solid #69f;
		outline-color: rgba(102, 153, 255, .75)
	}

	/* 横向虚线 */

	.uni-cropper-dashed-h {
		position: absolute;
		top: 33.33333333%;
		left: 0;
		width: 100%;
		height: 33.33333333%;
		border-top: 1rpx dashed rgba(255, 255, 255, 0.5);
		border-bottom: 1rpx dashed rgba(255, 255, 255, 0.5);
	}

	/* 纵向虚线 */

	.uni-cropper-dashed-v {
		position: absolute;
		left: 33.33333333%;
		top: 0;
		width: 33.33333333%;
		height: 100%;
		border-left: 1rpx dashed rgba(255, 255, 255, 0.5);
		border-right: 1rpx dashed rgba(255, 255, 255, 0.5);
	}

	/* 四个方向的线  为了之后的拖动事件*/

	.uni-cropper-line-t {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		top: 0;
		left: 0;
		height: 1rpx;
		opacity: 0.1;
		cursor: n-resize;
	}

	.uni-cropper-line-t::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0rpx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41rpx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-r {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		right: 0rpx;
		width: 1rpx;
		opacity: 0.1;
		height: 100%;
		cursor: e-resize;
	}

	.uni-cropper-line-r::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41rpx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-b {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		bottom: 0;
		left: 0;
		height: 1rpx;
		opacity: 0.1;
		cursor: s-resize;
	}

	.uni-cropper-line-b::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0rpx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41rpx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-l {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		left: 0;
		width: 1rpx;
		opacity: 0.1;
		height: 100%;
		cursor: w-resize;
	}

	.uni-cropper-line-l::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41rpx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-point {
		width: 5rpx;
		height: 5rpx;
		background-color: #69f;
		opacity: .75;
		position: absolute;
		z-index: 3;
	}

	.point-t {
		top: -3rpx;
		left: 50%;
		margin-left: -3rpx;
		cursor: n-resize;
	}

	.point-tr {
		top: -3rpx;
		left: 100%;
		margin-left: -3rpx;
		cursor: n-resize;
	}

	.point-r {
		top: 50%;
		left: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-rb {
		left: 100%;
		top: 100%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		cursor: n-resize;
		width: 36rpx;
		height: 36rpx;
		background-color: #69f;
		position: absolute;
		z-index: 1112;
		opacity: 1;
	}

	.point-b {
		left: 50%;
		top: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-bl {
		left: 0%;
		top: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-l {
		left: 0%;
		top: 50%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-lt {
		left: 0%;
		top: 0%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	/* 裁剪框预览内容 */

	.uni-cropper-viewer {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.uni-cropper-viewer image {
		position: absolute;
		z-index: 2;
	}

	#original,
	#canvas,
	#target {
		position: absolute;
		left: 0;
		top: 0;
	}

	#original {
		z-index: 2;
	}

	#canvas {
		z-index: 3;
		left: 0;
		top: 0px;
	}

	#target {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}
	.footer-wrap{
		height: 50px;
		position: fixed !important;
		box-sizing: border-box;
		border: 1px solid #F1F1F1;
		background: #ffffff;
		width: 100%;
		left: 0;
		bottom: 0;
		z-index: 100009;
		flex-direction: row;
	}
</style>
