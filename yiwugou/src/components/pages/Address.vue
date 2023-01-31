<template>
	<div>
		<top-bar style="box-shadow:unset;">
			<template v-slot:left>
				<left-outlined class="left" @click="back"/>
			</template>
			<template v-slot:middle>
				<div class="addAddress">添加收货地址</div>
			</template>
		</top-bar>
		  <!-- show-set-default -->
		<van-address-edit
		  :area-list="areaList"
		  show-search-result
		  :search-result="searchResult"
		  :area-columns-placeholder="['请选择', '请选择', '请选择']"
		  @save="onSave"
		  @change-detail="onChangeDetail"
		/>
	</div>

</template>

<script setup>
	import {ref,inject} from 'vue'
	import TopBar from '@/components/topbar/TopBar.vue'
	import { Toast } from 'vant';
	import {useState} from '@/store/pageDirection.js'
	import {LeftOutlined} from "@ant-design/icons-vue"
	import {useRouter} from 'vue-router'
	import { areaList } from '@vant/area-data';
	import {useState as useAddressState} from '@/store/address.js'
	const state = useState()
	const addressState = useAddressState()
	const router=useRouter()
	const message=inject('$message')
	
	const searchResult = ref([]);
	    const onSave = async(content) => {
				addressState.setAddress(content)
				const res=await addressState.createAddress()
				if(res.code===1){
					message.success(res.msg)
				}else if(res.code===4){
					message.warning(res.msg)
				}
			};
	    const onDelete = () => Toast('delete');
	    const onChangeDetail = (val) => {
	      if (val) {
	        searchResult.value = [
	          {
	            name: '天津工业大学新校区',
	            address: '精武镇',
	          },
	        ];
	      } else {
	        searchResult.value = [];
	      }
	    };
	const back = () => {
		state.setDirection("backward")
		router.go(-1)
	}
</script>

<style scoped>
	.left{
		color: white; 
		font-size: 24px;
		font-weight: bold;
		margin-left: -10px;
		margin-top: 3px;
	}
	.addAddress{
		font-size: 18px;
		color: #F8F3EC;
		margin-top: 3px;
		margin-left: -10px;
	}
	:deep(.van-address-edit__button){
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #FF6600 !important;
	}
</style>