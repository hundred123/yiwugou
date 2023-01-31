<script setup>
import TopBar from '@/components/topbar/TopBar.vue';
import Content from '@/components/content/Content.vue'

import { ref, reactive, inject } from 'vue'
import { useState } from "@/store/pageDirection"
import { useRouter } from 'vue-router'
import { LeftOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { getItem, setItem, clearItem } from '@/kits/LocalStorageKit.js'
import { baseURL } from "@/kits/HttpKit.js"

const router = useRouter()
const state = useState();
const avatar = ref(getItem("avatar"))
const message = inject("$message")
const data = reactive({
    token: getItem("token"),
    userId: getItem("userId"),
})
const action = baseURL + "/uploadimg"
// console.log("action",action);
const back = () => {
    state.setDirection("backward")
    router.go(-1)
}

const handleChange = res => {
    if (res.file.status === "done") {
        // console.log(res)
        switch (res.file.response.code) {
            case 1:
                message.success(res.file.response.msg)
                avatar.value = res.file.response.data.avatar
                setItem("avatar", res.file.response.data.avatar)
                break;
            case 101:
            case 102:
                message.warning(res.file.response.msg)
                clearItem("token");
                state.setDirection("forward")
                router.push({
                    path: "/login"
                })
                break;
            default:
                message.warning('111222',res.msg)
                break;
        }

    } else if (res.file.status === "error") {
        message.error(res.file.response.msg)
    }
}
</script>
<template>
    <div>
        <top-bar style="box-shadow:unset">
            <template v-slot:left>
                <left-outlined class="left" @click="back()" />
            </template>
            <template v-slot:middle>
                <h1 class="title">设置头像</h1>
            </template>
        </top-bar>
        <content>
            <div class="pic">
                <a-avatar v-if="avatar === ''" shape="square">
                    <div class="pic-item">义乌购</div>
                </a-avatar>
                <a-avatar v-else :src="avatar" shape="square"></a-avatar>
            </div>
            <div class="btn">
                <a-upload :data="data" name="file" :action="action" @change="handleChange">
                    <a-button size="large" style="width:300px;">
                        <upload-outlined></upload-outlined>
                        上传头像
                    </a-button>
                </a-upload>
            </div>
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
.pic {
    width: 280px;
    height: 280px;
    /* background-color: #efefef; */
    margin-top: 30px;
    margin-left: 45px;
}
.pic-item{
    width: 230px;
    height: 230px;
    margin-top: 23px;
    background-color: #fff;
    color: #cecaca;
    font-size: 60px;
    line-height: 230px;
}
.ant-avatar {
    width: 100% !important;
    height: 100% !important;
    background-color: #e7e4e4;
}

.btn {
    display: flex;
    justify-content: center;
    margin-top: 80px;
}
</style>