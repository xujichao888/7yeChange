<template>
	<view class="cell-wrap">
		<u-cell-group class="u-cell-group">
			<u-cell-item title="修改密码" @click="toJumpPage('modifyPasswork')">
				
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default{
		methods:{
			toJumpPage(page) {
				uni.navigateTo({
					url: `/pages/${page}/index`
				})
			}
		}
	}
</script>

<style>
</style>
