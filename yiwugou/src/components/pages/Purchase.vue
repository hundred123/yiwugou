<template>
<div>
	<div>
		<top-bar style="box-shadow:unset;">
			<template v-slot:left>
				<left-outlined class="left" @click="back" />
			</template>
			<template v-slot:middle>
				<div class="postOrder">提交订单</div>
			</template>
		</top-bar>
	</div>
	<!-- 收货地址 -->
	<div class="addressPage">
		<!-- <div v-if="addressState.address.length>0"> -->
		<div v-if="addArray.length>0">
			<div class="addRess">
				<!-- <div class="receiver">
					<span>收货人：{{fistAddress.name}}</span>
					<span>{{fistAddress.tel}}</span>
				</div>
				<div class="area">
					<span>{{fistAddress.province}},{{fistAddress.city}},{{fistAddress.county}}</span>
					<span style="font-size: 18px;" @click="goto('/goodsaddress')">
						<right-outlined />
					</span>
				</div>
				<div class="detailAddress">
					{{fistAddress.addressDetail}}
				</div> -->
				
				<!-- <div v-for="fistAddress in addressState.address[0]"> -->
					<div class="receiver">
						<span>收货人：{{addArray[addressState.addressId].list[0].name}}</span>
						<span>{{addArray[addressState.addressId].list[0].tel}}</span>
					</div>
					<div class="area">
						<span>{{addArray[addressState.addressId].list[0].province}},{{addArray[addressState.addressId].list[0].city}},{{addArray[addressState.addressId].list[0].county}}</span>
						<span style="font-size: 18px;" @click="goto('/goodsaddress')">
							<right-outlined />
						</span>
					</div>
					<div class="detailAddress">
						{{addArray[addressState.addressId].list[0].addressDetail}}
					</div>
				<!-- </div> -->
			</div>
		</div>
		<div v-else @click="gotoAddress" class="noAddRess">
			<span>您还没有设置收货地址，去设置</span>
		</div>
		<!-- 物品 -->
		<div v-for="item in cartChecked" @click="gotoDetail(item)">
			<p class="item-shops">{{item.shops}}</p>
			<van-card :num="item.count" :desc="item.desc" :price="item.price[0]" :thumb="img_url.img + item.imgpath" />
			<div class="item-total">
				<div class="item-delivery">运费：{{item.delivery}}元</div>
				<div>
					共{{item.count}}件商品 小计(不含运费)：<span style="color: #CF6460;">￥{{total(item)}}</span>
				</div>
			</div>
		</div>
		<div class="delivery">
			<div>运费合计</div>
			<div><span style="color: #FF6C0C;">￥{{delivery}}元</span></div>
		</div>
	</div>
	
	<div class="footer">
		<div class="footer-total">
			实付款:￥<span style="color: #FF6C0C;">{{(delivery + cartState.totalPrice).toFixed(2)}}</span>
		</div>
		<button class="btn" @click="buy">提交订单</button>
	</div>

</div>
</template>

<script setup>
	import {ref,computed,inject} from 'vue'
	import {useRouter,useRoute} from 'vue-router'
	import TopBar from '@/components/topbar/TopBar.vue'
	import {SearchOutlined,LeftOutlined,RightOutlined} from "@ant-design/icons-vue"
	import {img_url} from '@/kits/ImgKit.js'
	import {useState} from '@/store/pageDirection.js'
	import {useState as useAddressState} from '@/store/address.js'
	import { restHttp } from '@/kits/HttpKit.js'
	import {useState as useCartState} from '@/store/cart.js'
	import {useState as useOrderGoodsState} from '@/store/orderGoods.js'
	const state = useState()
	const router = useRouter()
	const route = useRoute()
	const addressList = ref([])
	const addressState = useAddressState()
	const cartState = useCartState()
	const OrderGoodsState = useOrderGoodsState()
	const message=inject('$message')
	// console.log('cartState.orderID在购买页面：',cartState.orderID)
	// 存放地址数据
	const addArray=ref([])
	// let index=ref(addressIndex)
	// index=addressState
	//获取地址
	 restHttp('/getaddress').then(res=>{
		 addArray.value=res.data
	 })
	 // addArray.value=res.data
	 // if(res.code===1){
	 // 	message.success(res.msg)
	 // }else if(res.code===4){
	 // 	message.warning(res.msg)
	 // }
