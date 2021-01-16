<template>
	<view class="main" :style="{minHeight:minHeight + 'rpx'}">
		<text v-if="label" class="label"  :style="{width:labelWidth + 'rpx','font-size':fontSize+'rpx'}">{{label}}</text>
		<view class="content" :style="{'justify-content':multiple && (value[0] != 0 || value[0][0] != 0) ? 'flex-start' : 'flex-end'}">
			<view class="item" :class="{multipleItem:multiple && (value[0] != 0 || value[0][0] != 0)}" v-for="item in labels"
			 :key="item.value">
				{{item.label}}
				<view v-if="multiple && (value[0] != 0 || value[0][0] != 0)" class="close" @click="remove(item.value)">
					<u-icon name="close" color="#ffffff" size="12" inactive-color="#000000"></u-icon>
				</view>
			</view>
		</view>
		<view class="icon-group" :style="{width:multiple ? '100rpx' : '300rpx'}" @click="show = true">
			<slot name="arrow">
				<text class="arrow-text">{{currentLabel}}</text>
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</slot>
		</view>
		<u-select v-model="show" :mask-close-able="false" :mode="mode" safe-area-inset-bottom :list="list" :default-value="value"
		 @confirm="confirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			};
		},
		props: {
			mode: {
				type: String,
				default: "single-column"
			},
			fontSize:{
				type: Number,
				default: 30
			},
			type: {
				type: String,
				required: true
			},
			multiple: {
				type: Boolean,
				default: false,
			},
			label: {
				type: String,
				default: ""
			},
			labelWidth: {
				type: Number,
				default: 100
			},
			minHeight: {
				type: Number,
				default: 90
			},
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			value: {
				type: Array,
				default: () => {
					return []
				}
			},
			data: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		computed: {
			labels() {
				let res = []
				if(this.mode == "mutil-column-auto"){
					for (let i = 0; i < this.data.length; i++) {
						let obj = {}
						let p = this.list[this.data[i][0]]
						let c = p.children[this.data[i][1]]
						obj.label = p.label + c.label
						obj.value = p.value + '-' + c.value
						res.push(obj)
					}
				} else {
					for(let i=0; i<this.data.length; i++){
						let obj = this.list.find((item, index)=>index == this.data[i])
						if(obj){
							res.push(obj)
						}
					}
				}
				return res
			},
			currentLabel() {
				if (this.multiple) {
					if (this.data.length) {
						return "添加"
					}
					if(this.type == 'serviceGroup'){
						return '添加'
					}
					return "不限"
				} else {
					if (this.mode == 'mutil-column') {
						let fast = this.list[0][this.value[0]]
						let last = this.list[1][this.value[1]]
						if (fast.value == -1) {
							return "不限"
						}
						let fast_label = fast.label
						let last_lab = last.label


						if (last != undefined && Number(last.value) < Number(fast.value)) {
							
							let _fast = fast.label
							let _last = last.label
							fast_label = _last
							last_lab = _fast
						}
						return fast_label + (last_lab ? (fast_label ? `-${last_lab}` : last_lab) : '')
					}
					return this.list[this.value[0]].label
				}
			}
		},
		methods: {
			confirm(val) {
				this.$emit("confirm", {
					val,
					type: this.type,
					mode: this.mode
				})
			},
			remove(val) {
				this.$emit("remove", {
					type: this.type,
					val,
					mode: this.mode
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #F6F6F6;

		.label {
			font-size: 30rpx;
			color: #333333;
		}

		.content {
			padding-left: 10rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: flex-start;
			flex: 1;

			.item {
				font-size: 26rpx;
				color: #999999;
			}

			.multipleItem {
				margin-right: 5px;
				background-color: #EFD3B6;
				border-radius: 22px;
				padding: 3px 16px 5px 16px;
				margin-top: 10rpx;
				position: relative;
				color: #555555;
				.close {
					position: absolute;
					right: -2px;
					top: -5px;
					z-index: 2;
					width: 14px;
					height: 14px;
					// border: 1px solid #e1e1e1;
					background-color: #000000!important;
					text-align: center;
					border-radius: 50%;
					background: white;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.icon-group {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			width: 200rpx;

			.arrow-text {
				color: #999999;
			}
		}
	}
</style>
