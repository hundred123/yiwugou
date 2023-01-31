<template>
	<div class="headerPage">
			<div class="left">
				<el-button plain icon='el-icon-menu' size='mini' @click="handleMenu"></el-button>
				<!-- <h3 style="color: white;">首页</h3> -->
				<el-breadcrumb class="a" separator="/">
					<el-breadcrumb-item  :to="{ path: item.path }" v-for="item in tabList":key='item.path'>{{item.label}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="right">
				<el-dropdown trigger="click" size='mini'>
					<img :src='imgUrl' class="user"/>
					<el-dropdown-menu slot="dropdown">
					    <el-dropdown-item>个人中心</el-dropdown-item>
					    <el-dropdown-item>
								<a href="javascript:;" @click="logout">退出</a>
							</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
	</div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {clearItem} from '@/kits/LocalStorageKit.js'
	import Modal from 'ant-design-vue/lib/modal';
	export default {
		name:'CommonHeader',
		data(){
			return{
				imgUrl:require('../assets/images/person.jpg')
			}
		},
		methods:{
			...mapMutations('tab',{handleMenu:'COLLAPS_EMENU'}),
			logout(){
				const that=this
				// this.Modal.visible = true;
			    Modal.confirm({
			        title:"是否要退出?",
			        okText:"确定",
			        cancelText:"取消",
			        centered:true,
			        onOk(){
			            clearItem("token")
			            clearItem("userName")
			            clearItem("userId")
			            that.$router.replace({path:"/login"})
			        },
			        onCancel(){}
			    })
			}
		},
		computed:{
			...mapState('tab',['tabList'])
		}
	}
</script>

<style scoped lang="less">
	.headerPage{
		display: fixed;
		background-color: black;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
			.left{
				display: flex;
				align-items: center;
				.el-button{
					margin-right: 20px;
				}
			}
			.right{
				.user{
					width: 40px;
					height: 40px;
					border-radius: 50%;
				}
			}
		
	}
	.a{
		color: white;
	}
</style>