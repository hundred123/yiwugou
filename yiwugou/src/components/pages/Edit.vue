<script setup>
import topBar from '@/components/topbar/topBar.vue'
import Content from '@/components/content/Content.vue'
import { useRouter } from 'vue-router';
import { useState } from "@/store/pageDirection"
import { LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons-vue'
import {ref} from 'vue'
import { getItem } from '@/kits/LocalStorageKit.js'

const router = useRouter();
const state = useState();
const avatar = ref((getItem("avatar") && getItem("avatar") !== "") ? getItem("avatar") : "")
const userId = ref((getItem("userId") && getItem("userId") !== "") ? getItem("userId") : "")

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
const loginStatus = ref((getItem("token") && getItem("token") !== "") ? true : false)

const menus = ref([
    {name:'帐号',content:userId},
    { name: '手机号', content: userId, path:'/blankpage'},
    { name: '绑定微信登录', content: "去绑定", path:'/blankpage'},
    { name: '开启微信通知', content: "去开启", path:'/blankpage'},
    { name: '昵称', content: userId, path:'/blankpage'},
    { name: '注册时间', content: "去开启", path:'/blankpage'},
    { name: '我的画像', path:'/blankpage'},
    { name: 'IP所属地', content: "天津"},

])

const uploadAvatar = () => goto("/uploadavatar")
</script>
<template>
    <div>
        <top-bar>
            <template v-slot:left>
                <left-outlined class="left" @click="back()" />
            </template>
            <template v-slot:middle>
                <h1 class="title">我的资料</h1>
            </template>
        </top-bar>
        <content style="padding:0 10px;">
            <div class="avatar">
                <div>头像</div>
                <div class="avatar-item">
                    <template v-if="loginStatus">
                        <a-avatar size="large" :src="avatar" shape="square" @click="uploadAvatar">
                            <template #icon>
                                <UserOutlined />
                            </template>
                        </a-avatar>
                    </template>
                </div>
            </div>
            <a-list :data-source="menus">
                <template #renderItem="{item}">
                    <a-list-item>
                        <div @click="goto(item.path)">{{item.name}}</div>
                        <a slot="action" @click="goto(item.path)">
                            <div v-if="!item.path" style="color: #909090;">{{item.content}}</div>
                            <div v-else class="item-right">
                                <div>{{item.content}}</div>
                                <div v-if="!item.content"></div>
                                <div v-else><div>
                                    <right-outlined />
                                </div></div>
                            </div>
                        </a>
                    </a-list-item>
                </template>
            </a-list>
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
        margin: 0 0 0 10px;
        font-weight: bold;
    }
    .avatar{
        height: 110px;
        /* background-color: #676863; */
        font-size: 15px;
        line-height: 110px;
        border-bottom:1px solid #f0f0f0;
        color: #393939;
        display: flex;
        justify-content: space-between;
    }
    .ant-list-item {
        padding: 25px 0;
        color: #393939;
        font-size: 15px;
    }
    .ant-avatar-lg.ant-avatar-icon {
        font-size: 78px !important;
    }
    .ant-avatar-lg {
        width: 100px !important;
        height: 100px !important;
        line-height: 90px !important;
    }
    .ant-avatar {
        background: #FE6500 !important;
    }
    .item-right{
        display: flex;
        color: #909090;
    }
</style>