/*  */
		
	const gotoAddress = () => {
		state.setDirection("forward")
		router.push({
			path: '/address'
		})
	}
	// 选中的地址编号
	// let addressIndex=route.query===''?0:route.query.index*1
	// let addressIndex=addressState.address.length===1?0:route.query.index*1
	// console.log('route.query.index:',typeof (route.query.index*1))
	// 跳转页面
	const goto = (path) => {
	    state.setDirection("forward")
	    router.push({
	        path
	    })
	}
	// 没有收获地址，第一次设置完收货地址
	// const fistAddress = ref(addressState.address[0])
	// 对已经选中的商品进行遍历
	let cartChecked = ref(cartState.cart.filter(item => item.checked))
	// 向pinia中添加订单商品信息
	cartChecked.value.forEach(item=>{
		OrderGoodsState.setOrderGoods(item)
	})
	const back = () => {
		state.setDirection("backward")
		router.back({
			path:'/shopcart'
		})
		// router.go(-2)
	}
	const total = computed(() => {
		return function(item) {
			return (item.count * item.price[0]).toFixed(2)
		}
	})
	let sum=null
	let totalPrice=cartState.totalPrice
	const delivery = computed(() => {
		sum = cartChecked.value.reduce((acc, item) => {
			acc += (item.delivery * 1)
			return acc
		}, 0)
		return sum
	})

	
	
	// 提交订单
	const buy=async ()=>{
		// 订单数据结构
		// 主表:id sysdata时间戳 status状态 userId
		// 子表:subId mainId(主表id) goodId price count imgpath name
		// 文本型数据库
		if(addArray.value.length<=0){
			message.warning('请先去设置地址！！！')
			return
		}
		try{
			const res=await cartState.createOrder()
			if(res.code===1){
				message.success(res.msg)
				router.push({
					path:'/paymethods',
					query:{
						price:sum,
						totalPrice:totalPrice,
					}
				})
			}else{
				message.error(res.msg)
			}
		}catch(e){
			message.error(e.message)
		}
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
</script>

<style scoped>
	.left {
		color: white;
		font-size: 24px;
		font-weight: bold;
		margin-left: -10px;
		margin-top: 3px;
	}

	.postOrder {
		font-size: 18px;
		color: #F8F3EC;
		margin-top: 3px;
		margin-left: -10px;
	}
	.addressPage{
		/* height: calc(100vh - 55px - 50px - 20px); */
		/* background-color: pink; */
	}
	
	.addRess {
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		/* background-color: pink; */
		padding: 0 20px;
		color: rgba(0, 0, 0, .7);
		margin-top: 5px;
		font-size: 15px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	}

	.noAddRess {
		height: 100px;
		line-height: 100px;
		text-align: center;
		font-size: 15px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	}

	.receiver {
		display: flex;
		justify-content: space-between;
	}

	.area {
		display: flex;
		justify-content: space-between;
	}

	.item-shops {
		margin: 10px;
	}

	.item-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding: 10px 10px;
		background-color: #fff;
		box-shadow: 0px 2px 8px rgb(0 0 0 / 0.2);
	}

	.delivery {
		height: 20px;
		display: flex;
		justify-content: space-between;
		padding: 20px 10px;
	}
	.footer {
		background-color: #F3F4F4;
		width: 100%;
		height: 55px;
		display: flex;
		justify-content: flex-end;
		position: fixed;
		bottom: 0;
		right: 0;
	}
	.footer-total {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.btn {
		width: 120px;
		height: 55px;
		border: 0;
		background-color: #FF6C0C;
		font-size: 16px;
		color: #fff;
	}
</style>
