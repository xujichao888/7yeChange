<template>
	<view class="password-content">
		<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item prop="password" label-width="0">
				<u-input :password-icon="true" type="password" v-model="form.password" placeholder="请输入密码"></u-input>
			</u-form-item>
			<u-form-item label-width="0" prop="rePassword">
				<u-input type="password" v-model="form.rePassword" placeholder="请确认密码"></u-input>
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
				isCreate:0,
				phone:'',
				code:'',
				errorType: ['toast'],
				form: {
					password: '',
					rePassword: '',
				},
				rules: {
					password: [{
							required: true,
							message: '请输入密码',
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
							message: '请再次输入密码',
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
		onLoad(option) {
			this.phone = option.phone
			this.code = option.code
			this.isCreate = option.isCreate
		},
		methods: {
			...mapMutations([
				"setPassword"
			]),
			submit() {
				let that = this
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if(this.isCreate == 1){
							this.setPassword(this.form.password)
							this.reLaunch("/pages/user/sex")
							return
						}
						this.$u.api.operationpassword({
							phone :this.phone,
							code :this.code,
							passWord: this.form.password,
							userName:this.phone,
						}).then(res=>{
							this.$u.vuex('vuex_token', {})
							this.$u.vuex('vuex_user', {})
							uni.hideLoading()
							uni.showToast({
								icon: 'success',
								title: '密码修改成功！',
								duration: 2000
							});
							setTimeout(() => {
								that.reLaunch("/pages/login/login")
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
		padding: 120rpx 80rpx;

		.submitBtn {
			margin-top: 50px;
		}
	}
</style>
