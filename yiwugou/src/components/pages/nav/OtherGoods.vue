<template>
	<content :hasTabBar='true' :pull='true' :refreshfunc='hasCotent'>
		<div class="category">
			<!-- 上半部分 -->
			<div class="topCategory">
				<div v-for="item in category" class="categoryItem" @click="goResult(item.name)">
					<img class="categoryItem-img" :src="item.imgpath" />
					<span>{{item.name}}</span>
				</div>
			</div>

			<!-- 下半部分 -->
			<div class="category-list">
				<a-list :data-source='data'>
					<template #loadMore>
						<div v-if="data.length>0"
							:style="{textAlign: 'center',marginTop: '12px',height: '32px', lineHeight: '32px'}">
							<a-spin v-if="lodingMore"></a-spin>
							<a-button v-else style="color: #7f7f7f;" @click="onLoadMore">loading more</a-button>
						</div>
					</template>
					<template #renderItem='{item}'>
						<!-- <product-card :product='item' @click="goto(item)"></product-card> -->
						<product-card-vertical style="margin-bottom: 2px;" :product='item'></product-card-vertical>
					</template>
				</a-list>
			</div>
		</div>
	</content>
</template>

<script setup>
	import {ref,onMounted,watch,inject} from 'vue'
	import { useRouter } from 'vue-router';

	import Content from '@/components/content/Content.vue'
	import ProductCardVertical from '@/components/product/ProductCardVertical.vue'
	
	import { useState } from "@/store/pageDirection.js"
	import {restHttp} from '@/kits/HttpKit.js'
	const message = inject('$message')
	const state = useState();
	const router = useRouter();
	const props = defineProps({
		name: String,
	})
	const category = ref([])
	let categoryList = ref([])
	const data = ref([])
	// 加载更多
	let lodingMore = ref(false)
	let start = 0
	let count = 4
	let a = ref('')
	watch(() => props.name, (newvalue) => {
		a.value = newvalue
		const options = {
			names: newvalue,
		}
		const options2 = {
			start: 0,
			count: 4,
			names: newvalue
		}
		initData(options)
		initData2(options2)
		data.value = []
		start = 0
		count = 4
	})

	const initData = async (options) => {
		categoryList.value = []
		let res = await restHttp('/categoryitem', options)
		category.value = res
		for (let item of res) {
			categoryList.value = categoryList.value.concat(item.goods)
		}
	}

	const initData2 = async (options3) => {
		if(options3.names==''){
			console.log('没有东西了',options3.names)
			return 
		}
		try {
			let res = await restHttp('/categoryListItem', options3)
			if (res && res.length > 0) {
				data.value = data.value.concat(res)
				// console.log(data.value)
			}else{
				console.log('11111111111')
			}
			return {
				code: 'ok'
			}
		} catch (e) {
			message.error('initData2错误',e.message)
		}
	}
	// 加载更多选项
	const onLoadMore = async () => {
		try {
			// 点击加载更多后出现小圆圈
			start = start + count
			let options3 = {
				names: a.value,
				start,
				count
			}
			lodingMore.value = true
			const res = await initData2(options3)
			console.log('othergoods更多之后的数据：',res)
			// 查询完之后让小圆圈消失
			lodingMore.value = false
			return {
				code: 'ok'
			}
		} catch (e) {
			message.error('onLoadMore错误',e.message)
		}
	}

	const hasCotent = async () => {
		const res=await onLoadMore()
		if (res.code === 'ok') {
			return res
		} else {
			return {
				code: 'fail'
			}
		}
	}
	const goResult = (searchContent) => {
	    state.setDirection("forward")
	    router.push({
	        // path: '/categoryresult',
	        path: '/searchresult',
	        query: {
	            searchContent
	        }
	    }) 
	}
	
	initData({names:props.name})
	initData2({
		start: 0,
		count: 4,
		names: props.name
	})
</script>

<style scoped>
	.category {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		/* flex-wrap: wrap; */
		/* justify-content: space-between; */
	}

	.topCategory {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex: 1;
		justify-content: space-around;
	}

	.categoryItem {
		width: 79px;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* flex-wrap: wrap; */
		justify-content: center;
	}

	.categoryItem-img {
		width: 50px;
		/* height: 50px; */
		margin-bottom: 10px;
	}

	.category-list {
		flex: 3;
		/* 		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 14px; */
	}

	:deep(.ant-list-items) {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
</style>
