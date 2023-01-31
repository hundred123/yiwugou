<template>
	<div class="content">
		<!-- 顶部导航栏 -->
		<top-bar style="box-shadow:unset;">
			<template v-slot:left>
				<left-outlined class="left" @click="back" />
			</template>
			<template v-slot:middle>
				<div class="online_pay">在线支付</div>
			</template>
		</top-bar>
		<!-- 义乌购在线支付 -->
		<p class="box payText">义乌购在线商品支付</p>
		<!-- 支付金额 -->
		<p class="box"><span class="payMoney">支付金额</span><span class="payText">{{price}}元</span></p>
		<p style="padding: 8px 8px;color: #929292; margin: 0; background-color: #F6F6F6;">选择支付方式</p>
		<div class="box aliPay">
			<div class="wrapper-cb">
				<div class="diy-cb">
					<input :id="id" type="checkbox" class="cb"  v-model="checked"/>
					<label :for="id"></label>
				</div>
			</div>
			<p style="display: flex;">
				<span class="aliIcon"><alipay-circle-outlined /></span>
				<span style="color: #929292;">支付宝</span>
			</p>
		</div>
		
		<!-- 确认支付 -->
		<button class="confirm" @click="confirm">确认支付</button>
	</div>
</template>

<script setup>
import{ref,inject,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {restHttp} from '@/kits/HttpKit.js'
import TopBar from '@/components/topbar/TopBar.vue'
import {SearchOutlined,LeftOutlined,AlipayCircleOutlined} from "@ant-design/icons-vue"
import {useState as useCartState} from '@/store/cart.js'
import {useState as useOrderGoodsState} from '@/store/orderGoods.js'
const cartState=useCartState()
const OrderGoodsState = useOrderGoodsState()
const router=useRouter()
const route=useRoute()
const delivery=route.query.price*1
const totalPrice=(route.query.totalPrice*1+route.query.price*1).toFixed(2)
const price=ref(totalPrice)
const id = "cart-cb-" + 1 //复选框的id
let checked=ref(true)
const message=inject('$message')
// 获取订单号
let orderNumbers=[]
const getOrder= async ()=>{
const res=await restHttp('/getorder')
// console.log('resressre',res)
OrderGoodsState.orderGoods.forEach(good=>{
		res.data.forEach(item=>{
			if(item.list[0].desc===good.desc&&item.list[0].id==good.id){
				orderNumbers.push(item)
			}
		})
	})
}
// console.log('orderNumbers',orderNumbers[0])
// orderNumbers[0]
// console.log('cartState.orderID：',cartState.orderID)
const options={
	orderId:cartState.orderID||route.query.orderId
}
const confirm=async ()=>{
	if(checked.value){
		const res=await restHttp('/payment',options)
		// console.log('返回的链接：',res)
		window.location.href=res.result
	// 	.then(res=>{
	// 		window.location.href=res.result
	// 		console.log(res)
	// })
		// message.success('支付成功')
		OrderGoodsState.orderGoods=[]
	}else{
		message.warning('请选择支付方式')
	}
}
	const back=()=>{
		router.go(-1)
	}
	onMounted(()=>{
		getOrder()
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
	.box{
		margin: 0;
		height: 50px;
		line-height: 50px;
		padding: 0 8px;
		box-shadow: 0px 0px 1px rgba(0, 0, 0, .2);
		font-size: 18px;
		/* font-weight: bold; */
		letter-spacing: 1px;
	}
	.payText{
		color: #F6843B;
	}
	.payMoney{
		font-size: 17px;
		color: #929292;
		padding-right: 5px;
	}
	/* 复选框 */
	.wrapper-cb {
		width: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.cb {
		visibility: hidden;
		width: 0;
		height: 0;
	}
	
	.diy-cb {
		position: relative;
		width: 25px;
		height: 25px;
		border-radius: 50%;
	}
	
	.diy-cb label::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		border: 1px solid #FE6500;
	}
	
	.diy-cb input[type='checkbox']:checked+label::after {
		content: "✓";
		position: absolute;
		top: 0;
		left: 0;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		border: 1px solid #FE6500;
		color: white;
		background-color: #FE6500;
		line-height: 25px;
		text-align: center;
	}
	
	.aliPay{
		display: flex;
	}
	.aliIcon{
		font-size: 35px;
		line-height: 55px;
		margin-right: 10px;
		color: #1776FE;
		margin-left: 8px;
	}
	/* 确认支付 */
	.confirm{
		width: 100%;
		height: 55px;
		border: unset;
		background-color: #FF6C0C;
		font-size: 16px;
		color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
	}

</style>