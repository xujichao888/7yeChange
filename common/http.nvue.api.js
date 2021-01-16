import {
	request,
	requestAll
} from "./request.js"

export const get_recom_list = (params = {}) => {
	return request("/channel/getrecommendinfo", params, "POST")
}
export const init_user_info = (params = {}) => {
	return request("/users/updateuserinitial", params, "POST")
}
export const get_user_info = (params = {}) => {
	return request(`/users/getuserredis/${params.userid}`, "GET")
}
export const get_invite_list = (params = {}) => {
	return request(`/channel/getuserresignup`, params, "GET")
}
export const get_feed_list = (params = {}) => {
	return request("/channel/getfeedback", params, "GET")
}
export const sign_up = (params = {}) => {
	return request("/channel/createsignupinvite", params, "POST")
}
export const get_invite_info = (params = {}) => {
	return request("/channel/getsignupinviteinfo", params, "GET")
}
export const admire_check = (params = {}) => {
	return request("/channel/feelikes", params, "POST")
}
export const comment_on = (params = {}) => {
	return request("/channel/createfeecomment", params, "POST")
}
export const get_comment_data = (params = {}) => {
	return request("/channel/getfeecommentinfo", params, "GET")
}
export const get_like_data = (params = {}) => {
	return request("/hobby/gethobby", params, "GET")
}
export const pass_sign = (params = {}) => {
	return request("/channel/updatesignupstatus", params, "GET")
}
export const get_tag = (params = {}) => {
	return request("/tag/gettag", params, "GET")
}
export const screen_user = (params = {}) => {
	return request("/users/getuserinfo", params, "POST")
}
export const compile_user = (params = {}) => {
	return request("/users/updateuserexpand", params, "POST")
}
export const publish_invite = (params = {}) => {
	return request("/channel/releaseresignup", params, "POST")
}
export const publish_recom = (params = {}) => {
	return request("/channel/createrecommend", params, "POST")
}
export const statistics_list = (params = {}) => {
	return request("/users/getusertotal", params, "GET")
}
export const upload_avatar = (params = {}) => {
	return request("/users/useravatarimg", params, "POST")
}
export const upload_photo = (params = {}) => {
	return request("/users/uploaduserimg", params, "POST")
}
export const delete_photo = (params = {}) => {
	return request("/users/deluserimg", params, "POST")
}
export const get_rtmtoken = (params = {}) => {
	return request(`/agora/getrtmtoken`, "GET")
}
export const create_room = (params = {}) => {
	return request(`/room/createroom`, params, "POST")
}
export const get_room = (params = {}) => {
	return request(`/room/getroomslist`, params, "GET")
}
export const push_message = (params = {}) => {
	return request(`/unipush/pushsinglecid`, params, "POST")
}
export const get_code = (params = {}) => {
	return request(`/users/getcaptcha/`, params, "GET")
}
export const set_cid = (params = {}) => {
	return request(`/users/updateusercid/${params.cid}/${params.phonemodel}`, "GET")
}
export const del_room = (params = {}) => {
	return request(`/room/delroom/${params.id}/${params.hitalkid}`, {}, "DELETE")
}
export const del_comment= (params = {}) => {
	return request(`/channel/delfeecomment`, params, "GET")
}
export const wechat_login = (params = {}) => {
	return request(`/users/wechatlogin`, params, "POST")
}
export const get_order = (params = {}) => {
	return request(`/order/createorder`, params, "POST")
}
export const get_props = (params = {}) => {
	return request(`/props/getprops`, params, "GET")
}
export const get_hitalk_token= (params = {}) => {
	return request(`/hitalk/hitalklogin`, params, "GET")
}
export const get_user_diamond = (params = {}) => {
	return request(`/users/getuserdiamond`, params, "GET")
}
export const login = (params = {}) => {
	return request(`/users/login`, params, "POST")
}
export const get_code_new = (params = {}) => {
	return request(`/users/captchaverify`, params, "GET")
}
export const get_service_info = (params = {}) => {
	return request(`/service/getmyservice`, params, "GET")
}
export const init_upload_avatar = (params = {}) => {
	return request("/users/useravatarimgurl", params, "POST")
}
export const is_wechat_login = (params = {}) => {
	return request("/users/wechatverify", params, "GET")
}
export const batch_recommend= (params = {}) => {
	return request("/channel/batchcreaterecommend", params, "POST")
}
export const creater_user= (params = {}) => {
	return request("/users/servicereg", params, "POST")
}

export const get_signup= (params = {}) => {
	return request("/channel/getsignupinvitelist", params, "GET")
}
export const get_leve= (params = {}) => {
	return request("/users/getlevel", params, "GET")
}
export const get_service_list= (params = {}) => {
	return request("/service/getservices/0", params, "GET")
}
export const get_service_group= (params = {}) => {
	return request(`/service/getgroups/${params.userid}`, "GET")
}
export const get_signupinvite_info= (params = {}) => {
	return request(`/channel/getsignupinviteinfo`, "GET")
}
export const get_service_data= (params = {}) => {
	return request(`/service/getrobotinit`, "GET")
}
export const add_service_mess= (params = {}) => {
	return request(`/service/addrobot`,params, "PUT")
}
export const update_service_mess= (params = {}) => {
	return request(`/service/editrobot`,params, "POST")
}
export const del_service_mess= (params = {}) => {
	return request(`/service/delrobot/${params.id}`,{}, "DELETE")
}
export const add_service_img= (params = {}) => {
	return request(`/fileupload/addimg`,{}, "POST")
}
export const apple_login = (params = {}) => {
  return request(`/users/applelogin`, params, "POST")
}
export const get_share_content = (params = {}) => {
  return request(`/users/getshare`, params, "GET")
}
export const get_user_service = (params = {}) => {
  return request(`/service/getuserservices/${params.userid}`, params, "GET")
}
export const send_agora_mess = (params = {}) => {
  return request(`/agora/sendmsg`, params, "POST")
}
export const del_recomm = (params = {}) => {
  return request(`/channel/delrecommendinfo/${params.id}/${params.type}`, params, "DELETE")
}
export const appstore_callback = (params = {}) => {
  return request("/order/appstorecallback", params, "POST")
}
export const add_tag = (params = {}) => {
  return request("/tag/updatetag", params, "POST")
}
export const adit_user_tag = (params = {}) => {
  return request("/users/updateusertag", params, "POST")
}
export const get_user_authority= (params = {}) => {
  return request(`/users/getcustomlevel/${params.userid}`, params, "GET")
}
export const update_user_authority= (params = {}) => {
  return request(`/users/updatecustomlevel/${params.userid}`, {data:params.data}, "PUT")
}
export const get_avatar= (params = {}) => {
  return request(`/users/getdefavatarimg/${params.sex}`, {}, "GET")
}
export const upload_url_avatar = (params = {}) => {
  return request(`/users/updateuseravatar`, params, "POST")
}
export const buy_level = (params = {}) => {
  return request(`/users/buylevel`, params, "POST")
}
export const update_version = (params = {}) => {
  return request(`/version/check`, params, "POST")
}
export const get_examine = (params = {}) => {
  return request(`/channel/getfeecommentinfoall`, params, "GET")
}
export const get_feedback_info = (params = {}) => {
  return request(`/channel/getfeedbackinfo`, params, "GET")
}
export const change_feecomment_status = (params = {}) => {
  return request(`/channel/feecommentstatus`, params, "POST")
}











