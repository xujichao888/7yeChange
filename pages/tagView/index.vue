<template>
	<view class="tag-content">
		<uni-nav-bar rightBtn background-color="rgb(248, 248, 248)" status-bar :border="false" @clickLeft="back">
			<uni-icons slot="left" type="arrowleft" size="30" />
			<view class="uni-navbar__header-container-inner">
				<text class="nav-text">设置标签</text>
			</view>
			<text slot="right" class="save-btn" :class="{'disabled':disabled}" @click="save">保存</text>
		</uni-nav-bar>
		<view class="select-tag-wrap">
			<text class="tag-text active" :class="{check:item.check}" 
			@click="select(item, index)" v-for="(item, index) in tagsCopy" :key="item.tagid">
			{{item.tagname}} {{item.check ? 'x' : ''}}</text>
			<view class="input-group">
				<input :focus="focus" ref="tagInput" maxlength="17" v-model="tagval" class="uni-input" placeholder="添加标签" />
			</view>
		</view>
		<view class="tag-wrap">
			<text class="tips">所有标签</text>
			<view class="tag-group">
				<text class="tag-text" :class="{'active':tagsSelect.includes(item.id)}" @click="changeSelect(item)" v-for="item in tagList" :key="item.id">{{item.tagname}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get_tag,
		add_tag,
		adit_user_tag
	} from "@/common/http.nvue.api.js"
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import uniNavBar from '@/components/nav-bar/uni-nav-bar/uni-nav-bar.vue'
	export default{
		components:{
			uniNavBar
		},
		data(){
			return{
				tagval:"",
				userid:0,
				tagList:[],
				tagsSelect:[],
				tagsCopy:[],
				focus:false
			}
		},
		computed:{
			...mapGetters([
				'currentUserTag'
			]),
			disabled(){
				if(this.tagval) return false
				
				let cids = this.tagsCopy.map(item=>item.tagid)
				let oids = this.currentUserTag.map(item=>item.tagid)
				
				if(JSON.stringify(cids) == JSON.stringify(oids)) return true
				return false
			}
		},
		onLoad(options) {
			this.userid = options.userid
			this.tagsCopy = JSON.parse(JSON.stringify(this.currentUserTag))
			this.tagsCopy = this.tagsCopy.map(item=>{
				return {
					...item,
					check:false
				}
			})
			this.tagsSelect = this.tagsCopy.map(item=>item.tagid)
			if(!this.currentUserTag.length){
				this.focus = true
			}
			this.getTag()
		},
		methods:{
			...mapMutations([
				'setUserTags'
			]),
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			save(){
				uni.showLoading({
					title:"标签保存中..."
				})
				if(this.tagval.trim() !== ''){
					this.addTag()
					return
				}
				this.etidUserTag()
			},
			addTag(){
				add_tag({
					id:0,
					tagname:this.tagval.trim()
				}).then(res=>{
					if(res.code == 0){
						this.etidUserTag(res.data)
					} else {
						uni.hideLoading()
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.log(err)
				})
			},
			etidUserTag(tag){
				if(tag){
					this.tagsCopy.push({tagid:tag.id,tagname:tag.tagname})
				}
				this.setUserTags(this.tagsCopy)
				let tagid = this.currentUserTag.map(item=>item.tagid)
				adit_user_tag({
					tagid,
					userid: Number(this.userid) 
				}).then(res=>{
					uni.hideLoading()
					if(res.code == 0){
						this.tagval = ""
						uni.$emit('updateTag', tag || '')
						uni.navigateBack({
							delta:1
						})
					} else {
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}).catch(err=>{
					uni.hideLoading()
					console.log(err, 'err')
				})
			},
			getTag(){
				get_tag().then(res=>{
					if(res.code ==0){
						this.tagList = res.data || []
						console.log(this.tagList , 'this.tagList ')
					}else{
						uni.showToast({
							title:res.msg
						})
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			select(item, index){
				if(!item.check){
					item.check = true
					return
				}
				this.tagsCopy.splice(index,1)
				this.tagsSelect.splice(index,1)
			},
			changeSelect(data){
				if(this.tagsSelect.includes(data.id)){
					let index = this.tagsSelect.findIndex(item=>item == data.id)
					this.tagsSelect.splice(index,1)
					this.tagsCopy.splice(index,1)
				} else {
					this.tagsCopy.push({
						tagid:data.id,
						tagname:data.tagname,
						check:false
					})
					this.tagsSelect.push(data.id)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.save-btn{
		width: 200rpx;
		height: 58rpx;
		background-color: #e1b893;
		color: white;
		text-align: center;
		line-height: 58rpx;
		font-size: 30rpx;
		border-radius: 10rpx;
		&.disabled{
			background-color: #EEEEEE;
		}
	}
	.tag-wrap{
		padding: 20rpx 30rpx;
	}
	.tips{
		font-size: 26rpx;
		color: #999999;
	}
	.tag-text{
		font-size: 28rpx;
		padding: 0 10rpx;
		color: #333333;
		border-radius: 20px;
		border: 1rpx solid #cccccc;
		margin-bottom: 20rpx;
		margin-right: 20rpx;
		&.active{
			border-color: #deb38d;
			color: #deb38d;
		}
		&.check{
			background-color: #deb38d;
			color: white;
		}
	}
	.tag-group{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		padding-top: 20rpx;
	}
	.select-tag-wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		margin: 10rpx 30rpx 0;
		padding-top: 20rpx;
		border-bottom: 1rpx solid #ecebeb;
		border-top: 1rpx solid #ecebeb;
	}
	.input-group{
		border: 1rpx dashed #ecebeb;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}
	.uni-input{
		flex: 1;
		font-size: 28rpx;
		padding: 5rpx;
		width: auto;
		text-align: center;
		width: 200rpx;
	}
</style>
