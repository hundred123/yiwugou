import {defineStore} from 'pinia'
import {restHttp} from "@/kits/HttpKit.js"
import {nanoid} from 'nanoid'
let newAddress=[]
export const useState = defineStore('address', {
	state: () => ({
		address: [],
		addressId:0,
		addressID:undefined,
		
	}),
	actions: {
		setAddress(newVal) {
			// console.log("setAddress : ",newVal)
			// console.log(nanoid())
			newAddress.push(newVal)
			this.address.push(newVal)
		},
		setAddressId(newVal) {
			this.addressId=newVal
		},
		setAddressID(newVal) {
			this.addressID=newVal===''?undefined:newVal
		},
		
		async createAddress() {
			const p = { //在p中往后台传输数据
				// id:nanoid(),
				address: {
					// id:this.addressID,
					index:this.addressId,
					list: newAddress
				}
			}
		// 	console.log('p.order.list：',p.order.list)
			const res = await restHttp('/createaddress', p)
			// console.log('创建地址结果-创建地址结果', res)
		// 	if (res.code === 1) {
		// 		// 如果订单创建成功则调用 移除接口
		newAddress=[]
			return res
		}
		
		
	}
})
