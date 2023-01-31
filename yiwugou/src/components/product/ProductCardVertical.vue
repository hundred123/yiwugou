<template>
	<div class="product_cart" @click="gotoDetail(product.desc,product.id)">
		<div class="product-img" :style="imgStyle"></div>
		<div class="product-content">
			<div class="product-desc">{{product.desc}}</div>
			<div style="display: flex;justify-content: space-between;">
				<span style="color: #CE242F;font-size: 18px;">￥{{product.price[0]}}</span>
				<span style="color: #C2C2C2;font-size: 13px; align-self: center;">成交{{product.total}}+件</span>
			</div>
			<div class="shopName">{{product.shops}}</div>
		</div>
	</div>
</template>

<script setup>
	import {computed} from 'vue'
	import {useRouter} from 'vue-router'
	import {useStore} from 'vuex'

	import {useState} from '@/store/pageDirection.js'
	import {defaultPath} from '@/config/index.js'

	const state = useState()
	const router = useRouter()
	// 因为这是一个组件,需要researchresult组件把值(item)传过来
	const props = defineProps({
		product: Object
	})
	// console.log('发过来的数据：',props.product)
	const imgStyle = computed(() => {
		return {
			backgroundImage: `url(${defaultPath+props.product.imgpath})`,
			backgroundSize: "cover"
		}
	})
	// 进行页面跳转
	// const goto = () => {
	// 	console.log(props.product)
	// 	state.setDirection('forward')
	// 	router.push({
	// 		name: 'GoodDetail',
	// 		params: {
	// 			id: props.product.id,
	// 			type: props.product.type.id
	// 		}
	// 	})
	// }
	const gotoDetail = (name,id)=>{
	    state.setDirection("forward")
	    router.push({
	        path: '/gooddetail',
	        query: {
	            name,
	            id
	        }
	    })
	}
</script>

<style scoped>
	.product_cart {
		width: 187px;
		height: 240px;
		/* background-color: #e5e5e5; */
		border-radius: 5px;
		margin-top: 5px;
		box-shadow: 0 1px 8px #F9F9F9;
	}

	.product-img {
		height: 175px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	.product-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(240px - 175px);
		background-color: #fff;
		padding: 2px 8px;
		box-sizing: border-box;
	}
	.product-desc{
		font-size: 14px;
		font-weight: bolder;
		color: #2C2825;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.shopName{
		color: #2C2825;
		font-size: 12px;
		white-space: nowrap;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
