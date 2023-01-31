<template>
	<content :hasTabBar='true' :pull='true' :refreshfunc='flushed'>
		<div>
			<!-- 轮播图的切换 -->
			<a-carousel>
				<div v-for="(item,index) in homeImgs" class="carousel">
					<!-- <h3>{{index+1}}</h3> -->
					<img v-if="item" :src="item" class="carousel-img" />
				</div>
			</a-carousel>
			<!-- 其他 -->
			<div class="others">
				<div class="otherItem" v-for="item in otherItems " @click="blankPage">
					<img :src='item.imgpath' />
					<span>{{item.title}}</span>
				</div>
			</div>
			<div class="yiwuShops">
				<div class="shop" v-for="item in shop">
					<img :src='item.imgpath' />
				</div>
			</div>
			<!-- 商品卡片 -->
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
				
				<!-- <product-card-vertical style="margin-bottom: 2px;" v-for="item in categoryList" :product='item'>
				</product-card-vertical> -->
			</div>
		</div>
	</content>
</template>
<!-- content -->
<script setup>
	import {ref,onMounted,inject} from 'vue'
	import {useRouter} from 'vue-router'
	import Content from '@/components/content/Content.vue'

	import ProductCardVertical from '@/components/product/ProductCardVertical.vue'
	import {restHttp} from '@/kits/HttpKit.js'

	const router = useRouter()
	const message = inject('$message')
	let lodingMore = ref(false)
	//轮播图的部分
	//当发生错误的时候 轮播图 也可以展现出默认的框架
	const homeImgs_skleton = ['']
	//将请求回来的图片进行保存
	const homeImgs = ref(homeImgs_skleton)
	const getCarousel = async () => {
		const res = await restHttp('/carousel')
		homeImgs.value = res
	}
	//当发生错误的时候 类别 也可以展现出默认的框架
	const categorys_skleton = [{
		goods: [{},
			{},
			{}
		]
	}]
	//类别请求回来的数据
	let start = parseInt(Math.random() * (50 - 0)) + 0,count = 4
	let data = ref([])
	const initData = async () => {
		// let res = await restHttp('/totalCategoryListItem', options)
		// console.log('这是首页返回回来的数据：', res)
		let options = {
			start,
			count
		}
		try {
			let res = await restHttp('/totalCategoryListItem',options)
			// console.log('rerere',res)
			if (res && res.length > 0) {
				data.value = data.value.concat(res)
			}
			// console.log(data.value)
			return {
				code: 'ok'
			}
		} catch (e) {
			message.error('initData错误',e.message)
		}
	}
	// console.log('category.valuecategory.value', data.value)
	//其他滚动标签
	const otherItems_skleton = ['']
	const otherItems = ref(otherItems_skleton)
	const blankPage = () => {
		router.push({
			path: '/blankpage'
		})
	}
	const getIcon = async () => {
		const res = await restHttp('/icon')
		otherItems.value = res
	}

	//商城标签滚动
	// 当发生错误时， 商城 滚动可以出现默认的框架
	const shop_skleton = ['']
	const shop = ref(shop_skleton)
	const getBanner = async () => {
		const res = await restHttp('/banner')
		shop.value = res
	}
//整个content
const flushed=async ()=>{
	start = parseInt(Math.random() * (50 - 0)) + 0
	const res=await onLoadMore()
	if (res.code === 'ok') {
		return res
		// return {code: 'ok'}
	} else {
		return {
			code: 'fail'
		}
	}
}
// 加载更多选项
	const onLoadMore = async () => {
		try {
			// 点击加载更多后出现小圆圈
			start = parseInt(Math.random() * (50 - 0)) + 0 + count
			let options3 = {
				start,
				count
			}
			lodingMore.value = true
			const res = await initData(options3)
			// 查询完之后让小圆圈消失
			lodingMore.value = false
			return {
				code: 'ok'
			}
		} catch (e) {
			console.log(e.message)
			message.error('onLoadMore错误',e.message)
		}
	}
	onMounted(() => {
		getCarousel()
		getIcon()
		getBanner()
		initData()
	})
</script>

<style scoped>
	.content {
		overflow-y: auto;
	}

	.carousel {
		display: block;
		/* position: relative; */
		/* background: #979797; */
		width: 100%;
		height: 120px;
	}

	/* 轮播图部分 */
	/* 	.ant-carousel :deep(.slick-slide) {
		text-align: center; 
		height: 120px;
		line-height: 160px; 
		background: #979797;
		overflow: hidden;
		position: relative;
	}
	.ant-carousel :deep(.slick-slide h3) {
		color: #fff;
	} */
	.carousel-img {
		width: 100%;
		height: 100%;
		display: block;
		/* object-fit: none;
		position: absolute;
		top: 0; */
	}

	.others {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 8px;
	}

	.otherItem {
		width: 74px;
		height: 65px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.otherItem img {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background-color: pink;
	}

	/* 商品列表 */
	.category-list {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 14px;
	}

	/* 商城滚动栏 */
	.yiwuShops {
		overflow-x: auto;
		display: flex;
		padding: 0 8px;
		margin-top: 14px;
	}

	.shop {
		flex-shrink: 0;
		width: 125px;
		height: 75px;
		background-color: #e5e5e5;
		margin-right: 12px;
		border-radius: 8px;
	}

	.shop img {
		width: 100%;
		height: 100%;
	}
	:deep(.ant-list-items) {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
</style>
