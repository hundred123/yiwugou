<script setup>
	import topBar from '@/components/topbar/topBar.vue'
	import Content from '@/components/content/Content.vue'
	import Sidentify from '@/components/SIdentify/Sidentify.vue';
	import {
		CloseOutlined
	} from '@ant-design/icons-vue'
	import {
		useRouter
	} from 'vue-router';
	import {
		useState
	} from "@/store/pageDirection"
	import {
		reactive,
		inject,
		getCurrentInstance,
		ref
	} from 'vue'
	import {
		restHttp
	} from '@/kits/HttpKit.js'
	import {
		setItem,
		getItem,
		clearItem
	} from '@/kits/LocalStorageKit.js'

	const router = useRouter();
	const state = useState();
	const instance = getCurrentInstance()
	const message = inject('$message')

	const form = ref({
		id: '',
		phone: '',
		pwd: '',
		remember: false
	})
	const mycode = ref('')
	const LoginCode = ref('')
	const goto = (path) => {
		state.setDirection("forward")
		router.push({
			path
		})
	}
	const back = () => {
		state.setDirection("backward")
		router.go(-1)
	}
	const rules = {
		id: [{
				required: true,
				message: '请输入帐号/手机号',
				trigger: 'blur'
			}, // 必填的校验
			{
				min: 11,
				max: 11,
				message: '请输入合法的手机号',
				trigger: "blur"
			}, // 邮箱格式的校验规则
		],
		pwd: [{
				required: true,
				message: '请输入密码',
				trigger: 'blur'
			}, // 必填的校验规则
			{
				min: 6,
				max: 20,
				message: '密码的长度再6个字符以上',
				trigger: "blur"
			}, // 长度的校验规则
		],
		phone: [{
				required: true,
				message: '请输入手机号',
				trigger: 'blur'
			}, // 必填的校验
			{
				min: 11,
				max: 11,
				message: '请输入合法的手机号',
				trigger: "blur"
			}, // 邮箱格式的校验规则
		]
	}
	const changeCode = (code) => {
		LoginCode.value = code
	}
	const sub = async () => {
		clearItem("pwd")
		clearItem("userId")
		clearItem("avatar")
		const form = instance.refs.loginForm
		try {
			const res = await form.validate()
			// console.log(form.validate());
			const key = "loading"
			message.loading({
				key,
				content: "登陆中..."
			})

			const resLogin = await restHttp("/login", {
				...res,
				role: "c"
			})
			// const resLogin = await restHttp("/api/loginbystate", res)
			// console.log("resLogin:", resLogin)
			if (resLogin.code === 1) {
				message.success({
					key,
					content: resLogin.msg,
					duration: 2
				})
				// 将token 存到客户端(前台本地缓存中)
				setItem('token', resLogin.data.token)
				setItem('userId', resLogin.data.userId)
				// setItem('userName', resLogin.data.userName)
				setItem('avatar', resLogin.data.avatar)
				setItem('pwd', resLogin.data.pwd)
				setItem('remember', JSON.stringify(resLogin.data.remember))
				back()
			} else {
				message.error({
					key,
					content: resLogin.msg,
					duration: 2
				})
			}
		} catch (e) {
			message.error(e.message)
		}
	}
	const subCode = async () => {
		if (mycode.value === '') {
			message.error('未输入验证码')
		} else {
			if (mycode.value !== LoginCode.value) {
				message.error('验证码不正确')
			} else {
				const form = instance.refs.loginForm1
				// console.log(form);
				try {
					const res = await form.validate()
					console.log(res);

					const key = "loading"
					message.loading({
						key,
						content: "登陆中..."
					})

					const resLogin = await restHttp("/loginbyyzm", res)
					// console.log("resLogin:", resLogin)
					if (resLogin.code === 1) {
						message.success({
							key,
							content: resLogin.msg,
							duration: 2
						})
						// 将token 存到客户端(前台本地缓存中)
						setItem('token', resLogin.data.token)
						setItem('userId', resLogin.data.userId)
						// setItem('userName', resLogin.data.userName)
						setItem('avatar', resLogin.data.avatar)
						back()
					} else {
						message.error({
							key,
							content: resLogin.msg,
							duration: 2
						})
					}
				} catch (e) {
					// console.log(e.message);
				}
			}
		}

	}
	const initData = () => {
		if (getItem('remember') == "true") {
			form.value.id = getItem("userId")
			// console.log('form.value.id', form.value.id)
			form.value.pwd = getItem('pwd')
			form.value.remember = true
		}
	}
	initData()
