<template>
	<view class="mobile-content">
		<view class="key-input">
			<view class="title">请输入手机号</view>
			<u-form :model="form" ref="uForm" :errorType="errorType">
				<u-form-item prop="mobile" label-width="0">
					<view class="input-group">
						<u-input type="number" v-model="form.mobile" height="80" placeholder="请输入手机号码" />
					</view>
				</u-form-item>
			</u-form>
			<m-button class="submitBtn" type="warning" circle @click.native="submit">下一步</m-button>
		</view>
	</view>
</template>

<script>
	import mButton from "@/components/button/button.vue"
	export default {
		components:{
			"m-button": mButton,
		},
		data() {
			return {
				errorType: ['toast'],
				form: {
					mobile: '',
				},
				rules: {
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
				}
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
						    title: '发送中...'
						});
						this.$u.api.getCode({
							phone :this.form.mobile
						}).then(res=>{
							uni.hideLoading()
							this.navigateTo("/pages/login/code", {
								mobile: this.form.mobile,
								from:"mobile"
							})
						}).catch(err=>{
							uni.hideLoading()
							console.error(err)
						})
					} else {
						console.log('验证失败');
					}
				});
			},
		}
	};
</script>
<style>
	page{
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.mobile-content {
		padding: 120rpx 80rpx;
		.submitBtn {
			margin-top: 50rpx;
		}
		.input-group {
			width: 100%;
			padding: 0 10px;
			background-color: #f5f5f5;
			border-radius: 60rpx;
		}
	}
</style>
