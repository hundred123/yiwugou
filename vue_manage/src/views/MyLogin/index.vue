<template>
	<div>
		<el-card class="box-card" label-width="100px">
			<div slot="header" class="clearfix">
			    <span>系统登录</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pass">
				    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click="login" class="login_submit">登录</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import mock from 'mockjs'
import {restHttp} from '../../kits/HttpKit.js'
import {setItem} from '@/kits/LocalStorageKit.js'
	export default {
		name: 'myLogin',
		data() {
			return {
				ruleForm:{
					name:'',
					pass:''
				},
				rules: {
					name: [{
							required: true,
							message: '请输入账号',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 5,
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					],
					pass:[
						{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
					]
				}
			}
		},
		methods:{
			// 进行登录
			async login(){
				try {
					const key = 'loading'
					this.$message.loading({
						key,
						content: '登陆中...'
					})
					const resLogin = await restHttp("/login", {
						id:this.ruleForm.name,
						pwd:this.ruleForm.pass,
						role: "a"
					})
					console.log('resLogin：',resLogin)
					if (resLogin.code === 1) {
						this.$message.success({
							key,
							content: resLogin.msg,
							duration: 2
						})
						setItem("token", resLogin.data.token)
						setItem("userId", resLogin.data.userId)
						this.$router.push('/home').catch(()=>{})
					} else {
						this.$message.error({
							key,
							content: resLogin.msg,
							duration: 2
						})
					}
				} catch (e) {
				}
			}
			
		}
	}
</script>

<style scoped>
	.box-card {
		position: fixed;
		top: 180px;
		left: calc(50% - 200px);
	    width: 480px;
		margin: 0 auto;
	  }
	.clearfix{
		text-align: center;
	}
	.login_submit{
		margin-left: 28%;
		
	}
</style>
