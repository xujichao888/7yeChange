<template>
	<uni-transition :mode-class="['fade']" :styles="maskClass" :show="show">
		<view class="content">
			<text class="tips colorw">{{title}}</text>
			<text class="colorw" v-if="progress">{{percent}}%</text>
			<!-- <u-line-progress :striped="true" :percent="percent" :striped-active="true"></u-line-progress> -->
		</view>
	</uni-transition>
</template>

<script>
	import uniTransition from "@/components/uni-transition/uni-transition.vue"
	export default{
		uniTransition,
		props:{
			show:{
				type:Boolean,
				default:false
			},
			percent:{
				type:Number,
				default:0
			},
			title:{
				type:String,
				default:"上传中..."
			},
			progress:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
				maskClass: {
					'position': 'fixed',
					'bottom': 0,
					'top': 0,
					'left': 0,
					'right': 0,
					'background-color': 'rgba(0, 0, 0, 0)',
					'justify-content':'center',
					'align-items':'center',
					'display':'flex',
					'z-index':'99999'
				}
			}
		},
		methods:{
			uploadEnd(){
				this.$emit('uploadEnd')
			}
		}
	}
</script>

<style scoped>
	.content{
		width: 140px;
		height: 110px;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,.7);
	}
	.colorw{
		color: white;
		font-size: 34rpx;
	}
	.icon{
		width: 30px;
		height: 30px;
	}
</style>