</script>
<template>
	<div>
		<div class="login">
			<top-bar class="login-top">
				<template v-slot:left>
					<close-outlined class="login-close" @click="back" />
				</template>
				<template v-slot:middle>
					<div></div>
				</template>
				<template v-slot:right>
					<div class="login-register" @click="goto('/register')">注册</div>
				</template>
			</top-bar>
		</div>
		<div class="login-center">
			<content style="padding:10px">
				<div class="card">
					<a-tabs class="card-item">
						<a-tab-pane key="1" tab="帐号密码登录">
							<a-form ref="loginForm" :model="form" layout="vertical" :rules="rules">
								<a-form-item name="id">
									<a-input v-model:value="form.id" size="large" placeholder="帐号/密码/手机号"></a-input>
								</a-form-item>
								<a-form-item name="pwd">
									<a-input v-model:value="form.pwd" type="password" autocomplete="on" size="large"
										placeholder="密码"></a-input>
								</a-form-item>
								<a-form-item name="remember">
									<a-checkbox v-model:checked="form.remember">保存帐号密码</a-checkbox>
								</a-form-item>
								<a-form-item class="sub">
									<a-button type="primary" @click="sub" block>登录</a-button>
								</a-form-item>
							</a-form>
						</a-tab-pane>
						<a-tab-pane key="2" tab="手机验证码登录" force-render>
							<a-form ref="loginForm1" :model="form" layout="vertical" style="margin-top:30px"
								:rules="rules">
								<a-form-item name="phone">
									<a-input v-model:value="form.phone" size="large" placeholder="请输入手机号"></a-input>
								</a-form-item>
								<a-form-item style="position: reactive;">
									<a-input type="text" autocomplete="on" size="large" placeholder="请输入验证码"
										v-model:value="mycode">
									</a-input>
									<div class="code">
										<sidentify @changeCode="changeCode"></sidentify>
									</div>
								</a-form-item>
								<a-form-item>
									<a-button class="sub2" type="primary"  @click="subCode" block>登录</a-button>
								</a-form-item>
							</a-form>
						</a-tab-pane>

					</a-tabs>

				</div>
			</content>
		</div>
	</div>
</template>
<style scoped>
	.code{
	    position: absolute;
	    top: -10px;
	    right: 10px;
	}
	.login {
		position: relative;
	}

	.login-top {
		position: relative;
		height: 250px;
		background-color: #FE8326;
		display: flex;
		align-items: flex-start;
		padding-top: 20px;
		box-sizing: border-box;

	}

	.login-close {
		font-size: 25px;
		color: #fff;
		margin-left: 20px;
	}

	.login-center {
		position: absolute;
		top: 80px;
		left: 17px;
		width: 355px;
		height: 330px;
		background-color: #fff;
		box-shadow: 0px 2px 8px rgb(0 0 0 / 0.2);
		border-radius: 15px;
	}

	.login-register {
		color: #fff;
		font-size: 18px;
		margin-right: 8px;
	}

	:deep(.ant-tabs>.ant-tabs-nav .ant-tabs-nav-wrap) {
		justify-content: center;
	}

	:deep(.ant-tabs-tab) {
		font-size: 16px;

	}

	.ant-btn.ant-btn-block {
		height: 40px;
		border-radius: 15px;
		font-size: 16px;
	}

	.ant-input-lg {
		font-size: 16px;
		padding: 7px 11px;
		border: 0;
		border-bottom: 3px solid #F3F3F3;
	}

	.remember {
		display: flex;
		justify-content: space-between;
		font-size: 16px;
		color: #A8A8A8;
	}

	.ant-form label {
		font-size: 16px;
		color: #FE8326;
	}
	.sub2{
		margin-top: 18px !important;
	}
</style>
