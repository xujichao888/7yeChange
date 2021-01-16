import province from "@/common/province.js"
import city from "@/common/city.js"

let citys = []
	for(let i=0; i<city.length; i++){
		citys.push(...city[i])
	}
	for(let i=0; i<province.length; i++){
	 	let children = citys.filter(item => item.value.substring(0,2) == province[i].value)
		province[i].children = children.length ? children : [{"label":"",value:""}]
	}
	
export default {
	province
}