<script setup>
import topBar from '@/components/topbar/topBar.vue'
import Content from '@/components/content/Content.vue'
import FooterBar from '@/components/footerbar/FooterBar.vue'

import Modal from 'ant-design-vue/lib/modal';
import { useRouter } from 'vue-router';
import { useState } from "@/store/pageDirection"
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { ref, inject } from 'vue'
import { getItem,clearItem } from '@/kits/LocalStorageKit.js'


const router = useRouter();
const state = useState();
const message = inject("$message")

const back = () => {
    state.setDirection("backward")
    router.go(-1)
}
const loginStatus = ref((getItem("token") && getItem("token") !== "") ? true : false)
const userName = ref((getItem("userName") && getItem("userName") !== "") ? getItem("userName") : "")
const avatar = ref((getItem("avatar") && getItem("avatar") !== "") ? getItem("avatar") : "")

const menus = ref(loginStatus.value ? [
    { name: '修改密码', path: '/blankpage' },
    { name: '开通卖家功能', path: '/blankpage' },
    { name: '检查版本', path: '/version' },
    { name: '关于义乌购', path: '/about' },
    { name: '客服电话 : 0579-81530000', path: '/tel' },
    { name: '在线人工客服', path: '/blankpage' },
    { name: '个性化推荐', path: '/blankpage' },
    { name: '浏览记录', path: '/blankpage' },
    { name: '清除缓存', path: '/blankpage' },
    { name: '帐号设置', path: '/blankpage' },
    { name: '隐私管理', path: '/blankpage' },
] : [{ name: '修改密码', path: '/login' },
    { name: '开通卖家功能', path: '/login' },
    { name: '检查版本', path: '/version' },
    { name: '关于义乌购', path: '/about' },
    { name: '客服电话 : 0579-81530000', path: '/tel' },
    { name: '在线人工客服', path: '/login' },
    { name: '个性化推荐', path: '/blankpage' },
    { name: '浏览记录', path: '/blankpage' },
    { name: '清除缓存', path: '/blankpage' },
    { name: '帐号设置', path: '/login' },
    { name: '隐私管理', path: '/blankpage'}])

const goto = (path) =>{
    switch (path) {
        case "/version":
            message.warning("当前版本 V3.8.6")
            break;
        case "/tel":
            tel()
            break;
        case "/logout":
            logout()
            break;
        default:
            state.setDirection("forward")
            router.push({ path })
            break;
    }
}

const tel = () =>{
    Modal.confirm({
        title: '您确定要拨打0579-81530000吗?',
        okText: '确定',
        cancelText: '取消',
        centered: true
    })
}
const logout = ()=>{
    Modal.confirm({
        title:'确定退出当前帐号吗？',
        okText:'确定',
        cancelText:'取消',
        centered:true,
        onOk(){
            clearItem("token")
            // clearItem("userName")
            // clearItem("userId")
            clearItem("avatar")
            loginStatus.value = false;
            userName.value = "";
            avatar.value = "";
            menus.value = [
                { name: "修改密码", path: "/login" },
                { name: '开通卖家功能', path: '/login' },
                { name: '在线人工客服', path: '/login' },
                { name: '帐号设置', path: '/login' },
            ]
            back()
            
        }
    })
}
</script>
<template>
    <div>
				<top-bar style="box-shadow:unset;">
					<template v-slot:left>
						<left-outlined class="left" @click="back" />
					</template>
					<template v-slot:middle>
						<div class="online_pay">设置</div>
					</template>
				</top-bar>
				
        <content :hasTabBar="true" class="content">
            <div v-if="!loginStatus">
                <a-list :data-source="menus" >
                    <template #renderItem="{item}">
                        <a-list-item>
                            <div @click="goto(item.path)">{{item.name}}</div>
                            <a slot="action" @click="goto(item.path)">
                                <right-outlined class="item-right"/>
                            </a>
                        </a-list-item>
                    </template>
                </a-list>
            </div>
            <div v-else>
                <a-list :data-source="menus">
                    <template #renderItem="{item}">
                        <a-list-item>
                            <div @click="goto(item.path)">{{item.name}}</div>
                            <a slot="action" @click="goto(item.path)">
                                <div style="color: #909090;">
                                    <right-outlined />
                                </div>
                            </a>
                        </a-list-item>
                    </template>
                </a-list>
                <a-button class="logout" type="primary" block @click="goto('/logout')">退出登录
                </a-button>
                
            </div>
            <footer-bar></footer-bar>
        </content>
    </div>
</template>
<style scoped>
	/* 最顶部 */
	.left {
		color: white;
		font-size: 24px;
		font-weight: bold;
		margin-left: -10px;
		margin-top: 3px;
	}
	.online_pay {
		font-size: 18px;
		color: #F8F3EC;
		margin-top: 3px;
		margin-left: -10px;
	}
	
	.content{
		padding: 0 10px;
		height: calc(100vh - 50px - 58px);
	}
	
.title {
    font-size: 18px;
    color: #fff;
    margin: 0 0 0 10px;
    font-weight: bold;
}
.ant-list-item{
    padding: 20px 0;
    color: #676863;
    font-size: 15px;
}
.ant-btn.ant-btn-block{
    height: 50px;
}

.logout{
    font-size: 16px;
}
</style>