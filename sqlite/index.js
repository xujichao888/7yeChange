export class Sqlite {
	constructor(name, path, tab, userTab) {
		this.name = name
		this.path = path
		this.tab = tab
		this.userTab = userTab
	}
	_isOpen() {
		//数据库打开了就返回true,否则返回false
		var open = plus.sqlite.isOpenDatabase({
			name:this.name,
			path:this.path
		})
		return open;
	}
	close(name) {
		return new Promise((resolve, reject) => {
			plus.sqlite.closeDatabase({
				name:this.name,
				success(e) {
					console.log("数据库关闭成功")
				},
				fail(e) {
					console.log("数据库关闭失败")
				}
			})
		})
	}
	init(){
		return new Promise((resolve, reject) => {
			let _isopen = this._isOpen()
			let isCreatMesTab = uni.getStorageSync("isCreatMesTab")
			if(_isopen){
				if(!isCreatMesTab){
					this.createTab().then(res=>{
						uni.setStorageSync('isCreatMesTab',true)
						resolve(res)
					}).catch(err=>{
						reject(err, '表格创建失败')
					})
					return
				}
				resolve()
			} else {
				this.openSqlite().then(res=>{
					if(!isCreatMesTab){
						this.createTab().then(res=>{
							uni.setStorageSync('isCreatMesTab',true)
							resolve(res)
						}).catch(err=>{
							reject(err, '表格创建失败')
						})
						return
					}
					resolve()
				}).catch(err=>{
					reject(err, '数据库连接失败')
				})
			}
		})
	}
	openSqlite() {
		//创建数据库或者打开
		return new Promise((resolve, reject) => {
			plus.sqlite.openDatabase({
				name:this.name, 
				path:this.path,
				success(e) {
					resolve(e); 
				},
				fail(e) {
					reject(e); 
				}
			})
		})
	}
	createTab(){
		return new Promise((resolve, reject) => {
			let sql = `create table if not exists ${this.tab}("uid" INTEGER PRIMARY KEY AUTOINCREMENT,"userid" INT,
			  "nickname" VARCHAR, "sex" INT, "perfect" INT, "type" INT, "date" TIMESTAMP, "agoraid" INT, "isRead" INT, 
			  "msg" TEXT, "avatar" VARCHAR, "isSelf" INT, "width" INT, "img" VARCHAR, "info" TEXT, "id" VARCHAR, "cid" VARCHAR,
			  "sendErr" INT)`
			this.operation(sql).then(res => {
				console.log(res, '表创建成功')
				let sql2 = `create table if not exists ${this.userTab}("id" INT NOT NULL UNIQUE)`
				this.operation(sql2).then(res => {
					console.log(res, 'user表创建成功')
					resolve(res)
				}).catch(err => {
					console.log(res, 'user表创建失败')
					reject(err)
				})
			}).catch(err => {
				console.log(res, '表创建失败')
				reject(err)
			})
			
		})
	}
	//增删改
	operation(sql) {
		return new Promise((resolve, reject) => {
			let _isopen = this._isOpen()
			if(!_isopen){
				this.openSqlite().then(res=>{
					plus.sqlite.executeSql({
						name:this.name,
						sql,
						success(e) {
							resolve(e);
						},
						fail(e) {
							reject(e);
						}
					})
				}).catch(err=>{
					reject(err)
				})
			} else {
				plus.sqlite.executeSql({
					name:this.name,
					sql,
					success(e) {
						resolve(e);
					},
					fail(e) {
						reject(e);
					}
				})
			}
		})
	}
	//查
	select(sql) {
		return new Promise((resolve, reject) => {
			let _isopen = this._isOpen()
			if(!_isopen){
				this.openSqlite().then(res=>{
					plus.sqlite.selectSql({
						name:this.name,
						sql,
						success(e) {
							resolve(e);
						},
						fail(e) {
							reject(e);
						}
					})
				})
			} else {
				plus.sqlite.selectSql({
					name:this.name,
					sql,
					success(e) {
						resolve(e);
					},
					fail(e) {
						reject(e);
					}
				})
			}
			
		})
	}
}
 

