
//请求地址列表
let publicPath = 'http://api.7nightapp.com'

let registerPath = `${publicPath}/v1/user/register`//注册请求地址
let roomListPath = `${publicPath}/v1/room/getList`//获得房间列表地址
let addRoom = `${publicPath}/v1/room/join/`//加入房间地址
let removeRoom = `${publicPath}/v1/room/delete/` //删除房间
let getRoomMsg =`${publicPath}/v1/room/info/` //获得房间信息
let leaveRoomPath = `${publicPath}/v1/room/signout/`//退出房间
let createRoomPath = `${publicPath}/v1/room/create` //创建房间
let getRTMtoken =  `${publicPath}/v1/agora/getRtmToken`//获得RTMtoken
let getRTCtoken =  `${publicPath}/v1/agora/getRtcToken/` //获得RTCtoken用于实时音频播放
let getOnlineList = `${publicPath}/v1/room/getRoomUsers/`//获得房间内在线列表
let getSelfRoomListPath = `${publicPath}/v1/favourite/roomlist` //获得自己收藏的房间列表
let updataRoomInfo =`${publicPath}/v1/room/update/`//修改房间信息接口
let getFriendList = `${publicPath}/v1/follow/friendList/`//获得好友列表
let focusSome = `${publicPath}/v1/follow/add` //添加关注
let getFocusList = `${publicPath}/v1/follow/targetlist` //获得关注列表
let getFansList = `${publicPath}/v1/follow/userlist` //获得粉丝列表
let removeFollow = `${publicPath}/v1/follow/del/`//取消关注
let addFollow = `${publicPath}/v1/follow/add` //添加关注
let getFocusAndFansNum = `${publicPath}/v1/follow/count/`//获得关注数和粉丝数
let getSortMsg =`${publicPath}/v1/user/userTop` //根据type拉取排行榜数据
let upLoadimg=`${publicPath}/v1/upload/file` //上传图片接口
let prohibitUserMic = `${publicPath}/v1/room/setVoice/`//房主禁麦
let getSystemMsg = `${publicPath}/v1/sysmsg/getSystemMsg` //获得系统消息


let loginPath = `${publicPath}/v1/user/login`//登录请求地址
let getUserMsgPath = `${publicPath}/v1/user/getUserInfo/`//获得用户信息/v1/user/getUserInfo/:userid GET
let refreshTokenPath =`${publicPath}/v1/user/refreshToken/`//刷新token PUT
let getUserSign = `${publicPath}/v1/tencentyun/getUserSig` //获得用户的签名
let setUserMsgPath = `${publicPath}/v1/user/updateUserInfo` //设置用户信息
let addcollictionPath =  `${publicPath}/v1/favourite/add` //添加收藏
let removeCollectionPath = `${publicPath}/v1/favourite/del/`//取消收藏
let upMicPath = `${publicPath}/v1/anchor/up` //主播上麦
let downMicPath =`${publicPath}/v1/anchor/down` //主播下麦
let getReagon = `${publicPath}/v1/user/getRegion/` //请求地区
let resetPassword =`${publicPath}/v1/user/refreshPassword` //重置密码
let exchangeMoneyList = `${publicPath}/v1/thirdpartys/exchangeList` //兑换三方货币列表
let exchange = `${publicPath}/v1/thirdpartys/exchange` //兑换道具
export{
	loginPath,
	registerPath,
	roomListPath,
	addRoom,
	getUserMsgPath,
	refreshTokenPath,
	getRoomMsg,
	getUserSign,
	leaveRoomPath,
	createRoomPath,
	setUserMsgPath,
	addcollictionPath,
	removeCollectionPath,
	upMicPath,
	downMicPath,
	getRTMtoken,
	getOnlineList,
	getRTCtoken,
	updataRoomInfo,
	getSelfRoomListPath,
	upLoadimg,
	getReagon,
	resetPassword,
	getFriendList,
	focusSome,
	getFocusList,
	getFansList,
	removeFollow,
	addFollow,
	getFocusAndFansNum,
	removeRoom,
	getSortMsg,
	prohibitUserMic,
	exchangeMoneyList,
	exchange,
	getSystemMsg
}
	
