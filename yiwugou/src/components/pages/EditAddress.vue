<template>
	<div>
		<top-bar style="box-shadow:unset;">
			<template v-slot:left>
				<left-outlined class="left" @click="back"/>
			</template>
			<template v-slot:middle>
				<div class="addAddress">修改收货地址</div>
			</template>
			<template v-slot:right>
				<div class="delete" style="color: white;" @click="deleteAddress">删除</div>
			</template>
		</top-bar>
		  <!-- show-set-default -->
		<van-address-edit
		  :area-list="areaList"
		  show-search-result
		  :search-result="searchResult"
		  :area-columns-placeholder="['请选择', '请选择', '请选择']"
			save-button-text='完成'
			:address-info="address_info"
		  @save="onSave"
		  @change-detail="onChangeDetail"
		/>
	</div>

</template>

<script setup>
	import {ref,inject,onMounted} from 'vue'
	import TopBar from '@/components/topbar/TopBar.vue'
	import { Toast } from 'vant';
	import {useState} from '@/store/pageDirection.js'
	import {LeftOutlined} from "@ant-design/icons-vue"
	import Modal from 'ant-design-vue/lib/modal';
	import {useRouter,useRoute} from 'vue-router'
	import { areaList } from '@vant/area-data';
	import { restHttp } from '@/kits/HttpKit.js'
	import {useState as useAddressState} from '@/store/address.js'
	const state = useState()
	const addressState = useAddressState()
	const router=useRouter()
	const route=useRoute()
	const message=inject('$message')
	const addressID=ref('')
	const searchResult = ref([]);
	const newAddress=ref([])
	    const onSave = async(content) => {
				// addressState.setAddress(content)
				// addressState.setAddressID(addressID.value)
				newAddress.value.push(content)
				const p = { //在p中往后台传输数据
					// id:nanoid(),
					address: {
						id:addressID.value,
						list: newAddress.value
					}
				}
				// console.log('p',p)
				// const res=await addressState.createAddress(p)
				const res = await restHttp('/createaddress', p)
				// console.log('resresres',res)
				if(res.code==1){
					message.success(res.msg)
				}else if(res.code==4){
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
			
	// let address-info = {
	//         name: '王五',
	//         tel: '1320000000',
	//         address: '浙江省杭州市滨江区江南大道 15 号',
	//       };
	
// 获取到对应的地址
const address=ref([])
const address_info=ref({})
const getAddress= async()=>{
	const addressData= await restHttp('/getaddress')
	addressData.data.forEach((item,index)=>{
		if(index==route.query.index){
			addressID.value=item.id
			address.value.push(item.list[0])
			address_info.value={
				name:address.value[0].name,
				tel:address.value[0].tel,
				areaCode:'110000',
				city:address.value[0].city,
				county:address.value[0].county,
				addressDetail:address.value[0].addressDetail
			}
		}
	})
}
// 删除地址
const deleteAddress= async()=>{
	Modal.confirm({
	    title:'确定删除吗？',
	    okText:'确定',
	    cancelText:'取消',
	    centered:true,
	    onOk(){
				// console.log('addressID',addressID.value)
				const options={
					id:addressID.value
				}
				restHttp('/removeaddress',options).then(res=>{
					// console.log(res)
				})
	        back()
	    }
	})
	
	
	
}

	// const EditSuccess=()=>{
	// 	console.log('修改成功')
	// }
	const back = () => {
		state.setDirection("backward")
		router.go(-1)
	}
	onMounted(()=>{
		getAddress()
	})
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