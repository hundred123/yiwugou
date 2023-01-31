import { defineStore } from "pinia"
import {restHttp} from "@/kits/HttpKit.js"
import {getItem} from '@/kits/LocalStorageKit.js'
export const useState = defineStore("cart", {
	state: () => {
		return {
			cart: [], //要想实现实时更新数据 在哪里申明就在哪里使用，不要再定义第三个变量，
			orderID:''
		}
	},
	actions: {
		addCart(p) {//id,desc,count,price,shop,total
		// console.log(p)
			return restHttp("/addcart", p).then(res => {
				// console.log('store中的this.cart',this.cart)
				this.cart.forEach(item => {
					if (item.id === p.good.id&&item.desc===p.good.desc) {
						// console.log('是否相等',1111111)
						if (p.ifIncrease) {
							item.count++
						} else {
							item.count--
						}
					}
				})
				return res
			})
		},
		async getCart(options) {
			try {
				// const res = await gql(p);
				const res =await restHttp('/getcart',options)
				this.cart = res.data.map(item => {//给cart赋值
					item.checked = false
					return item
				})
				return {
					code: 'ok',
					data: res.data,
					msg: ""
				}
			} catch (e) {
				return {
					code: 'failed',
					msg: e.message,
					data: {}
				}
			}
		},
		async createOrder() {
			const token = getItem('token')
			const userId = getItem('userId')
			const cartChecked = this.cart.filter(item => item.checked)
			const p = { //在p中往后台传输数据
				token,
				userId,
				status: '1',
				order: {
					userId,
					list: cartChecked.map(item => {
						delete item.checked
						return item
					}),
					// cart: cartChecked,
				}
			}
			console.log('p.order.list：',p.order.list)
			const res = await restHttp('/createorder', p)
			console.log('创建订单结果-创建订单结果', res)
			this.orderID=res.data.id
			if (res.code === 1) {
				// 如果订单创建成功则调用 移除接口/
				const removeCartRes = await restHttp('/removecart', {
					userId,
					token,
					cart: cartChecked,
				})
				console.log('移除操作-移除操作-移除操作', removeCartRes)
				if (removeCartRes.code === 1) { //如果删除成功
					this.cart = this.cart.filter(item => {
						for (let c of cartChecked) {
							if (item.id === c.id&&item.desc===c.desc) {
								return false
							}
						}
						return true
					})
			
				}
			}
			return res
		}
	},
	getters:{
		totalPrice(){
			return this.cart.filter(item=>{
				return item.checked
			}).reduce((acc,item)=>{
				return acc+parseFloat((item.price[0]*item.count).toFixed(2))
			},0)
		}
	}
})