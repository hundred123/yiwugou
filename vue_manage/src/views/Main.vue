<template>
	<div style="height: 100vh;">
		<el-container style="height: 100vh;">
			<el-aside width="auto">
				<common-menu style="height: 100vh;"></common-menu>
			</el-aside>
			<el-container>
				<el-header style="padding: 0;">
					<common-header></common-header>
				</el-header>
				<common-tags></common-tags>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import CommonMenu from '../components/CommonMenu.vue'
	import CommonHeader from '../components/CommonHeader.vue'
	import commonTags from '../components/commonTags.vue'
	export default {
		name:'Main',
		components:{
			CommonMenu,
			CommonHeader,
			commonTags
		}
	}
</script>

<style lang="less" scoped>
	body{
		margin: 0;
	}
	.el-main{
		padding-top: 0;
	}
</style>