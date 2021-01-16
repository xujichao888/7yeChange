import proto from './api.js'
import protobuf from 'protobufjs'

let datas = null

let exchangeToBuf=(reqName,reqjson,indexName,arr)=>{ //字符串转二进制
	let setToken =  proto.lookup(reqName)//"api.ReqBindUser"
	let setData =	setToken.create(reqjson)
	let binduser = proto.lookup(indexName);//"api.BindUser"
	let ReqData = binduser.create({
		req:setData
	})
	let Reqbyts = binduser.encode(ReqData).finish();
	datas = new Uint8Array(2 + Reqbyts.length);
	datas[0] =arr[0]
	datas[1] =arr[1]
	datas.set(Reqbyts,2)
	return datas
}

let exchangeToString= (resDate,resName)=>{
	console.log('我进入了函数')
	var rsp = new Uint8Array(resDate).slice(2);
	console.log('执行1')
	let Response = proto.lookup(resName);//"api.BindUser"
	console.log('执行2')
	let buf = protobuf.util.newBuffer(rsp);
	console.log('执行3',buf)
	let Resbyts = Response.decode(buf)
	console.log('执行4',Resbyts)
	return Resbyts
}
export{exchangeToBuf,exchangeToString}