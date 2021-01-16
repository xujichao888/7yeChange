
// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	let getCode = (params = {}) => vm.$u.get("/users/getcaptcha/" + params.phone);
	let getInviteList = (params = {}) => vm.$u.get("channel/getuserresignup", params.phone);
	let getRecomList = (params = {}) => vm.$u.get("/channel/getrecommend", params.phone);
	let getFeedList = (params = {}) => vm.$u.get("/channel/getfeedback", params.phone);

	// 此处使用了传入的params参数，一切自定义即可
	let login = (params = {}) => vm.$u.post("/users/login", params);
	let operationpassword = (params = {}) => vm.$u.post("/users/operationpassword", params);
	let init_user_info = (params = {}) => vm.$u.post("/users/updateuserinitial", params);
	

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getCode,
		login,
		operationpassword,
		init_user_info,
		getInviteList,
		getRecomList,
		getFeedList
	};
}

export default {
	install
}