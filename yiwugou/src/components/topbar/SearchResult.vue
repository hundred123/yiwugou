<template>
	<div>
		<top-bar :edit='true' :searchInput='route_Query_SearchContent' @searchContentChangeHandle='searchContentChange'>
			<template v-slot:left>
					<left-outlined class="left" @click="back" style="color: white; font-size: 18px; font-weight: bold;"/>
			</template>
			<template v-slot:right>
				<span @click="search" style="font-size:18px; color: white;">
					<search-outlined />
				</span>
			</template>
		</top-bar>

		<!-- 商品卡片顶部样式 -->
		<div class="topCardList">
			<div class="fixed-nav">
				<div class="fixed-nav-content">
					<div v-for="(item,index) in topCard" :class="['tab-title ',activeId===index&&'select-tab']"
						@click="changeTab(index,$event)">
						<div class="navItem">
							<div>{{item}}</div>
						</div>
						<!-- {{theme[activeId]}} -->
					</div>
				</div>
			</div>
			<div class="goodsNum">商品({{totalGoods}})</div>
		</div>
		<content :refreshfunc='flushed' :pull='true'>
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
						<product-card-vertical style="margin-bottom: 2px;" :product='item'></product-card-vertical>
					</template>
				</a-list>
			</div>
		</content>
	</div>
</template>

<script setup>
	// import productCard from '../product/productCart.vue'
	import TopBar from '@/components/topbar/TopBar.vue'
	// 为了实现下拉刷新需要把内容包裹在一个容器当中，所以定义了一个组件把内容包裹进去
	import Content from '@/components/content/Content.vue'
	import ProductCardVertical from '@/components/product/ProductCardVertical.vue'
	// 引入mock数据,myHttp
	//import {mockHttp} from '@/kits/HttpKit.js'
	import {restHttp} from '@/kits/HttpKit.js'
	import {useState} from '@/store/pageDirection.js'
	import {useRouter,useRoute} from 'vue-router'
	import {ref,inject,computed,onMounted} from 'vue'
	import {SearchOutlined,LeftOutlined} from "@ant-design/icons-vue"
	const state = useState()
	// 使用路由
	const router = useRouter()
	const route = useRoute()
	// 将message注入使用
	const message = inject('$message')
	// 接收过滤完的数据
	// const data = ref([])
	const data = ref([])
	// 商品顶部卡片
	const activeId = ref(0)
	const topCard = ref(['综合', '销量', '价格'])
	// 加载更多
	let lodingMore = ref(false)
	// console.log('query', route.query.searchContent) //在本页面内输入的搜索信息
	// 接收search页面穿过来的query数据
	let route_Query_SearchContent = route.query.searchContent ? route.query.searchContent : ''
	// 接收home传过来的值
	// let route_Query_type=route.query.type?route.query.type:''
	// 接收子组件传过来的值 		searchContent父传子之后，不能直接改变props的值，所以要通过emit再传回值
	const searchContentChange = content => {
		route_Query_SearchContent = content
	}
	// 分页的开始与查询的数量
	let start = 0
	let count = 6
	let options = {
		searchContent: route_Query_SearchContent,
		start,
		count
	}
	let clickNum=0//商品点击次数
	let totalGoods=ref(0)
	// 顶部卡片切换
	const changeTab = (index, e) => {
		if(e.target.innerHTML.indexOf('价格')!==-1){//===
			activeId.value = index
			clickNum++
			let options4 = {
				searchContent: route_Query_SearchContent,
				start: 0,
				count
			}
			data.value = []
			searchData(options4)
		} else if (index !== activeId.value) {
			activeId.value = index
			let options4 = {
				searchContent: route_Query_SearchContent,
				start: 0,
				count
			}
			data.value = []
			searchData(options4)
		}
	}

	// 接收axios数据
	// 封装后调用search方法
	const search = () => {
		data.value = []
		start = 0
		searchData(options)
	}
	// 进行封装
	const searchData = async (options) => {
		// rest 风格 即使用post,get请求
		try {
			const res = await restHttp('/search', options)
			totalGoods.value=res.num
			if (res.data && res.data.length > 0 && activeId.value == 0) {
				data.value = data.value.concat(res.data)
			}else if(res.data && res.data.length > 0 && activeId.value == 1){
				data.value = data.value.concat(res.data)
				data.value = data.value.sort((p1, p2) => {
					//p1-p2降序
					return p2.total - p1.total
				})
			}else if (res.data && res.data.length > 0 && activeId.value == 2) {
				data.value = data.value.concat(res.data)
				if(clickNum%2==0){
					topCard.value[2]=`价格↓`
					data.value = data.value.sort((p1, p2) => {
						//p1-p2降序
						return p2.price[0] - p1.price[0]
					})
				}else{
					topCard.value[2]=`价格↑`
					data.value = data.value.sort((p1, p2) => {
						//p1-p2升序
						return p1.price[0] - p2.price[0]
					})
				}
			}else if(res.data.length < 0){
				message.warning('没有更多了')
			}

			if (res.code === 1) {
				// data.value=res.data
				return {
					code: 'ok'
				}
			} else {
				message.warning(res.msg)
			}
		} catch (e) {
			// console.log(e)
			message.warning(e.message)
		}
	}
	//initData() */
	// 返回到上一个页面
	const back = () => {
		state.setDirection('backward')
		router.go(-1)
		//router.back()
	}
	// console.log(data)
	// 加载更多选项
	const onLoadMore = async () => {
		try {
			// 点击加载更多后出现小圆圈
			start = start + count
			let options3 = {
				searchContent: route_Query_SearchContent,
				start,
				count
			}
			lodingMore.value = true
			// console.log('加载更多的名字', route_Query_SearchContent)
			const res = await searchData(options3)
			// console.log('onLoadMore:',res)
			// console.log('onLoadMore的options3:',options3)
			// 查询完之后让小圆圈消失
			lodingMore.value = false
			return {
				code: 'ok'
			}
		} catch (e) {
			// console.log(e)
			message.error('onLoadMore错误', e.message)
		}
	}
	// 向子组件传递的内容方法
	// const refresh=()=>{
	// 	// start=0
	// 	// data.value=[]
	// 	console.log('start:',start)
	// 	return searchData(options)
	// }
	const flushed = async () => {
		const res = await onLoadMore()
		if (res.code === 'ok') {
			return res
		} else {
			return {
				code: 'fail'
			}
		}
	}
	// 跳转到详情页面
	const goto = (item) => {
		store.commit('pageDirection/setDirection', 'forward')
		router.push({
			name: 'GoodDetail',
			params: {
				id: item.id,
				type: item.type.id
			}
		})
	}
	onMounted(() => {
		searchData(options)
	})
</script>

<style scoped>
	/* .product-img{
		width: 150px;
		height: 130px;
		background-color: #e5e5e5;
		border-radius: 15px;
	} */
	.list {
		box-sizing: border-box;
		padding: 0px 18px;
	}

	:deep(.ant-list-items) {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	/* 商品顶部卡片样式 */
	.topCardList {
		font-size: 16px;
		background-color: #F6F6F6;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.goodsNum{
		flex: 1;
		margin-right: 5px;
	}
	.fixed-nav {
		flex: 3;
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
	}

	.fixed-nav-content {
		display: flex;
	}

	.tab-title {
		height: 40px;
		line-height: 40px;
		padding: 0 8px;
		margin-right: 20px;
		color: #989898;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.select-tab {
		font: size 20px;
		color: #FF6600;
	}

	.navItem {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
