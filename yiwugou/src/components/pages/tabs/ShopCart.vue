<template>
	<Content :hasTabBar="false" :pull="false" :refreshFunc="fetchData" style="padding:0">
		<div v-if="loginStatus">
			<div v-if="cartState.cart.length>0">
				<topBar class="topbar">
					<template v-slot:left>
						<h1 class="title-goods">购物车</h1>
					</template>
					<template v-slot:middle>
						<div></div>
					</template>
					<template v-slot:right>
						<span class="title-right-goods" @click="manage">{{manageText}}</span>
					</template>
				</topBar>
				<!-- <div class="content" v-if="goods"> -->
				<div class="content" v-if="cartState.cart.length>0">
					<div class="product-title">共{{cartState.cart.length}}件商品</div>
					<div class="out-product-edit">
						<div class="product-edit" v-for="(item) in cartState.cart">
							<product-edit :product='item'></product-edit>
						</div>
					</div>


					<div class="footer-bar" v-if="manageText==='管理'">
						<div class="footer-left">
							<div class="wrapper-cb">
								<div class="diy-cb">
									<input id="id" type="checkbox" class="cb" v-model="flag" @click="onCheckAllChange" />
									<label for="id"></label>
								</div>
							</div>
							<div class="footer-checkbox-all">全选</div>
						</div>
						<div class="footer-right">
							<div class="footer-total">
								<div>合计:<span style="color: #CF6460;">￥{{cartState.totalPrice}}</span></div>
								<!-- <div>邮费另算</div> -->
							</div>
							<a-button block type="primary" @click="gotoPurchase('/purchase')">结算</a-button>
						</div>
					</div>
					<!-- 进行删除 -->
					<div class="footer-bar" v-else>
						<div class="footer-left">
							<div class="wrapper-cb">
								<div class="diy-cb">
									<input id="id" type="checkbox" class="cb" v-model="flag" @click="onCheckAllChange" />
									<label for="id"></label>
								</div>
							</div>
							<div class="footer-checkbox-all">全选</div>
						</div>
						<div class="footer-right">
							<a-button block type="primary" @click="deleteGoods">删除</a-button>
						</div>
					</div>

				</div>
			</div>

			<div v-else>
				<topBar>
					<template v-slot:left>
						<h1 class="title">购物车</h1>
					</template>
					<template v-slot:middle>
						<div></div>
					</template>
					<template v-slot:right>
						<span class="tab-right">管理</span>
					</template>
				</topBar>
				<div class="content">
					<a-empty image="src\assets\imgs\tu1.jpg" :image-style="{
                                height:'100px',
                                }">
						<template #description>
							<span>购物车是空的，去逛逛吧！</span>
						</template>
					</a-empty>
				</div>
			</div>

		</div>
		<div v-else>
			<top-bar>
				<template v-slot:left>
					<div></div>
				</template>
				<template v-slot:middle>
					<div style="color:#fff;text-align: center;font-size: 20px;">购物车</div>
				</template>
				<template v-slot:right>
					<div></div>
				</template>
			</top-bar>
			<Content>
				<div class="content-second">
					<a-empty image="src\assets\imgs\tu1.jpg" :image-style="{
                    height: '100px',
                    }">
						<template #description>
							<span>您还没有登录账号呢</span>
						</template>
						<a-button type="primary" @click="goto('/login')" size="small" style="width: 130px;" block>登录
						</a-button>
					</a-empty>
				</div>
			</Content>
		</div>
	</Content>
