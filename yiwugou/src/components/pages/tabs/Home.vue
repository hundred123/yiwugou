<template>
	<div>
		<top-bar @chandlerTopBa="goto('/search')">
			<template v-slot:left>
				<span style="font-size:18px;color: white;">En</span>
			</template>
			<template v-slot:right>
				<expand-outlined style="font-size:20px;color: white;" />
			</template>
		</top-bar>
		<!-- nav -->
		<!-- <content :hasTabBar='true' :pull='true' :refreshfunc='hasCotent'> -->
		<div class="theme-list">
			<div class="fixed-nav">
				<div class="fixed-nav-content">
					<div v-for="(item,index) in theme" :class="['tab-title ',activeId===index&&'select-tab']"
						@click="changeTab(index,$event)">
						<div class="navItem">
							{{item}}
							<caret-up-outlined class="trangle" v-show="activeId===index" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 内容 -->
		<nav-item :clickNavItem='theme[activeId]' :activeId="activeId">
			<template v-slot:rceommand>
				<recommand></recommand>
			</template>
			<template v-slot:otherGoods>
				<other-goods :name='theme[activeId]'></other-goods>
			</template>
		</nav-item>
		<!-- </content> -->
	</div>
</template>

<script setup>
	import {
		useRouter
	} from 'vue-router'
	import {
		ref,
		onMounted,
		nextTick
	} from 'vue'

	import {
		useState
	} from '@/store/pageDirection.js'
	import {
		ExpandOutlined,
		CaretUpOutlined
	} from "@ant-design/icons-vue"
	import {
		restHttp
	} from '@/kits/HttpKit.js'

	import TopBar from '@/components/topbar/TopBar.vue'
	import NavItem from '@/components/pages/nav/NavItem.vue'
	import Recommand from '@/components/pages/nav/Recommand.vue'
	import OtherGoods from '@/components/pages/nav/OtherGoods.vue'

	const router = useRouter()
	const state = useState()
	// 搜索页面进行跳转
	const goto = (path, query) => {
		state.setDirection('forward')
		router.push({
			path: path
			// query: query
		})
	}
	// nav部分
	const category = ref([])
	const theme = ref(['推荐'])
	const activeId = ref(0)

	const changeTab = (index, e) => {
		if (index !== activeId.value) {
			activeId.value = index
		}
	}



	onMounted(async () => {
		await getCategory()
	})
	const getCategory = async () => {
		const res = await restHttp('/category')
		category.value = res
		category.value.forEach((item) => {
			theme.value.push(item.name)
		})
	}
</script>

<style scoped>
	.content {
		height: calc(100vh - 65px - 58px - 40px);
	}

	.theme-list {
		background-color: #FF6600;
	}

	.fixed-nav {
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
		color: #EDF2EA;
		font-size: 16px;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.select-tab {
		font: size 20px;
		color: white;
		font-weight: bold;
	}

	.navItem {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.navItem .trangle {
		position: absolute;
		bottom: -2px;
	}
</style>
