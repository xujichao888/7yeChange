import Vue from 'vue'
import Vuex from 'vuex'
import {
	Sqlite
} from "@/sqlite/index.js"
import {
	sqlName,
	sqlPath,
	sqlTable,
	userTab
} from "@/sqlite/config.js"
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token', 'vuex_system_info', 'service_message'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}

//const message_list = uni.getStorageSync('message_list')
const users = uni.getStorageSync('users')
const agora_token = uni.getStorageSync('agora_token')


const store = new Vuex.Store({
	state: {
		userMsg:null,//客户端的信息
		userTokenMsg:null, //用户的token
		tokenTime:0, //刷新token的时间戳
		roomOnlineNum:0,//在线人数
		seats:255,//座位
		talkOnePeerRenderArr:{},//单聊列表渲染
		rtmModel:null,//rtm实例
		manyTalkRenderArr:[],//群聊渲染数组
		oneTalkRenderArr:[],//单聊页面渲染数组
		rpxExchangePxs:0,
		talkNowUserId:-1,//用户正在聊天的人
		isJoinChannelNum:-1,//
		
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : {},
		vuex_system_info: lifeData.vuex_system_info ? lifeData.vuex_system_info : {},
		message_list: {},
		users: users ? users : {},
		currentUser: {},
		agora_token: agora_token ? agora_token : '',
		sqlite: new Sqlite(sqlName, sqlPath, sqlTable, userTab),
		badge: {},
		clientInfo: {},
		txIm: uni.requireNativePlugin("uniplugin_rtc_RtcModule"),
		txImisLogin: false,
		targrtUsers: {},
		sendMess:[],
		prevPage:'/pages/index/index',
		isUpdateUser:false,
		network:true,
		cropUser:{},
		serviceId:0,
		service:{},
		loginType:'phone',
		password:'',
		invitationBadge:0,
		isChoose:false,
		isExit:false,
		chatViewTabbarState:false,
		userTag:[],

		// 自定义tabbar数据
		vuex_tabbar: [{
				iconPath: "/static/tabbar/index.png",
				selectedIconPath: "/static/tabbar/index_select.png",
				text: '推荐',
				pagePath: '/pages/index/index'
			},
			{
				iconPath: "/static/tabbar/party.png",
				selectedIconPath: "/static/tabbar/party_select.png",
				text: '派对',
				pagePath: '/pages/party/party'
			},
			{
				iconPath: "/static/tabbar/message.png",
				selectedIconPath: "/static/tabbar/message_select.png",
				text: '消息',
				pagePath: '/pages/message/message'
			},
			{
				iconPath: "/static/tabbar/me.png",
				selectedIconPath: "/static/tabbar/me_select.png",
				text: '我的',
				pagePath: '/pages/me/me'
			}
		]
	},
	getters: {
		message_list: state => state.message_list,
		userInfo: state => state.users,
		currentUser: state => state.currentUser,
		agora_token: state => state.agora_token,
		badges: state => state.badge,
		clientInfo: state => state.clientInfo,
		txImisLogin: state => state.txImisLogin,
		txIm: state => state.txIm,
		targrtUser: state => state.targrtUsers,
		prevPage:state => state.prevPage,
		networkState:state => state.network,
		cropUsers:state=>state.cropUser,
		loginTypes:state=>state.loginType,
		cratePassword:state=>state.password,
		invitationBadgeCount:state=>state.invitationBadge,
		nowServiceId:state=>state.serviceId,
		chooseState:state=>state.isChoose,
		exitState:state=>state.isExit,
		chatViewIsTabbar:state=>state.chatViewTabbarState,
		currentUserTag:state=>state.userTag,
	},
	mutations: {
		_setBadge(state) {
			let bage = 0
			for (let attr in state.message_list) {
				let current = state.message_list[attr].message
				let n = current.filter(item => !item.isRead && !item.isSelf)
				bage += n.length
			}

			if (bage > 0) {
				uni.setTabBarBadge({
					index: 2,
					text: String(bage)
				})
			} else {
				uni.removeTabBarBadge({
					index: 2
				})
			}
		},
		setclientInfo(state, clientInfo) {
			state.clientInfo = clientInfo
		},
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
		addMessage(state, param) {
			if( param.type && param.type == -1) return
			let userid = param.userid
			let message = param.message
			let list = state.message_list
			let userInfo = param.userInfo

			if (list[userid]) {
				state.message_list[userid].message.push(message)
				state.message_list[userid].userInfo = userInfo
			} else {
				state.message_list[userid] = {
					userInfo,
					message: [message]
				}
			}

			if (state.badge[userid] == undefined) state.badge[userid] = 0
			if (!message.isRead && !message.isSelf) state.badge[userid]++

			let newObj = state.message_list
			state.message_list = Object.assign({}, newObj)

			this.commit("_setBadge")
			
			if(param.type && (param.type == "text_msg" || param.type == "image_msg")){
				return
			}
			
			this.commit("insertSql", { ...param,
				perfect: message.perfect ? 1 : 0
			})

		},
		readMessageAll(state, userid) {
			let mess = state.message_list[userid].message
			for (let i = 0; i < mess.length; i++) {
				if (!mess[i].isRead) mess[i].isRead = true
			}
			let newObj = state.message_list
			state.message_list = Object.assign({}, newObj)
			this.commit("_setBadge")
		},
		setCurrentUser(state, user) {
			state.currentUser = user
			if (user.userInfo && user.userInfo.userid) {
				let _userid = user.userInfo.userid
				if (!state.message_list[_userid]) {
					state.message_list[_userid] = user
				}
			}
		},
		setServiceInfo(state) {
			if (!state.message_list[state.serviceId]) {
				state.message_list[state.serviceId] = state.service[state.serviceId]
			}
			
			let newObj = state.message_list
			state.message_list = Object.assign({}, newObj)
			state.currentUser = state.message_list[state.serviceId]
			
		},
		setUsers(state, users) {
			state.users = users
		},
		setAgoraToken(state, token) {
			state.agora_token = token
		},
		insertSql(state, data) {
			let sql = ''
			let userid = data.userid
			let user = data.userInfo
			let msg = data.message
			let isRead = msg.isRead ? 1 : 0
			let perfect = msg.perfect ? 1 : 0
			let isSelf = msg.isSelf ? 1 : 0
			switch (data.message.type) {
				case 0:
					sql =
						`insert into ${sqlTable}(userid,type,date,nickname,avatar,isRead,perfect,isSelf, msg, id, cid) 
					values(${userid},${msg.type},${msg.date},"${user.nickname}","${user.avatar}",
					${isRead},${perfect},${isSelf},"${msg.msg}",${msg.id}, "${user.cid}")`
					break;
				case 1:
					sql =
						`insert into ${sqlTable}(userid,type,date,nickname,avatar,isRead,perfect,isSelf, img, id, cid, width) 
					values(${userid},${msg.type},${msg.date},"${user.nickname}","${user.avatar}",
					${isRead},${perfect},${isSelf},"${msg.img}",${msg.id}, "${user.cid}", ${msg.width})`
					break;
				case 2:
					let info = escape(JSON.stringify(msg.info))
					sql =
						`insert into ${sqlTable}(userid,type,date,nickname,avatar,
					isRead,perfect,isSelf,info,id, cid) values(${userid},${msg.type},${msg.date},
					"${user.nickname}","${user.avatar}",${isRead},
					${perfect},${isSelf},"${info}",${msg.id}, "${user.cid}")`

					break;
				case 3:
					let capInfo = escape(JSON.stringify(msg.info))
					sql =
						`insert into ${sqlTable}(userid,type,date,nickname,avatar,
					isRead,perfect,isSelf,info,id, cid) values(${userid},${msg.type},${msg.date},
					"${user.nickname}","${user.avatar}",${isRead},
					${perfect},${isSelf},"${capInfo}",${msg.id}, "${user.cid}")`
					break;
			}

			let userSql = `insert or ignore into ${userTab}(id) values(${userid})`

			this.commit("insertUser", userSql)
			this.commit("insertData", sql)
		},
		daropTab(state) {
			state.sqlite.operation(`DROP TABLE mes`).then(res => {
				console.log(res, 'mes表删除成功')
			}).catch(err => {
				console.log(err, 'mes表删除失败')
			})

			state.sqlite.operation(`DROP TABLE user`).then(res => {
				console.log(res, 'user表删除成功')
			}).catch(err => {
				console.log(err, 'mes表删除失败')
			})
		},
		insertUser(state, sql) {
			state.sqlite.operation(sql).then(res => {
				console.log(res, 'user添加成功')
			}).catch(err => {
				console.log(err, 'user添加失败')
			})
		},
		insertData(state, sql) {
			state.sqlite.operation(sql).then(res => {
				console.log(res, '添加成功')
			}).catch(err => {
				console.log(err, '添加失败')
			})
		},
		initMesList(state) {

			state.sqlite.init().then(res => {
				//this.commit('daropTab')
				
				
				if(state.isUpdateUser){
					this.commit("deleUserTabData")
					return
					
				}
				
				let sql1 = `select * from ${sqlTable}`
				state.sqlite.select(sql1).then(res => {
					// console.log(res, '打印所有数据')
					// console.log(res.length + '条数据')
				}).catch(err => {
					console.error(err)
				})
				

				let sql = `select * from ${userTab}`
				state.sqlite.select(sql).then(res => {
					if (res.length) {
						let result = res.map(item => {
							return {
								...item
							}
						})
						this.commit("initUserList", result)
					}
				}).catch(err => {
					console.error(err)
				})
				console.log("连接成功")
			}).catch(err => {
				console.log(err, '连接失败')
			})
		},
		deleUserTabData(state){
			let sql = `delete from ${sqlTable}`
			state.sqlite.operation(sql).then(res => {
				console.log(res, '清楚用户除成功')
			}).catch(err => {
				console.log(err, '清楚用户除失败')
			})
		},
		initUserList(state, userList) {
			for (let i = 0; i < userList.length; i++) {
				let sql = `select * from ${sqlTable} where userid = ${userList[i].id} order by uid desc Limit 50 Offset 0`
				state.sqlite.select(sql).then(list => {
					if (list.length) {
						this.commit("formatData", {
							list,
							page: 0,
							pageSize: 50,
							count: 0
						})
					}

				}).catch(err => {
					console.error(err)
				})
			}
		},
		loadMoreMesslist(state, {
			userid,
			page,
			pageSize,
			count
		}) {
			let sql =
				`select * from ${sqlTable} where userid = ${userid} order by uid desc Limit ${pageSize} Offset ${page * pageSize}`
			state.sqlite.select(sql).then(res => {
				if (res.length) {
					this.commit("formatData", {
						list: res,
						page,
						pageSize,
						count
					})
				}

			}).catch(err => {
				console.error(err)
			})
		},
		formatData(state, {
			list,
			page,
			pageSize,
			count,
			targetId
		}) {
			let mess = {}
			for (let i = 0; i < list.length; i++) {
				let data = list[i]
				let userInfo = {
					userid: Number(data.userid),
					nickname: data.nickname,
					avatar: data.avatar,
					agoraid: data.agoraid,
					perfect: data.perfect,
					cid: data.cid || "",
					sex: data.sex
				}
				let message = {
					type: list[i].type,
					date: data.date,
					isRead: data.isRead == 1 ? true : false,
					isSelf: data.isSelf == 1 ? true : false,
					id: data.id,
					width: data.width,
					sendErr: data.sendErr == 1 ? true : false
				}
				switch (list[i].type) {
					case 0:
						message.msg = data.msg
						break;
					case 1:
						message.img = data.img
						break;
					case 2:
						message.info = JSON.parse(unescape(data.info))
						break;
					case 3:
						message.info = JSON.parse(unescape(data.info))
						break;
				}
				if (mess[data.userid]) {
					mess[data.userid].message.unshift(message)
					mess[data.userid].userInfo = userInfo
				} else {
					mess[data.userid] = {
						userInfo,
						message: [message]
					}
				}
				if (state.badge[data.userid] == undefined) state.badge[data.userid] = 0
				if (!message.isRead && !message.isSelf) state.badge[data.userid]++
			}

			for (let attr in mess) {
				if (state.message_list[attr]) {
					state.message_list[attr].message.unshift(...mess[attr].message)
					state.message_list[attr].page = ++page
					state.message_list[attr].pageSize = pageSize
					state.message_list[attr].count = count + mess[attr].message.length
				} else {
					state.message_list[attr] = {
						...mess[attr],
						page: ++page,
						pageSize,
						count: count + mess[attr].message.length
					}
				}
			}
			this.commit("_setBadge")
		},
		updateReadState(state, userid) {
			let list = state.message_list[userid].message
			for (let i = 0; i < list.length; i++) {
				if (!list[i].isRead) {
					list[i].isRead = true
				}
			}
			let sql = `update ${sqlTable} set isRead=1 where userid=${userid}`
			state.sqlite.select(sql).then(res => {
				console.log('修改成功')

			}).catch(err => {
				console.error(err, '修改失败')
			})
			state.badge[userid] = 0
		},
		updateSendState(state, id) {
			let sql = `update ${sqlTable} set sendErr=1 where id=${id}`
			state.sqlite.select(sql).then(res => {
				console.log('修改发送状态成功')
		
			}).catch(err => {
				console.error(err, '修改发送状态失败')
			})
		},
		deleUserMess(state, userid){
			let newObj = state.message_list
			if(newObj[userid]) delete newObj[userid]
			state.message_list = Object.assign({},newObj)

			let sql = `DELETE FROM ${sqlTable} where userid=${userid}`
			state.sqlite.select(sql).then(res => {
				console.log('删除mes成功')
			
			}).catch(err => {
				console.error(err, '删除mes失败')
			})
			let usql = `DELETE FROM ${userTab} where id=${userid}`
			state.sqlite.select(usql).then(res => {
				console.log('删除user成功')
			
			}).catch(err => {
				console.error(err, '删除user失败')
			})
			this.commit("_setBadge")
		},
		setTXIMstate(state) {
			state.txImisLogin = true
		},
		setTargrtUser(state, user) {
			state.targrtUsers[user.id] = user
		},
		pushSendMessage(state, mes){
			state.sendMess.push(mes)
		},
		removeSendMes(state){
			state.sendMess.splice(0,1)
		},
		chageSendMesState(state){
			if(state.sendMess[0]){
				let uid = state.sendMess[0].userid
				let mid = state.sendMess[0].mid
				if(state.message_list[uid]){
					let current = state.message_list[uid].message.find(item=>item.id == mid)
					if(current) current.sendErr = true
				}
				let newObj = state.message_list
				state.message_list = Object.assign({},newObj)
				this.commit('updateSendState', mid)

				state.sendMess.splice(0,1)
			}
		},
		setPrevPage(state, page){
			state.prevPage = page
		},
		updateUser(state, status){
			state.isUpdateUser = status
		},
		setNetwork(state, bool){
			state.network = bool
		},
		setCropUser(state, user){
			state.cropUser = user
		},
		createService(state, services){
			let service = services.data.serviceinfo
			state.serviceId = service.id
			state.service = {
				[service.id]: {
					userInfo: {
						userid: service.id,
						nickname: service.nickname,
						avatar: service.avatarimg
					},
					message: []
				}
			}
		},
		setLoginType(state, type){
			state.loginType = type
		},
		removeMesslist(state){
			state.message_list = {}
			state.currentUser = {}
			state.users = {}
			state.txImisLogin = false
		},
		setPassword(state, password){
			state.password = password
		},
		setInvitationBadge(state, isClear){
			if(isClear) state.invitationBadge = 0
			else state.invitationBadge ++
		},
		setChoose(state, bool){
			state.isChoose = bool
		},
		setExitState(state, bool){
			state.isExit = bool
		},
		setChatViewTabbar(state, bool){
			state.chatViewTabbarState = bool
		},
		setUserTags(state, tags){
			state.userTag = tags
		}
	}
})

export default store
