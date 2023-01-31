import {
	Connect
} from "./db/mongo.js"
import {
	defaultPath
} from '../config/index.js'
import axios from 'axios'
export const DefaultApi = (req, resp) => resp.send('hello js')
import jwt from 'jsonwebtoken'
import moment from 'moment';
import {
	alipaySdk
} from './db/alipayUtil.js'
// import pkg from 'alipay-sdk';
// console.log('pkg',pkg.default)

import AlipayFormDataPkg from 'alipay-sdk/lib/form.js'
const AlipayFormData = AlipayFormDataPkg.default;
import {
	secreateOrPrivateKey,
	uploadAvatarPath
} from '../config/index.js'
// 连接mongoDb
export const PingDb = async (req, resp) => {
	try {
		// 连接数据库是异步
		const client = await Connect()
		// 切换数据库是同步的
		const db = client.db('yiwugou')
		// ping一下数据库是否能正常读取
		const res = await db.command({
			ping: 1
		})
		console.log(res);
		if (res.ok === 1) {
			resp.send('mongo connect success')
		} else {
			resp.send('mongo connect failed')
		}
	} catch (e) {
		console.log(e);
		resp.send('数据库连接失败')
	}
}
// 获取 推荐页面 轮播图的数据
export const getCarousel = async (req, resp) => {
	try {
		const client = await Connect()
		const db = client.db('yiwugou')
		const res = await db.collection('carousel').find().toArray()
		let imgpath = []
		imgpath = res.map((item) => {
			return defaultPath + item.imgpath
		})
		// console.log('res:',imgpath)
		resp.send(imgpath)
	} catch (e) {
		resp.send('获取图片失败')
	}
}
// 获取 推荐页面 icon的数据
export const getIcon = async (req, resp) => {
	try {
		const client = await Connect()
		const db = client.db('yiwugou')
		const res = await db.collection('icon').find().toArray()
		let iconItems = []
		iconItems = res.map((item) => {
			item.imgpath = defaultPath + item.imgpath
			return item
		})
		resp.send(iconItems)
	} catch (e) {
		resp.send('获取icon失败')
	}
}
// 获取 推荐页面 banner的数据
export const getBanner = async (req, resp) => {
	try {
		const client = await Connect()
		const db = client.db('yiwugou')
		const res = await db.collection('banner').find().toArray()
		let bannerItems = []
		bannerItems = res.map((item) => {
			item.imgpath = defaultPath + item.imgpath
			return item
		})
		resp.send(bannerItems)
	} catch (e) {
		resp.send('获取icon失败')
	}
}
// 获取 category的数据
export const getCategory = async (req, resp) => {
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('category').find().toArray()
			resp.send(res)
		} catch (e) {
			resp.send('获取category数据失败')
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send('数据库连接失败', e.message)
	}
}
// 获取 category具体的商品数据
export const getCategoryItem = async (req, resp) => {
	const p = req.body
	// console.log('$$$$$$$$',p)
	let categoryItems = []
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const options = {
				name: p.names
			}
			const res = await db.collection('category').find(options).toArray()
			// console.log('rrrrrrrrrrrrrrrr',res.items)
			categoryItems = res[0].items.map((item) => {
				item.imgpath = defaultPath + item.imgpath
				return item
			})
			// console.log('qqqqqqqq',categoryItems)
			resp.send(categoryItems)
		} catch (e) {
			resp.send('获取category数据失败')
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send('数据库连接失败', e.message)
	}
}
// 获取 category具体的商品中的小商品数据
export const getCategoryListItem = async (req, resp) => {
	const p = req.body //p传过来了商品名称。start，count
	let newCategoryItems = []
	let categoryList = []
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const options = {
				name: p.names
			}
			const res = await db.collection('category').find(options).toArray()

			console.log('ressresesree', res.items)
			for (let item of res[0].items) {
				categoryList = categoryList.concat(item.goods)
			}
			for (let i = p.start; i < p.start + p.count; i++) {
				newCategoryItems.push(categoryList[i])
			}
			if (newCategoryItems === null) {
				return -1
			}
			resp.send(newCategoryItems)
		} catch (e) {
			resp.send('获取categoryListItem数据失败', e.message)
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send('数据库连接失败', e.message)
	}
}
//把所有的数据进行拼接，为了在首页进行展示，以及进行查找时进行模糊查找
export const getTotalCategoryListItem = async (req, resp) => {
	const p = req.body
	let categoryList = []
	let newCategoryItems = []
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('category').find().toArray()
			res.forEach(item => {
				[...item.items].forEach(item => {
					categoryList.push(...item.goods)
					// 创建一张新表，把所有的商品传输进去
					// db.collection('goods').insertOne(...item.goods)
				})
			})
			for (let i = p.start; i < p.start + p.count; i++) {
				newCategoryItems.push(categoryList[i])
			}
			// console.log('newCategoryItems',newCategoryItems)
			// console.log('把所有的数据进行拼接',categoryList)
			console.log('this is p', p)
			resp.send(newCategoryItems)
		} catch (e) {
			resp.send('获取completeCategoryItems数据失败', e.message)
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send('数据库连接失败', e.message)
	}
}

