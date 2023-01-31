<script setup>
	import {computed,inject} from 'vue'
	import {useRouter} from 'vue-router'
	import {RightOutlined} from '@ant-design/icons-vue'
	import {watch} from 'vue'
	import {useState} from '@/store/pageDirection.js'
	import {useState as useCartState} from '@/store/cart.js'
	import {getItem,clearItem} from '@/kits/LocalStorageKit.js'
	import {img_url} from '@/kits/ImgKit.js'
	const cartState = useCartState()
	const state = useState()
	const token = getItem('token')
	const userId = getItem('userId')
	const router =useRouter()
	const message=inject('$message')
	const props = defineProps({
		product: Object
	})
	const id = "cart-cb-" + props.product._id //复选框的id
	
	
	const increase=()=>{
		if(props.product.count==9){
			message.warning('最多只能买9个')
			return 
		}
		cartState.addCart({
			token,
			userId,
			ifIncrease:true,
			good:props.product
		}).then(res=>{
			if(res.code!==1){
				message.warning('更新失败',res.message)
			}
		})
	}
	const decrease=()=>{
		if(props.product.count<2){
			message.warning('最少订购一件')
			props.product.count=1
		}else{
			cartState.addCart({
				token,
				userId,
				ifIncrease:false,
				good:props.product
			})
		}
		
	}
	// 去商品详情页
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
<template>
	<div class="product-edit">
		<div class="wrapper-cb">
			<div class="diy-cb">
				<input :id="id" type="checkbox" class="cb" v-model="product.checked" />
				<label :for="id"></label>
			</div>
		</div>

		<div class="wrapper-right">
			<div @click="gotoDetail(product)">
				<span class="iconfont icon-shangpu"></span>
				<span class="wrapper-shop">{{product.shops}}</span>
				<right-outlined style="color: #AEAEAE;" />
			</div>
			<div class="wrapper-content">
				<div class="wrapper-content-left" @click="gotoDetail(product)">
					<img :src='img_url.img+product.imgpath' />
				</div>
				<div class="wrapper-content-right">
					<div class="wrapper-content-title" @click="gotoDetail(product)">
						{{product.desc}}
					</div>
					<!-- <div class="wrapper-content-desc">1#赫本风蝴蝶 银针</div> -->
					<div class="wrapper-price-count">
						<div class="wrapper-price">￥{{product.price[0]}}</div>
						<div class="wrapper-count">
								<div class="btn decrease" @click="decrease">-</div>
							<div class="num">{{product.count}}</div>
							<div class="btn increase" style="border-left:1px solid #aeaeae;" @click="increase">+</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.product-edit {
		width: 370px;
		height: 210px;
		background-color: #fff;
		box-shadow: 0px 2px 8px rgb(0 0 0 / 0.3);
		border-radius: 15px;
		display: flex;
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


	.wrapper-right {
		margin-top: 5px;
	}

	.wrapper-right .iconfont {
		font-size: 23px;
		color: #aeaeae;
		margin-right: 10px;
	}

	.wrapper-shop {
		font-size: 16px;
		margin-right: 10px;
		color: #696969;
	}

	.wrapper-content {
		display: flex;
		height: 140px;
	}

	.wrapper-content-left {
		width: 130px;
		margin-top: 10px;
		background-color: #aeaeae;
		border-radius: 10px;
	}

	.wrapper-content-left img {
		width: 100%;
		height: 100%;
	}

	.wrapper-content-right {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 175px;
		margin-top: 15px;
		margin-left: 8px;

	}

	.wrapper-content-title {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.wrapper-content-desc {
		color: #797778;
		margin-top: 10px;
	}

	.wrapper-price-count {
		display: flex;
		justify-content: space-between;
		margin: 10px 0px;
	}

	.wrapper-price {
		height: 30px;
		line-height: 30px;
	}

	.wrapper-count {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #aeaeae;
		border-radius: 3px;
	}

	.btn {
		width: 30px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		color: #DAD8D9;
		font-size: 30px;
		font-weight: 200;
		background-color: #F9F7F8;
	}

	.decrease {
		line-height: 26px;
		border-right: 1px solid #aeaeae;
	}

	.num {
		width: 60px;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
</style>
