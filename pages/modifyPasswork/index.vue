<template>
	<view class="password-content">
		<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item prop="code" label-width="0">
				<u-input :password-icon="true" type="password" v-model="form.code" placeholder="请输入旧密码"></u-input>
			</u-form-item>
			<u-form-item prop="password" label-width="0">
				<u-input :password-icon="true" type="password" v-model="form.password" placeholder="请输入新密码"></u-input>
			</u-form-item>
			<u-form-item label-width="0" prop="rePassword">
				<u-input type="password" v-model="form.rePassword" placeholder="请再次输入新密码"></u-input>
			</u-form-item>
		</u-form>
		<m-button class="submitBtn" circle type="warning" @click.native="submit">保存</m-button>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import mButton from "@/components/button/button.vue"
	export default {
		components: {
			"m-button": mButton,
		},
		data() {
			return {
				errorType: ['toast'],
				form: {
					password: '',
					rePassword: '',
					code:''
				},
				rules: {
					code: [{
							required: true,
							message: '请输入旧密码',
							trigger: ['change', 'blur'],
						}
					],
					password: [{
							required: true,
							message: '请输入新密码',
							trigger: ['change', 'blur'],
						},
						{
							// 正则不能含有两边的引号
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
							message: '需同时含有字母和数字，长度在6-12之间',
							trigger: ['change', 'blur'],
						}
					],
					rePassword: [{
							required: true,
							message: '请再次输入新密码',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.form.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change', 'blur'],
						}
					],
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		methods: {
			submit() {
				console.log(this.userInfo, 'ooo')
				let that = this
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$u.api.operationpassword({
							phone :this.userInfo.phone,
							code :this.form.code,
							passWord: this.form.password,
							userName:this.userInfo.phone,
						}).then(res=>{
							uni.hideLoading()
							uni.showToast({
								icon: 'success',
								title: '密码修改成功！',
								duration: 2000
							});
							setTimeout(() => {
								uni.navigateBack({
									delta:1
								})
							}, 2000)
						}).catch(err=>{
							uni.hideLoading()
							uni.showToast({
								title:err.msg,
								icon:'none'
							})
						})
						
					} else {
						console.log('验证失败');
					}
				});
			},
		}
	}
</script>
<style>
	page{
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.password-content {
		padding: 20rpx 80rpx;
		.submitBtn {
			margin-top: 50px;
		}
	}
</style>