// getGoods
export const getGoods = async (req, resp) => {
	const p = req.body
	let categoryList = []
	let newCategoryItems = []
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('goods').find().toArray()
			// res.forEach(item => {
				// [...item.items].forEach(item => {
					// categoryList.push(...item.goods)
					// 创建一张新表，把所有的商品传输进去
					// db.collection('goods').insertOne(...item.goods)
				// })
			// })
			for (let i = p.start; i < p.start + p.count; i++) {
				newCategoryItems.push(res[i])
			}
			// console.log('newCategoryItems',newCategoryItems)
			// console.log('把所有的数据进行拼接',categoryList)
			// console.log('this is p', p)
			resp.send(newCategoryItems)
		} catch (e) {
			resp.send('获取getGoods数据失败', e.message)
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send('数据库连接失败', e.message)
	}
}

// 进行查询商品
export const FindGood = async (req, resp) => {
	console.log('获取到的商品信息：', req.body)
	const p = req.body
	const searchDesc = p.desc === undefined ? '' : p.desc
	console.log('searchAcount：', searchDesc)
	try {
		const client = await Connect()
		const db = client.db('yiwugou')
		const query = {
			desc: { //进行模糊查询
				$regex: searchDesc
			}
		}
		// 把在数据库中搜索过滤出来的结果返回
		const res = await db.collection('goods').find(query).toArray()
		resp.send({
			code: 1,
			msg: '成功',
			data: res
		})
	} catch (e) {
		console.log(e)
		resp.send({
			code: 2,
			msg: '获取数据失败',
			data: e
		})
	}
}



