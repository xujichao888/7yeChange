<template>
	<div>
		<button class="m-button" :type="type" :class="{circle:circle}" :hover-class="hoverClass" :style="btnstyle">
			<slot></slot>
		</button>
	</div>
	
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: "default",
			},
			circle: {
				type: Boolean,
				default: false
			},
			btnstyle:{
				type:Object,
				default:() => ({})
			}
		},
		computed: {
			hoverClass() {
				return this.type + "-hover-calss"
			}
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.m-button {
		height: 44px;
		line-height: 44px;
		background-color: #ffffff;
		border: 0 !important;
		background: #fafafa;
		color: #606266;
		&::after{
			border: 0;
		}
		&.circle{
			border-radius: 50rpx;
		}
	}
	.m-button[type=warning]{
		background: #edd0b2;
		&.warning-hover-calss{
			background: #deb58a;
		}
	}
	.m-button[type=default]{
		background: #EEEEEE;
		&.default-hover-calss{
			background: #d9d9d9;
		}
	}
</style>
