<template>
<div>
	<top-bar style="box-shadow:unset;">
		<template v-slot:left>
			<left-outlined class="left" @click="back" />
		</template>
		<template v-slot:middle>
			<div class="online_pay">订单详情</div>
		</template>
	</top-bar>
	<!-- 订单信息 -->
	<content :hasTabBar="false" style="background-color: #eee;">
		<div class="orderInfo">
			<p style="margin-bottom: 10px;color: #6D6D6D;font-weight: bold;font-size: 15px;">订单信息</p>
			<div style="border-top: 1px solid rgba(0, 0, 0, 0.1);">
				<div class="order">
					<span>订单编号:{{orderId}}</span>
					<span>订单时间:{{sysdate}}</span>
					<span>订单状态:{{status}}</span>
				</div>
				<div class="price">
					<span>商品总价：<span style="color:#FB625C;">￥{{(totalPrice)}}</span> </span>
					<span>运费：<span style="color:#FB625C;">￥10.00</span></span>
					<span>实付总额：<span style="color:#FB625C;">￥{{reralPrice}}</span></span>
				</div>
			</div>
			<div class="pay-success" v-if="status==='交易成功，等待发货'">
				<span>交易成功</span>
			</div>
			<div class="await-pay" v-if="status==='未付款，待支付'">
				<span @click="goto">立即支付</span>
			</div>
		</div>
			<!-- 具体商品 -->
			<div v-for="item in goodData"  class="good_items" @click="gotoDetail(item)">
				<p class="item-shops">商品信息</p>
				<van-card 
				:thumb="img_url.img + item.imgpath" >
				<template #tags>
					<div>
						<van-tag class="card-desc">{{item.desc}}</van-tag>
						<div class="num_price">
							<van-tag class="card-num">数量:{{item.count}}</van-tag>
							<van-tag class="card-price">价格:<span style="color: #FF6600; font-size: 15px;">￥{{item.price[0]}}</span></van-tag>
						</div>
						<van-tag class="card-text">
							<van-icon name="logistics" size='20px'/>72小时内发货
						</van-tag>
					</div>
				</template>
				</van-card>
			</div>
	</content>
</div>
</template>

<script setup>
	import {ref,onMounted} from 'vue'
	import {useRoute,useRouter} from 'vue-router'
	import TopBar from '@/components/topbar/TopBar.vue'
	import Content from '@/components/content/Content.vue'
	import {SearchOutlined,LeftOutlined,AlipayCircleOutlined} from "@ant-design/icons-vue"
	import {restHttp} from '@/kits/HttpKit.js'
	import {img_url} from '@/kits/ImgKit.js'
	import {useState} from "@/store/pageDirection"
	const state = useState();
	const orderDetail = ref({})
	const orderId = ref('')
	const sysdate = ref('')
	const status = ref('')
	const totalPrice = ref(0)
	const reralPrice = ref(0)
	const goodData = ref([])
	const route = useRoute()
	const router = useRouter()
	const getGoodDetail = async () => {
		const orderData = await restHttp('/getorder')
		let order_list = orderData.data.filter(item => {
			if (item.list[0]._id === route.query.id) {
				orderId.value = item.id
				sysdate.value = item.sysdate
				orderDetail.value = item.list[0]
				totalPrice.value = (item.list[0].count * item.list[0].price[0]).toFixed(2)
				reralPrice.value = (item.list[0].count * item.list[0].price[0] + item.list[0].delivery * 1)
					.toFixed(2)
				if (item.status === '2') {
					status.value = '交易成功，等待发货'
				} else {
					status.value = '未付款，待支付'
				}
			}
		})
		// await_paid_list.forEach(item=>{
		// 	awaitPaidData.value.push(item.list[0])
		// })
	}
// 获取到具体的商品开始
	const getGoodItem = async()=>{
		const orderData = await restHttp('/getorder')
		let good_list=orderData.data.filter(item=>{
			return item.list[0]._id===route.query.id
			// return item._id===route.query.id
			
			/* if(item.status==='1'){
				await_status.value=item.status
			}
			return item.status==='1' */
		})
		// console.log('route.query.id',route.query.id)
		// console.log('good_list',good_list)
		good_list.forEach(item=>{
			goodData.value.push(item.list[0])
		})
	}
// 获取到具体的商品结束
// 跳转到支付界面
	const goto=()=>{
		router.push({
			path:'/paymethods',
			query:{
				price:10,
				totalPrice:totalPrice.value,
				orderId:orderId.value
			}
		})
	}
	// 去商品详情也
	const gotoDetail=(item)=>{
		// console.log(item)
		state.setDirection("forward")
		router.push({
			path:'/gooddetail',
			query:{
				name:item.desc,
				id:item.id
			}
		})
	}
	const back = () => {
		state.setDirection("backward")
		router.go(-1)
	}
	onMounted(()=>{
		getGoodDetail()
		getGoodItem()
	})
</script>

<style scoped>
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

	.orderInfo {
		padding: 10px;
		background-color: #fff;
	}

	.order {
		padding: 5px 0 6px 0;
		display: flex;
		flex-direction: column;
		color: #B8B8B8;
	}

	.price {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-bottom: 4px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		color: #828282;
	}

	.pay-success {
		display: flex;
	}

	.pay-success span {
		display: block;
		width: 100px;
		height: 30px;
		line-height: 30px;
		margin-top: 10px;
		text-align: center;
		font-size: 13px;
		border-radius: 3px;
		background-color: #31C445;
		color: #fff;
	}
	.await-pay{
		display: flex;
		justify-content: flex-end;
	}
	.await-pay span {
		display: block;
		width: 100px;
		height: 30px;
		line-height: 30px;
		margin-top: 10px;
		text-align: center;
		font-size: 13px;
		border-radius: 3px;
		background-color: #FB625C;
		color: #fff;
	}
	/* 卡片部分 */
	.good_items{
		margin-top: 8px;
		padding: 10px;
		padding-bottom: 15px;
		background-color: #fff
	}
	.van-tag{
		display: block;
		background-color: unset;
		color: unset;
		font-size: unset;
	}
	:deep(.van-card__content) div{
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 14px;
	}
	.item-shops{
		display: flex;
		justify-content: space-between;
		color: #6D6D6D;
		font-size: 15px;
		font-weight: bold;
		padding-bottom: 8px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	.num_price{
		display: flex !important;
		flex-direction: row !important;
		justify-content: flex-start !important;
		align-items: center;
		color: #646566;
	}
	.card-price{
		margin-left: 35px;
	}
	.card-text{
		font-size: 15px;
		color: #5062EC;
	}
	.card-desc{
		color: #646566;
		height: 45px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.totalPrice{
		display: flex;
		justify-content: flex-end;
	}
	.totalPrice{
		color: #646566;
		padding: 10px 3px 0 0;
	}
</style>
