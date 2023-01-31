<script setup>
import topBar from '@/components/topbar/topBar.vue'
import Content from '@/components/content/Content.vue'
import { useRouter } from 'vue-router';
import { useState } from "@/store/pageDirection"
import { LeftOutlined } from '@ant-design/icons-vue'
import { restHttp } from '@/kits/HttpKit';
import { reactive, getCurrentInstance, inject } from 'vue'


const router = useRouter();
const instance = getCurrentInstance()
const state = useState();
const message = inject("$message")
const form = reactive({
    id: '',
    pwd: '',
})
const rules = {
    id: [
        { required: true, message: '请输入手机号', trigger: 'blur' },  // 必填的校验
        { min: 11, max: 11, message: '请输入合法的手机号', trigger: "blur" },  // 邮箱格式的校验规则
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' }, // 必填的校验规则
        { min: 6, max: 20, message: '密码的长度再6个字符以上', trigger: "blur" },  // 长度的校验规则
    ],
    pwd1: [
        { required: true, message: '请输入密码', trigger: 'blur' }, // 必填的校验规则
        { min: 6, max: 20, message: '密码的长度再6个字符以上', trigger: "blur" },  // 长度的校验规则
    ],
}
const back = () => {
    state.setDirection("backward")
    router.go(-1)
}
const login = () => router.replace({ path: '/login' })
const register = async () => {
    const form = instance.refs.registerForm
    // console.log(form);
    try {
        const formData = await form.validate()
        // console.log(formData); // 拿到表单元素的对象 
        if(formData.pwd === formData.pwd1){
            const key = 'loading'
            message.loading({
                key,
                content: "注册中..."
            })
            const res = await restHttp('/register', formData)
            if (res.code == 1) {
                message.success({
                    key,
                    content: res.msg,
                    duration: 2
                })
                login()
            } else {
                message.warning({
                    key,
                    content: res.msg,
                    duration: 2
                })
            }
        }else{
            const key = 'loading'
            message.warning({
                key,
                content:'两次密码不一致',
                duration:2
            })
        } 
        
       
    } catch (error) {

    }
}
</script>
<template>
   <div>
    <top-bar>
        <template v-slot:left>
            <left-outlined class="left" @click="back()" />
        </template>
        <template v-slot:middle>
            <h1 class="title">帐号注册</h1>
        </template>
    </top-bar>
    <content>
        <a-form ref="registerForm" :model="form" layout="vertical" :rules="rules" style="margin-top:30px">
            <a-form-item name="id">
                <a-input placeholder="请输入手机号" size="large" v-model:value='form.id'></a-input>
            </a-form-item>
            <a-form-item name="pwd">
                <a-input placeholder="请输入密码" size="large" autocomplete="on" type="password" v-model:value='form.pwd'></a-input>
            </a-form-item>
            <a-form-item name="pwd1">
                <a-input placeholder="请再次输入密码" size="large" autocomplete="on" type="password" v-model:value='form.pwd1'></a-input>
            </a-form-item>
            <a-form-item>
                <a-button @click="register" type="primary" size="large" block>立即注册</a-button>
            </a-form-item>
        </a-form>
    </content>
   </div>
    
</template>
<style scoped>
.left {
        font-size: 30px;
        color: #fff;
    }

    .title {
        font-size: 18px;
        color: #fff;
        text-align: center;
        font-weight: bold;
    }
        :deep(.ant-tabs>.ant-tabs-nav .ant-tabs-nav-wrap) {
            justify-content: center;
        }
    
        :deep(.ant-tabs-tab) {
            font-size: 16px;
    
        }
    
        .ant-btn.ant-btn-block {
            height: 50px;
            border-radius: 15px;
            font-size: 16px;
        }
    
        .ant-input-lg {
            font-size: 16px;
            padding: 7px 11px;
            border: 0;
            border-bottom: 3px solid #F3F3F3;
        }
</style>