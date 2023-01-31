<template>
	<div>
		<top-bar style="box-shadow:unset;">
			<template v-slot:left>
				<left-outlined class="left" @click="back" />
			</template>
			<template v-slot:middle>
				<div class="online_pay">我的订单</div>
			</template>
		</top-bar>
		<!-- nav -->
		<div class="theme-list">
			<div class="fixed-nav">
				<div class="fixed-nav-content">
					<div v-for="(item,index) in theme" :class="['tab-title ',activeId===index&&'select-tab']"
						@click="changeTab(index,$event)">
						<div class="navItem">
							{{item}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 具体商品 -->
		<!-- 全部商品 -->
		<!-- :hasTabBar="false" -->
		<div class="content">
			<div v-if="activeId===0" class="waiteDelivery">
				<div v-for="item in totalData" class="good_items" @click="goto(item._id)">
					<p class="item-shops">{{item.shops}}</p>
					<van-card :thumb="img_url.img + item.imgpath">
						<template #tags>
							<div>
								<van-tag class="card-desc">{{item.desc}}</van-tag>
								<div class="num_price">
									<van-tag class="card-num">数量:{{item.count}}</van-tag>
									<van-tag class="card-price">价格:<span
											style="color: #FF6600; font-size: 15px;">￥{{item.price[0]}}</span></van-tag>
								</div>
								<van-tag class="card-text">
									<van-icon name="logistics" size='20px' />72小时内发货
								</van-tag>
							</div>
						</template>
					</van-card>
					<div class="totalPrice">实付总额：<span style="color: rgb(255, 102, 0);">￥{{totalPrice(item)}}</span>
					</div>
				</div>
			</div>
			<!-- 待付款内容 -->
			<div v-else-if="activeId===1" class="waiteDelivery">
				<div v-for="item in awaitPaidData" class="good_items" @click="goto(item._id)">
					<p class="item-shops">{{item.shops}}
						<span v-if="await_status==='2'">买家已付款</span>
						<span v-else>待付款</span>
					</p>
					<van-card :thumb="img_url.img + item.imgpath">
						<template #tags>
							<div>
								<van-tag class="card-desc">{{item.desc}}</van-tag>
								<div class="num_price">
									<van-tag class="card-num">数量:{{item.count}}</van-tag>
									<van-tag class="card-price">价格:<span
											style="color: #FF6600; font-size: 15px;">￥{{item.price[0]}}</span></van-tag>
								</div>
								<van-tag class="card-text">
									<van-icon name="logistics" size='20px' />72小时内发货
								</van-tag>
							</div>
						</template>
					</van-card>
					<div class="totalPrice">实付总额：<span style="color: rgb(255, 102, 0);">￥{{totalPrice(item)}}</span>
					</div>
				</div>
			</div>
			<!-- 待发货内容 -->
			<div v-else-if="activeId===2" class="waiteDelivery">
				<div v-for="item in deliveryData" class="good_items" @click="goto(item._id)">
					<p class="item-shops">{{item.shops}}
						<span v-if="await_status!=='2'">买家已付款</span>
						<span v-else>待付款</span>
					</p>
					<van-card :thumb="img_url.img + item.imgpath">
						<template #tags>
							<div>
								<van-tag class="card-desc">{{item.desc}}</van-tag>
								<div class="num_price">
									<van-tag class="card-num">数量:{{item.count}}</van-tag>
									<van-tag class="card-price">价格:<span
											style="color: #FF6600; font-size: 15px;">￥{{item.price[0]}}</span></van-tag>
								</div>
								<van-tag class="card-text">
									<van-icon name="logistics" size='20px' />72小时内发货
								</van-tag>
							</div>
						</template>
					</van-card>
					<div class="totalPrice">实付总额：<span style="color: rgb(255, 102, 0);">￥{{totalPrice(item)}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		nextTick
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import TopBar from '@/components/topbar/TopBar.vue'
	import Content from '@/components/content/Content.vue'
	import {
		SearchOutlined,
		LeftOutlined,
		AlipayCircleOutlined
	} from "@ant-design/icons-vue"
	import {
		useState
	} from "@/store/pageDirection"
	import {
		restHttp
	} from '@/kits/HttpKit.js'
	import {
		img_url
	} from '@/kits/ImgKit.js'
	import {
		getItem
	} from '@/kits/LocalStorageKit.js'
	const route = useRoute()
	const router = useRouter()
	const state = useState();
	const theme = ref(['全部', '待付款', '待发货', '待收货', '待评价'])
	const activeId = ref(0)
	let await_status = ref('1')
	let success_status = ref('2')
	// const resData=ref({})
	const deliveryData = ref([])
	const awaitPaidData = ref([])
	const totalData = ref([])
	const total_Data_List = ref([])
	const changeTab = (index, e) => {
		if (index !== activeId.value) {
			activeId.value = index
		}
	}
	// const test= async()=>{
	// 	const await_paid_Data = await restHttp('/getorder')
	// 	console.log('await_paid_Data.code：',await_paid_Data.code)
	// 	if(await_paid_Data.code==1){
	// 		return {
	// 			code: "ok" 
	// 		}
	// 	}
	// }
	// test()
	// let lodingMore = ref(false)
	// const flushed= async ()=>{
	// 	start = parseInt(Math.random() * (50 - 0)) + 0
	// 	const res=await onLoadMore()
	// 	if (res.code === 'ok') {
	// 		return res
	// 		// return {code: 'ok'}
	// 	} else {
	// 		return {
	// 			code: 'fail'
	// 		}
	// 	}
	// }





	// 全部内容开始
	const getTotal = async () => {
		const total_Data = await restHttp('/getorder')
		// total_Data_List.value=total_Data.data
		// let total_Data_list=total_Data.data.filter(item=>{
		// 	status.value='1'
		// 	return item.status==='1'
		// })
		// console.log('total_Data:',total_Data)
		total_Data.data.forEach(item => {
			total_Data_List.value.push(item)
			totalData.value.push(item.list[0])
		})
		// console.log('total_Data_List.value：', total_Data_List.value)
	}
	getTotal()
	// 全部内容结束

	// 待付款的内容开始
	const getAwaitPaid = async () => {
		// return { code: "ok" }
		const await_paid_Data = await restHttp('/getorder')
		let await_paid_list = await_paid_Data.data.filter(item => {
			if (item.status === '1') {
				await_status.value = item.status
			}
			return item.status === '1'
		})
		await_paid_list.forEach(item => {
			awaitPaidData.value.push(item.list[0])
		})

	}
	getAwaitPaid()
	//  待付款的内容结束

	// 待发货的内容开始
	// 每件商品的总价
	const totalPrice = computed(() => {
		return (item) => {
			return (item.count * item.price[0] + item.delivery * 1).toFixed(2)
			// console.log(item)
		}
	})
	const getOrderItem = async () => {
		
		// 获取到所有订单记录
		const orderList1 = await restHttp('/getorder')
		// 找到返回的订单号对应的商品
		let resData1 = orderList1.data.filter(item => {
			return item.id === route.query.out_trade_no
		})
		// 

		// 进行改变订单状态，把订单状态变为 2 
		const token = getItem('token')
		const userId = getItem('userId')
		const p = { //在p中往后台传输数据
			id: route.query.out_trade_no,
			token,
			status: '2',
			order: {
				userId,
				list: resData1[0].list,
				// cart: cartChecked,
			}
		}
		const createorderData = await restHttp('/createorder', p)

		const orderData = await restHttp('/getorder')
		let deliveryList = orderData.data.filter(item => {
			if (item.status === '2') {
				success_status.value = item.status
			}
			return item.status === '2'
		})
		deliveryList.forEach(item => {
			deliveryData.value.push(item.list[0])
		})
		// console.log('this is res',createorderData)
		// orderData.value=resData2[0].list
	}
	// const res =  


	// 过滤出订单状态为 2 的数据 待发货的商品
	/* 	const getDeliveryData=async()=>{
			const orderData = await restHttp('/getorder')
			let deliveryList=orderData.data.filter(item=>{
				return item.status==='2'
			})
			deliveryList.forEach(item=>{
				deliveryData.value.push(item.list[0])
			})
			console.log('deliveryData.value',deliveryData.value)
		} */

	// 提交订单返回的东西
	let data = {
		out_trade_no: route.query.out_trade_no,
		trade_no: route.query.trade_no
	}
	// console.log('返回给支付宝的数据：', data)
	restHttp('/queryorder', data).then(res => {
		// resData.value=res
		if (res.code === 200) {
			activeId.value = 2
			getOrderItem()
		}
		// console.log('支付成功了还是失败了', res)
	})
	const back = () => {
		state.setDirection("backward")
		router.replace('/index/account')
	}
	// getDeliveryData()
	// console.log('当前路径：', route.query.app_id)
	// 判断当前的路径是否有参数
	nextTick(async () => {
		if (!route.query.app_id) {
			const orderData = await restHttp('/getorder')
			let deliveryList = orderData.data.filter(item => {
				success_status.value = '2'
				return item.status === '2'
			})
			deliveryList.forEach(item => {
				deliveryData.value.push(item.list[0])
			})
			// console.log('deliveryData.value',deliveryData.value)
		}
	})
	// 待发货的内容结束
	// 判断传过来的selectId是 待收货 还是 待收款
	if (route.query.selectId === '1') {
		activeId.value = 1
	} else if (route.query.selectId === '2') {
		activeId.value = 2
	}
	// 去订单详情页面
	const goto = (id) => {
		state.setDirection("forward")
		router.push({
			path: '/paysuccess',
			query: {
				id
			}
		})
	}
	// 
</script>

<style scoped>
	.waiteDelivery {
		height: calc(100vh - 90px);
		overflow-y: auto;
		background-color: #eee;
	}

	.good_items {
		padding: 10px 5px 3px 5px;
		margin-bottom: 3px;
		background-color: #fff;
	}

	/* 最顶部 */
	.left {
		color: white;
		font-size: 24px;
		font-weight: bold;
		margin-left: -10px;
		margin-top: 3px;
	}

	.online_pay {
		font-size: 18px;
		color: #F8F3EC;
		margin-top: 3px;
		margin-left: -10px;
	}

	/* nav栏进行切换 */
	.fixed-nav {
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
	}

	.fixed-nav-content {
		display: flex;
		justify-content: space-around;
	}

	.tab-title {
		height: 40px;
		line-height: 40px;
		padding: 0 8px;
		color: rgba(0, 0, 0, .5);
		font-size: 16px;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.select-tab {
		font: size 20px;
		color: #FF6600;
		font-weight: bold;
		border-bottom: 2px solid #FF6600;
	}

	.navItem {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 卡片部分 */
	.van-tag {
		display: block;
		background-color: unset;
		color: unset;
		font-size: unset;
	}

	:deep(.van-card__content) div {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 14px;
	}

	.item-shops {
		display: flex;
		justify-content: space-between;
		color: #6E6EB2;
	}

	.num_price {
		display: flex !important;
		flex-direction: row !important;
		justify-content: flex-start !important;
		align-items: center;
		color: #646566;
	}

	.card-price {
		margin-left: 35px;
	}

	.card-text {
		font-size: 15px;
		color: #5062EC;
	}

	.card-desc {
		color: #646566;
		height: 45px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.totalPrice {
		display: flex;
		justify-content: flex-end;
	}

	.totalPrice {
		color: #646566;
		padding: 10px 3px 0 0;
	}
</style>