// 搜索结果的查询
export const getSearchResult = async (req, resp) => {
	const p = req.body
	// req.body拿到前端传过来的数据///如我在搜索栏写入1 这里就可以接收到 
	// 要想rq.body接收到值就要使用一个express自带的一个中间件app.use(express.json())

	// 达到搜索效果
	// 1.连接到数据库
	// 2.切换到使用的数据库
	// 3.连接到数据库的表，把req.body的值输入，进行查找

	let categoryList = []
	let newCategoryItems = []
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('category').find().toArray()
			res.forEach(item => {
				[...item.items].forEach(item => {
					[...item.goods].forEach(item => {
						if (item.desc.indexOf(p.searchContent) !== -1) {
							categoryList.push(item)
						}
					})
				})
			})
			for (let i = p.start; i < p.start + p.count; i++) {
				if (categoryList[i] !== undefined) {
					console.log('categoryList[i]：', categoryList[i])
					newCategoryItems.push(categoryList[i])
				}
			}
			resp.send({
				code: 1,
				msg: '成功',
				data: newCategoryItems,
				num: categoryList.length
			})
		} catch (e) {
			resp.send({
				code: 2,
				msg: '获取数据失败',
				data: e.message
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send('数据库连接失败', e.message)
	}
}

export const CategoryList = async (req, resp) => {
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou');
			const category = await db.collection('category').find().toArray()
			// console.log(category);
			resp.send({
				code: 1,
				msg: '成功',
				data: category
			})
		} catch (error) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}

	} catch (error) {
		resp.send({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}

export const CategoryResult = async (req, resp) => {
	const p = req.body
	// console.log("p", p);
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou')
			const query = {
				name: p.tabName
			}
			const category = await db.collection('category').find(query).toArray()
			const categoryResult = category[0].items.filter((item) => {
				return p.name == item.name
			})
			const goods = categoryResult[0].goods
			// console.log('categoryResult', categoryResult[0].goods);
			resp.send({
				code: 1,
				msg: '成功',
				data: {
					categoryResult,
					goods
				}
			})
		} catch (error) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}

	} catch (error) {
		resp.send({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}
// 注册进行添加用户
export const Register = async (req, resp) => {
	const p = req.body;
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou');
			const query = {
				id: p.id
			}
			const insert = {
				...p,
				status: '1',
				avatar: "",
				role: "c"

			}
			const options = {
				upsert: true //upsert可以指定如果数据存在就更新，不存在就创建数据
			}
			const res = await db.collection('user').updateOne(query, {
				"$setOnInsert": insert
			}, options)
			// console.log(res);
			if (res.upsertedCount == 1) {
				resp.json({
					code: 1,
					msg: '注册成功',
					data: {}
				})
			} else if (res.upsertedCount == 0 && res.matchedCount > 0) {
				resp.json({
					code: 4,
					msg: "该用户已存在",
					data: {}
				})
			} else {
				resp.json({
					code: 5,
					msg: "未知原因,注册失败",
					data: {}
				})
			}


		} catch (error) {
			resp.json({
				code: 3,
				msg: "数据问题导致注册失败",
				data: {}
			})
		} finally {
			client.close()
		}

	} catch (error) {
		resp.json({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}
// 进行查询用户
export const getUser = async (req, resp) => {
	console.log('获取到的用户信息：', req.body)
	const p = req.body
	const searchAcount = p.account === undefined ? '' : p.account
	console.log('searchAcount：', searchAcount)
	try {
		const client = await Connect()
		const db = client.db('yiwugou')
		const query = {
			id: { //进行模糊查询
				$regex: searchAcount
			}
		}
		// 把在数据库中搜索过滤出来的结果返回
		const res = await db.collection('user').find(query).toArray()
		console.log('this is findUser',res)
		resp.send({
			code: 1,
			msg: '成功',
			data: res
		})
	} catch (e) {
		console.log(e)
		resp.send({
			code: 2,
			msg: '获取数据失败',
			data: e
		})
	}
}
// 进行获取用户
export const findUser = async (req, resp) => {
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('user').find().toArray()
			resp.send({
				code: 1,
				msg: '成功',
				data: res
			})
		} catch (e) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}
// 进行登录
export const Login = async (req, resp) => {
	const p = req.body;
	// console.log('p看看是否有密码：',p);
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou')
			const user = await db.collection('user').findOne({
				id: p.id,
				role: p.role
			})
			//    console.log(user);
			if (user) {
				if (user.pwd == p.pwd) {
					const token = jwt.sign({
						id: user.id,
						role: user.role
					}, secreateOrPrivateKey, {
						expiresIn: '24h'
					})
					//    console.log(token);
					//    console.log('avatar', defaultPath + join(user.avatar));
					resp.json({
						code: 1,
						msg: "登陆成功",
						data: {
							userId: user.id,
							role: user.role,
							avatar: user.avatar,
							token,
							pwd:user.pwd,
							remember:p.remember
							// userName: user.username,
							// avatar: defaultPath + join(user.avatar),
						}
					})
				} else {
					resp.json({
						code: 5,
						msg: "密码不正确",
						data: {}
					})
				}
			} else {
				resp.json({
					code: 4,
					msg: "无此用户",
					data: {}
				})
			}
		} catch (error) {
			resp.json({
					code: 3,
					msg: error + "用户输入信息问题",
					data: {}
			})
	} finally {
		client.close()
	}
} catch (error) {
	resp.json({
		code: 2,
		msg: "数据库连接失败",
		data: {}
	})
}
}

