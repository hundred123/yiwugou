<template>
	<div>
		
		<el-menu 
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b"
			default-active="1-4-1" 
			class="el-menu-vertical-demo" 
			@open="handleOpen" 
			@close="handleClose"
			:collapse="isCollapse"
			>
			<h3>{{isCollapse? '后台':'义乌购后台管理系统'}}</h3>
			<el-menu-item 
			v-for="item in nochildren" 
			:index="item.path+''" 
			:key="item.path"
			@click="clickMenu(item)">
				<i :class="'el-icon-'+item.icon"></i>
				<span slot="title">{{item.label}}</span>
			</el-menu-item>
			<el-submenu v-for="item in haschildren" :index="item.path+''">
				<template slot="title">
					<i :class="'el-icon-'+item.icon"></i>
					<span slot="title">{{item.label}}</span>
				</template>
				<el-menu-item-group v-for="subItem in item.children":key='subItem.path'>
					<el-menu-item @click="clickMenu(subItem)" :index="subItem.path+''">{{subItem.label}}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<style lang="less" scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}
	.el-menu{
		height: 100vh;
		border: none;
		h3{
			color: white;
			text-align: center;
			line-height: 48px;
		}
	}
</style>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				/* isCollapse: false, */
				menu: [{
						path: '/',
						name: 'home',
						label: '首页',
						icon: 's-home',
						url: 'Home/Home'
					},
					{
						path: '/mall',
						name: 'mall',
						label: '商品管理',
						icon: 'video-play',
						url: 'MallManage/MallManage'
					},
					{
						path: '/user',
						name: 'user',
						label: '用户管理',
						icon: 'user',
						url: 'UserManage/UserManage'
					},
					{
						label: '其他',
						icon: 'location',
						children: [
							{
								path: '/page1',
								name: 'page1',
								icon: 'setting',
								label:'页面1',
								url: 'Other/PageOne'
							},
							{
								path: '/page2',
								name: 'page2',
								icon: 'setting',
								label:'页面2',
								url: 'Other/PageTwo'
							}
						]
					}
				]
			};
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			clickMenu(item){
				this.$router.push(item.name)
				//mapMutations('tab',{clickMenu:'SELECT_MENU'})
				this.$store.commit('tab/SELECT_MENU',item)
				//this.$store.commit("personAbout/ADD_PERSON",addPerson)
			},
			
		},
		computed: {
			nochildren() {
				return this.menu.filter(item => !item.children)
			},
			haschildren() {
				return this.menu.filter(item => item.children)
			},
			...mapState('tab',['isCollapse'])
		}
	}
</script>