</template>
<script setup>
	import {ref,inject,onMounted,computed,watch} from 'vue'
	import {useRouter} from "vue-router"
	import Content from '@/components/content/Content.vue'
	import TopBar from '@/components/topbar/TopBar.vue'
	import ProductEdit from '@/components/product/ProductEdit.vue'
	import {HeartOutlined} from '@ant-design/icons-vue'
	import {useState as useCartState} from "@/store/cart"
	import {getItem} from "@/kits/LocalStorageKit"
	import {restHttp} from '@/kits/HttpKit.js'
	import {useState} from '@/store/pageDirection.js'
	
	const router = useRouter()
	const cartState = useCartState()
	const state = useState()
	const message = inject('$message')
	const userId = getItem("userId")
	const token = getItem("token")
	const totalData = ref([])	
	let manageText=ref('管理')
	let flag=ref(false)
	const initData = async () => {
		const options = {
			userId,
			token
		}
		const res = await cartState.getCart(options)
		// console.log('#############################',res.data)
		totalData.value = res.data
		return res.data
	}

	const goods = ref(true)
	const loginStatus = ref((getItem("token") && getItem("token") !== "") ? true : false)
	const goto = (path) => {
		state.setDirection("forward")
		router.push({
			path
		})
	}
	const gotoPurchase = (path) => {
		if(cartState.cart.filter(item => item.checked).length<=0){
			message.warning('您还没选中商品呢！！！')
			return
		}
			state.setDirection("forward")
			router.push({
				path
			})
		
	}
	const fetchData = async () => {
		return {
			code: "ok"
		}
	}
	// watch(()=>{cartState.cart[0]},()=>{
	// 	console.log(111)
	// },{deep:true})
	// console.log(cartState.cart)
	// flag.value=cartState.cart.every(item=>{
	// 	 item.checked===true
	// })
	
	// cartState.cart.forEach(item=>{
	// 	console.log(333)
	// 	watch(item.checked,()=>{
	// 		if(item.checked){
	// 			console.log(111)
	// 		}else{
	// 			console.log(222)
	// 		}
	// 	})
	// 	// item.checked=true
	// })

	
	
	
	const onCheckAllChange = () => {
		// console.log(flag.value)
		if(flag.value){
				cartState.cart.forEach(item=>{
				item.checked=false
			})
			flag.value=true
		}else{
			cartState.cart.forEach(item=>{
				item.checked=true
			})
			flag.value=false
		}
	}
	let manageFlag=true
	// 点击管理之后
	const manage=()=>{
		if(manageFlag){
			manageText.value='管理'
			manageFlag=false
		}else{
			manageText.value='完成'
			manageFlag=true
		}
	}
	// 进行删除
	const deleteGoods=async()=>{
		const cartChecked = cartState.cart.filter(item => item.checked)
		const removeCartRes = await restHttp('/removecart', {
			userId,
			token,
			cart: cartChecked
		})
		cartState.cart.forEach((item,index)=>{
			if(item.checked){
				cartState.cart.splice(index,cartChecked.length)
			}
		})
		// cartState.cart.filter(item =>delete )
		console.log('removeCartRes',removeCartRes)
	}
	
	onMounted(() => {
		initData()
	})
</script>
<style scoped>
	.body {
		padding: 0;
	}

	.topbar {
		position: relative;
		background-color: #FE770B;
		height: 200px;
	}

	.title-goods {
		position: absolute;
		top: 20px;
		left: 12px;
		font-size: 22px;
		color: #fff;
	}

	.title-right-goods {
		position: absolute;
		top: 20px;
		right: 12px;
		font-size: 16px;
		color: #fff;
	}

	.product-title {
		transform: translateY(-134px);
		padding-left: 13px;
		/* transform: translateX(26px); */
		/* position: fixed;
		top: 65px;
		left: 13px; */
		font-size: 16px;
		color: #fff;
	}

	/* product-edit */
	.out-product-edit {
		/* position: sticky; */
		/* position: absolute;
	top: 50px;
	left: 5px; */
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.product-edit {
		padding: 8px 0;
		transform: translateY(-66px);
	}

	.title {
		font-weight: bold;
		font-size: 18px;
		color: #fff;
		padding-top: 14px;
		box-sizing: border-box;
		margin-left: 4px;
	}

	.tab-right {
		font-size: 14px;
		color: #fff;
	}

	.top-bar {
		border: 0;
		margin: 0;
	}

	.content {
		padding: 0px;
	}

	.content-first {
		border: unset;
		padding: 0;
		color: #fff;
		background-color: #FE6500;
		height: 100px;
		border: unset;
		margin: 0;
	}

	.content-second {
		position: relative;
		top: 30%;
	}

	content-second button {
		border-radius: 20px;
	}
	.footer-bar {
	    width: 100%;
	    bottom: 58px;
	    position: fixed;
	    height: 55px;
	    border-top: 1px solid rgb(0 0 0 / 0.1);
	    display: flex;
	    justify-content: space-between;
			background-color: white;
	}
	.footer-left{
	   display: flex;
	}
	.footer-checkbox-all{
	    height: 55px;
	    line-height: 55px;
	}
	.footer-right{
	    display: flex;
	}
	.footer-total{
	    display: flex;
	    flex-direction: column;
			align-items: center;
			justify-content: center;
	    margin-right: 10px;
	}
	.footer-right button {
	    margin: 0;
	    width: 100px;
	    height: 55px;
	    text-align: center;
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
</style>
