<template>
	<div>
		<top-bar 
		:searchInput='searchContent' 
		@searchContentChangeHandle='searchContentChange' 
		:edit='true'>
			<template v-slot:left>
				<left-outlined class="left" @click="back" style="color: white; font-size: 18px; font-weight: bold;"/>
				<!-- <span class="iconfont icon-xiangzuojiantou" @click="back" ></span> -->
			</template>
			<template v-slot:right>
				<span @click="search" style="font-size:18px; color: white;"><search-outlined /></span>
			</template>
		</top-bar>
		<div class="rank">
			<span>排行榜</span>
		</div>
		
		<!-- <content> -->
			<div class="content">
				<!-- 最近搜索 -->
				<div class="title-bar">
					<div class="title"><clock-circle-outlined style="font-size: 22px; padding-right: 5px;"/> 最近搜索</div>
					<div class="clear" @click="clearHistory"><delete-outlined /></div>
				</div>
				<div class="hister-search">
					<div @click="quickSearch(item)" class="hister-search-item" v-for="item in historySearch">{{item}}</div>
				</div>
				
				<!-- 热门搜索 -->
				<div class="hot-search-bar">
					<div class="title-bar">
						<div class="title"><fire-outlined style="font-size: 22px; padding-right: 5px;"/> 热门搜索</div>
					</div>
					<div class="hotSearch">
						<div @click="quickSearch(item)" class="hister-search-item" v-for="item in hotSearch">{{item}}</div>
					</div>
				</div>
				
				
				
				<!-- <div class="hot-search-bar">
					<div class="title"><fire-outlined style="font-size: 22px; padding-right: 5px;"/>热门搜索</div>
					<div @click="quickSearch(item)" class="hister-search-item" v-for="item in hotSearch">{{item}}</div>
				</div> -->
			</div>
		<!-- </content> -->
	</div>
</template>

<script setup>
	// import {message} from 'ant-design-vue'
	import {inject,ref} from 'vue'
	import {useRouter} from 'vue-router'
	
	import TopBar from '@/components/topbar/TopBar.vue'
	// import Content from '@/components/content/Content.vue'
	
	import {ClockCircleOutlined,DeleteOutlined,SearchOutlined,FireOutlined,LeftOutlined} from "@ant-design/icons-vue"
	import {getArray,setArray,clearItem} from '@/kits/LocalStorageKit.js'
	import {useState} from '@/store/pageDirection.js'
	// 定义一个全局变量，inject接收
	const message =inject('$message')
	// 获取本地存储的信息
	const historySearch=ref(getArray('historySearch'))
	// 为了进行父传子
	let searchContent=''//搜索的内容
	// 热门搜索数据
	const hotSearch=ref(['发光玩具','地摊','假发','袜子','玩具','耳环'])
	const router =useRouter()
	const state=useState()
	// 回退页面
	const back=()=>{
		state.setDirection('backward')
		router.go(-1)
		//router.back()
	}
	// 进入搜索页面
	const search=()=>{
		// console.log('搜索的数据',searchContent)
		if(searchContent!==''){
			state.setDirection('forward')
			router.push({
				//路由传参的方式	params query
				path:'/searchresult',
				query:{//直接在网址的?后面出现所传的值
					searchContent
				}
				// 在本地缓存中追加一个新内容
			})
			setArray('historySearch',searchContent)
		}else{
			message.warning('输入值不能为空')
		}
	}
	// 接收子组件传过来的值 		searchContent父传子之后，不能直接改变props的值，所以要通过emit再传回值
	const searchContentChange=content=>{
		// console.log('接收子组件传过来的值',content)
		searchContent=content
	}
	// 在搜索记录中进行搜索
	const quickSearch=(contentFromTag)=>{
		// console.log('contentFromTag',contentFromTag)
		state.setDirection('forward')
		router.push({
			//路由传参的方式	params query
			path:'/searchresult',
			query:{//直接在网址的?后面出现所传的值
				searchContent:contentFromTag
			}
		})
	}
	// 清除搜索记录
	const clearHistory=()=>{
		clearItem('historySearch')
		historySearch.value=[]
	}
</script>

<style scoped>
	.content{
		margin-top: 5px;
		margin: 0 8px;
	}
	.title-bar{
		display: flex;
		justify-content: space-between;
		font-size: 14px;
	}
	.title{
		color: rgba(0, 0, 0, .6);
		font-weight: bold;
	}
	.clear{
		color: #D0D0D0;
		font-size: 26px;
		margin-top: -5px;
	}
	.hister-search,.hotSearch{
		display: flex;
		flex-wrap: wrap;
		margin-top: -10px;
		font-size: 14px;
	}
	.hotSearch{
		margin-top: 0;
	}
	.hot-search-bar{
		margin-top: 30px;
	}
	.hister-search-item{
		margin-right: 19px;
		margin-top: 18px;
		padding: 3px 9px;
		border-radius: 16px;
		box-shadow: 0 1px 8px rgba(0, 0, 0, .1);
		color: #8D8E90;
		background-color: #F5F6F8;
	}
	.rank{
		text-align: center;
		position: relative;
		overflow: hidden;
		height: 36px;
	}
	.rank span::before{
		content: '排行榜';
		display: block;
		position: absolute;
		top: 3px;
		left: 50%;
		transform: translateX(-50%);
		width: 130px;
		height: 130px;
		border-radius: 50%;
		font-size: 14px;
		color: #F3EEEA;
		z-index: 1;
	}
	.rank span::after{
		content: '排行榜'; 
		display: block;
		position: absolute;
		top: -95px;
		left: 50%;
		transform: translateX(-50%);
		width: 130px;
		height: 130px;
		border-radius: 50%;
		background-color: #FF6600;
/* 		
		left: 50%; 
		width: 130px;
		height: 130px;
		border-radius: 50%;
		 */
	}
</style>