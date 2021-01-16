<template>
	<view class="uni-popup-select">
		<view class="title">
			<text class="cancel" @click="cancel">取消</text>
			<text class="define" @click="selectChange">确定</text>
		</view>
		<view class="uni-list" v-if="data.length">
			<checkbox-group @change="checkboxChange" class="checkbox-group">
				<label class="uni-list-cell uni-list-cell-pd" v-for="item in data" :key="item.id">
					<view class="item">
						<checkbox :value="item.id" :checked="item.checked" />
						<view class="text">{{item.tagname}}</view>
					</view>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopupMessage',
		props: {
			data: {
				type: Array,
				default: () => {
					return []
				}
			},
			val: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				sval:[]
			}
		},
		created() {
			
		},
		methods: {
			checkboxChange: function(e) {
				this.sval = e.detail.value
			},
			selectChange(e){
				this.$emit("selectChange", this.sval)
			},
			cancel(){
				this.$emit("cancel")
			}
		}
	}
</script>
<style scoped>
	.uni-popup-select {
		display: flex;
		flex-direction: column;
		background-color: white;
		padding-left: 15px;
		padding-right: 15px;
		padding-bottom: 10px;
	}
	.checkbox-group{
		flex: 1;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.uni-list{
		padding-bottom: 20px;
	}
	.uni-list-cell {
		flex: 1;
		justify-content: flex-start
	}
	.item{
		flex: 1;
		border-top-color: #cccccc;
		border-top-width: 1rpx;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding-top: 12px;
		padding-bottom: 12px;
	}
	.text{
		color: #333333;
	}
	.title{
		height: 45px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.define{
		font-size: 17px;
		color: #007AFF;
	}
	.cancel{
		font-size: 17px;
		color: #888888;
		lines:1;
		text-align: right;
		overflow: hidden;
		text-overflow:ellipsis;  
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-PLUS */
		text-overflow:ellipsis;
		/* #endif */
	}
</style>
