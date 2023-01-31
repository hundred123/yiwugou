<template>
	<div style="background-color: #F7F8FA; height: 100vh;">
		<top-bar style="box-shadow:unset;">
			<template v-slot:left>
				<left-outlined class="left" @click="back" />
			</template>
			<template v-slot:middle>
				<div class="postOrder">收货地址</div>
			</template>
		</top-bar>
		<!-- 地址部分 -->
		<van-address-list 
		v-model="chosenAddressId" 
		:list="addList" 
		default-tag-text="默认" 
		@edit="onEdit" 
		@select="onChecked"/>
		<!-- 尾部 -->
		<div class="footer">
			<button class="btn" @click="goto('/address')">添加收货地址</button>
		</div>
	</div>
</template>

<script setup>
	import {ref,inject,computed,onMounted,nextTick} from 'vue'
	import {useRouter} from 'vue-router'
	import TopBar from '@/components/topbar/TopBar.vue'
	import {LeftOutlined} from '@ant-design/icons-vue'

	import {useState as useAddressState} from '@/store/address.js'
	import {useState} from '@/store/pageDirection.js'
	import { restHttp } from '@/kits/HttpKit.js'
	const router = useRouter()
	const state = useState()
	const message = inject('$message')
	const addressState = useAddressState()
	let chosenAddressId = ref(0);

	// 选中的是哪一个
	const onChecked=(item,index)=>{
		chosenAddressId.value=index
		addressState.setAddressId(index)
	}
	

	
	
	// const goPurchase=()=>{
	// 	state.setDirection("")
	// 	router.push({
	// 		path:'/address',
	// 	})
	// }
	let addressList=[]
	let addList=ref([])
		restHttp('/getaddress').then(res=>{
				res.data.forEach(item=>{
					addressList.push(item.list[0])
			})
				addList.value=addressList.map((item, index) => {
					// console.log(item)
						item.id = index
						item.address = `${item.province},${item.city},${item.county},${item.addressDetail}`
						return item
					})
	 })
	// let list = useAddress.address
	// const list = [
	//   {
	//     id: '1',
	//     name: '张三',
	//     tel: '13000000000',
	//     address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
	//     isDefault: true,
	//   },
	//   {
	//     id: '2',
	//     name: '李四',
	//     tel: '1310000000',
	//     address: '浙江省杭州市拱墅区莫干山路 50 号',
	//   },
	// ];

	const onEdit = (item, index) => {
		state.setDirection("forward")
		router.push({
			path:'/editaddress',
			query:{
				index:index
			}
		})
		// console.log('编辑的内容',item)
		// console.log('编辑的index',index)
	};

	const goto = (path) => {
		state.setDirection("forward")
		router.push({
			path:'/address',
		})
	}
	const back = () => {
		state.setDirection("backward")
		router.go(-1)
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

	:deep(.van-address-list__bottom) {
		display: none;
	}

  :deep(.van-address-item__address){
		font-size: 14px;
		letter-spacing: 1px;
}

	.footer {
		background-color: #FF6C0C;
		width: 100%;
		height: 55px;
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 0;
		right: 0;
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