// 登录验证
export const LoginByYzm = async (req, resp) => {
	const p = req.body;
	console.log('p', p);
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou')
			const user = await db.collection('user').findOne({ id: p.phone })
			console.log(user);
			if(user.id == p.phone){
				const token = jwt.sign({ id: user.id, role: user.role }, secreateOrPrivateKey, {
					expiresIn: '24h'
				})
				resp.json({
					code: 1,
					msg: "登陆成功",
					data: {
						userId: user.id,
						role: user.role,
						avatar: user.avatar,
						token,
						pwd:user.id
						// userName: user.username,
						// avatar: defaultPath + join(user.avatar),
					}
				})
			}
			
			
		} catch (error) {
			resp.json({
				code: 3,
				msg: error + "用户输入信息问题",
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (error) {
		resp.json({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}


export const UploadImg = async (req, resp) => {
	const p = req.body;
	// console.log(p);
	const file = req.file
	console.log("上传头像file:",file)
	try {
		const client = await Connect();
		try {
			const db = client.db("yiwugou")
			const query = {
				id: p.userId
			}
			const avatarPath = uploadAvatarPath + "avatar/" + file.filename
			console.log('上传头像后最终的路径：',avatarPath);
			const update = {
				$set: { //可以使用$set操作符将某个字段设置为指定值
					// avatar:file?.filename
					avatar: avatarPath
				}
			}
			const res = await db.collection("user").updateOne(query, update)
			// console.log("update res:",res)
			if (res.modifiedCount === 1 && res.matchedCount === 1) {
				const avatar = avatarPath
				resp.send({
					code: 1,
					msg: "上传成功",
					data: {
						avatar
					}
				})
			} else {
				resp.send({
					code: 4,
					msg: "上传失败",
					data: {}
				})
			}
		} catch (err) {
			resp.json({
				code: 3,
				msg: "更新数据库失败",
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.json({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}

export const GoodDetail = async (req, resp) => {
	const p = req.body
	// console.log('p',p);
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou');
			const goodsList = []
			const res = await db.collection('category').find().toArray()
			res.forEach(item => {
				[...item.items].forEach(item => {
					[...item.goods].forEach(item => {
						goodsList.push(item)
					})
				})
			})
			const goods = goodsList.filter(item => {
				return p.goodName == item.desc && p.goodId == item.id
			})
			console.log(goods);
			resp.send({
				code: 1,
				msg: '成功',
				data: goods
			})
		} catch (error) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}

	} catch (error) {
		resp.send({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}
// 添加到购物车
export const AddCart = async (req, resp) => {
	const p = req.body
	console.log('增加购物车之后传过来的信息：', p)
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const query = {
				id: p.good.id, //商品id
				userId: p.userId,
				desc: p.good.desc
			}
			delete p.good.count
			delete p.good.checked //每次更新移除被选中的
			const insert = { //插如数据
				...p.good,
				userId: p.userId,
				token: p.token,
				sysdate: moment(), //时间戳引入moment
				// count:0
			}
			const update = { //更新数据
				count: p.ifIncrease ? 1 : -1
			}
			const options = {
				upsert: true
			}
			const res = await db.collection('cart').updateOne(query, {
				'$setOnInsert': insert,
				'$inc': update
			}, options)
			console.log('增加购物车返回的数据', res)
			if (res.upsertedCount === 1 || res.modifiedCount === 1) {
				resp.json({
					code: 1,
					msg: '添加成功',
					data: {}
				})
			} else {
				resp.json({
					code: 4,
					msg: '添加购物车失败',
					data: {}
				})
			}
		} catch (e) {
			resp.json({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.json({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}
export const GetCart = async (req, resp) => {
	const p = req.body
	// console.log('p',p);
	try {
		const client = await Connect();
		try {
			const db = client.db('yiwugou');
			const goodsList = []
			const res = await db.collection('cart').find().toArray()
			// console.log('购物车里面的数据',res)
			// const goods = goodsList.filter(item=>{
			//     return p.goodName == item.desc && p.goodId == item.id
			// })
			resp.send({
				code: 1,
				msg: '成功',
				// data: goods
				data: res
			})
		} catch (error) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}

	} catch (error) {
		resp.send({
			code: 2,
			msg: "数据库连接失败",
			data: {}
		})
	}
}

// 创建订单
export const CreateOrder = async (req, resp) => {
	const p = req.body
	console.log('createorder传过来的数据：', p)
	const list = p.order.list
	// 旧的
	// const id = 'OR' + Date.now()//不能只写数字，所以再写一个前缀,可以返回给前台，也可以不返回
	const id = p.id === undefined ? "OR" + Date.now() : p.id
	const status = p.status === '1' ? p.status : '2'
	try {
		const client = await Connect()
		try {
			//这些是旧的
			/* const order = {   旧的
				...p.order,//前台传过来的值  旧的
				list:p.order.list,   旧的
				id,  旧的
				sysdate: moment().format('YYYY-MM-DD HH:mm:ss')//目的是为了给用户看的   旧的
			} */

			// 这些是新的
			const query = {
				id
			}
			const insert = {
				// token:p.token,
				// userId:p.userId,
				// status:p.status,
				// list:p.order.list, 
				// id,
				// sysdate: moment().format('YYYY-MM-DD HH:mm:ss')//目的是为了给用户看的
			}
			delete p.status
			const update = {
				status: status,
				token: p.token,
				userId: p.userId,
				list: p.order.list,
				id,
				sysdate: moment().format('YYYY-MM-DD HH:mm:ss') //目的是为了给用户看的
			}
			const options = {
				upsert: true
			}
			const db = client.db('yiwugou') //client.db()不需要await，因为并没有和数据库通信，仅仅是做了一个预先的配置
			// 新创建一张表 order
			// const res = await db.collection('order').insertOne(order)  旧的
			const res = await db.collection("order").updateOne(query, {
				"$setOnInsert": insert, // 当query 没有匹配到时，会执行setOnInsert和$set对应的update的插入动作
				"$set": update // 当query 匹配到时，会执行$set的更新动作
			}, options)


			console.log('创建订单的数据order', res)
			// 判断到底有没有插入
			if (res.upsertedCount === 1) {
				resp.send({
					code: 1,
					msg: '订单创建成功',
					data: {
						id
					}
				})
			} else if (res.modifiedCount === 1) {
				resp.json({
					code: 1,
					msg: "更新成功",
					data: {
						status
					}
				})
			} else {
				resp.send({
					code: 4,
					msg: '订单创建失败',
					data: {}
				})
			}
		} catch (e) {
			resp.send({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}
// 移除已经提交的订单的数据
export const RemoveCart = async (req, resp) => {
	const p = req.body
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const goodsIds = p.cart.reduce((acc, item) => {
				acc.push(item.id) //直接push完之后返回的不是数组
				return acc
			}, [])
			const filter = {
				id: {
					'$in': goodsIds
				},
				userId: p.userId
			}
			//client.db()不需要await，因为并没有和数据库通信，仅仅是做了一个预先的配置
			// 新创建一张表 order
			const res = await db.collection('cart').deleteMany(filter)
			console.log('是否删除成功res', res)
			// 判断到底有没有删除成功
			if (res.deletedCount > 0) {
				resp.send({
					code: 1,
					msg: '删除成功',
					data: {}
				})
			} else {
				resp.send({
					code: 4,
					msg: '删除失败',
					data: {}
				})
			}
		} catch (e) {
			resp.send({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}

// 获取到订单数据
export const getOrder = async (req, resp) => {
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('order').find().toArray()
			resp.send({
				code: 1,
				msg: '成功',
				data: res
			})
		} catch (e) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}

// 创建地址
export const CreateAddress = async (req, resp) => {
	const p = req.body
	console.log('address传过来的数据：', p)
	const list = p.address.list
	console.log('address传过来list的数据：', list)
	const index = p.address.index
	// console.log('address传过来index的数据：',index)
	// p.address.list
	// 创建地址的Id
	// const id = p.id === undefined ? "AD"+Date.now() : p.id
	let id = ''
	let addressList = []
	if (p.address.id === undefined) {
		console.log(11111)
		id = "AD" + Date.now()
		addressList = p.address.list
	} else {
		console.log(2222222)
		id = p.address.id
		addressList = p.address.list
	}

	// const addressList= p.address.list === p.address.list ? ''
	try {
		const client = await Connect()
		try {
			// const address = {
			// 	// ...p.list,//前台传过来的值
			// 	// id:p.address.id,
			// 	list:p.address.list, 
			// 	index,
			// }
			//client.db()不需要await，因为并没有和数据库通信，仅仅是做了一个预先的配置
			const db = client.db('yiwugou')

			// 这些是新的开始
			const query = {
				id
			}
			const insert = {
				index,
			}
			const update = {
				list: addressList,
				id,
			}
			const options = {
				upsert: true
			}
			const res = await db.collection("address").updateOne(query, {
				"$setOnInsert": insert, // 当query 没有匹配到时，会执行setOnInsert和$set对应的update的插入动作
				"$set": update // 当query 匹配到时，会执行$set的更新动作
			}, options)
			console.log('创建地址的数据address', res)
			// 这些是新的结束
			// 这些是旧的开始
			// 新创建一张表 order
			/* const res = await db.collection('address').insertOne(address)
			console.log('创建地址的数据address', res) */
			// 这些是旧的结束			


			// 判断到底有没有插入
			if (res.upsertedCount === 1) {
				resp.send({
					code: 1,
					msg: '地址创建成功',
					data: {
						res,
					}
				})
			} else if (res.modifiedCount === 1) {
				resp.json({
					code: 1,
					msg: "地址更新成功",
					data: {
						res
					}
				})
			} else {
				resp.send({
					code: 4,
					msg: '地址创建失败',
					data: {}
				})
			}
		} catch (e) {
			resp.send({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}
// 获取到地址
export const GetAddress = async (req, resp) => {
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			const res = await db.collection('address').find().toArray()
			resp.send({
				code: 1,
				msg: '成功',
				data: res
			})
		} catch (e) {
			resp.send({
				code: 3,
				msg: "数据查询失败",
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}
// 修改地址
export const ModifyAddress = async (req, resp) => {
	const p = req.body;
	// const file = req.file
	// const { body:p,file } = req
	// console.log(p)
	// console.log(file)
	try {
		const client = await Connect()
		try {
			const db = client.db("yiwugou")
			// const id = p.id === "" ? "GO"+Date.now() : p.id
			const query = {
				id, // 商品id
			}
			const insert = {
				id
			}
			// update
			// delete p.id
			const update = {
				...p,
				// imgpath:file?.path.substring(14),   //  product/1666833643106.png 
			}
			// if(!file){
			//     delete update.imgpath
			// }
			const options = {
				upsert: true
			}
			const res = await db.collection("address").updateOne(query, {
				// "$setOnInsert":insert,    // 当query 没有匹配到时，会执行setOnInsert和$set对应的update的插入动作
				"$set": update // 当query 匹配到时，会执行$set的更新动作
			}, options)
			if (res.upsertedCount === 1) {
				resp.json({
					code: 1,
					msg: "新增成功",
					data: {}
				})
			} else if (res.modifiedCount === 1) {
				resp.json({
					code: 1,
					msg: "更新成功",
					data: {}
				})
			} else {
				resp.json({
					code: 4,
					msg: "操作失败",
					data: {}
				})
			}
		} catch (e) {
			console.log(e)
			resp.send({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}

}
// 删除地址
// 移除已经提交的订单的数据
export const RemoveAddress = async (req, resp) => {
	const p = req.body
	try {
		const client = await Connect()
		try {
			const db = client.db('yiwugou')
			/* 		const goodsIds = p.cart.reduce((acc, item) => {
						acc.push(item.id)//直接push完之后返回的不是数组
						return acc
					}, []) */
			/* 		const filter = {
						id: {
							'$in': goodsIds
						},
						userId:p.userId
					} */
			//client.db()不需要await，因为并没有和数据库通信，仅仅是做了一个预先的配置
			// 新创建一张表 order
			// deleteMany(filter)
			const res = await db.collection('address').deleteOne({
				id: p.id
			})
			console.log('是否删除成功res', res)
			// 判断到底有没有删除成功
			if (res.deletedCount > 0) {
				resp.send({
					code: 1,
					msg: '删除成功',
					data: {}
				})
			} else {
				resp.send({
					code: 4,
					msg: '删除失败',
					data: {}
				})
			}
		} catch (e) {
			resp.send({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}
}


// 跳转到支付页面
export const Payment = async (req, res) => {
	// 前端给后端的数据
	let orderId = req.body.orderId
	let orderData = {}
	// 获取订单数据
	const client = await Connect()
	const db = client.db('yiwugou')
	const resData = await db.collection('order').find().toArray()
	console.log('orderData', resData)
	orderData = resData.find(item => {
		return item.id === orderId
	})
	console.log('orderData的数据', orderData)
	// 对接支付宝
	const formData = new AlipayFormData()
	formData.setMethod('get')
	formData.addField('returnUrl', 'http://127.0.0.1:5173/#/goodstatus');
	// formData.addField('returnUrl', 'https://www.baidu.com');
	formData.addField('bizContent', {
		outTradeNo: orderId, //订单号
		productCode: 'FAST_INSTANT_TRADE_PAY', //销售产品码
		totalAmount: orderData.list[0].delivery * 1 + (orderData.list[0].price[0] * orderData.list[0]
			.count), //金额
		subject: orderData.list[0].shops, //商品标题
		body: orderData.list[0].desc, //商品描述
	});

	const result = alipaySdk.exec(
		'alipay.trade.wap.pay', {}, {
			formData: formData
		},
	);

	result.then(resp => { //后台向前台返回一个链接
		res.send({
			success: 'true',
			code: 200,
			'result': resp
		})
	})
}
// 支付成功或失败界面
export const QueryOrder = (req, res) => {

	let out_trade_no = req.body.out_trade_no
	let trade_no = req.body.trade_no
	console.log('out_trade_no：', out_trade_no)
	console.log('trade_no：', trade_no)
	const formData = new AlipayFormData()
	formData.setMethod('get')
	formData.addField('bizContent', {
		out_trade_no, //订单号
		trade_no //订单流水
	});
	const result = alipaySdk.exec(
		'alipay.trade.query', {}, {
			formData: formData
		},
	);
	console.log('alipaySdk_result', result)
	result.then(resData => { //后台向前台返回一个链接
		axios({
			url: resData,
			method: 'get',
		}).then(data => {
			// console.log('data：',data)
			// res.send({
			// 	data:data.data
			// })

			let r = data.data.alipay_trade_query_response
			console.log('支付成功或失败界面', r)
			if (r.code === '10000') {
				if (r.trade_status === 'TRADE_SUCCESS') {
					res.send({
						success: true,
						code: 200,
						msg: '交易完成',
						send_pay_date: r.send_pay_date
					})
				} else if (r.trade_status === 'TRADE_CLOSED') {
					res.send({
						success: true,
						code: 400,
						msg: '交易关闭，没有支付成功',
						send_pay_date: r.send_pay_date
					})
				}
			} else if (r.code === '40004') {
				res.json('交易不存在')
			}
		}).catch(err => {
			console.log('失败的原因：', err)
			console.log('失败的原因2：', err.message)
			res.json({
				msg: '查询失败',
				err: err.message
			})
		})
	})
}

export const ModifyProduct = async (req, resp) => {
	// console.log('req.body',req.body)
	const {body: p,file} = req
	// console.log('this is p',p)
	console.log("上传图片的file:",file)
	try {
		const client = await Connect()
		try {
			const db = client.db("yiwugou")
			const id = p.id === "" ? "GO" + Date.now() : p.id
			const query = {
				id, // 商品id
			}
			const insert = {
				id
			}
			// update
			delete p.id
			const update = {
				...p,
				imgpath:file.path.substring(12), //  product/1666833643106.png 
			}
			if (!file) {
				delete update.imgpath
			}
			const options = {
				upsert: true
			}
			// const avatarPath = uploadAvatarPath + "avatar/" + file.filename
			// console.log("上传图片后完整的file:",update.imgpath)
			const res = await db.collection("goods").updateOne(query, {
				"$setOnInsert": insert, // 当query 没有匹配到时，会执行setOnInsert和$set对应的update的插入动作
				"$set": update // 当query 匹配到时，会执行$set的更新动作
			}, options)
			if (res.upsertedCount === 1) {
				resp.json({
					code: 1,
					msg: "新增成功",
					data: {}
				})
			} else if (res.modifiedCount === 1) {
				resp.json({
					code: 1,
					msg: "更新成功",
					data: {}
				})
			} else {
				resp.json({
					code: 4,
					msg: "操作失败",
					data: {}
				})
			}
		} catch (e) {
			console.log(e)
			resp.send({
				code: 3,
				msg: e.message,
				data: {}
			})
		} finally {
			client.close()
		}
	} catch (e) {
		resp.send({
			code: 2,
			msg: e.message,
			data: {}
		})
	}

}
