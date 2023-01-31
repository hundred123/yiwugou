<script setup>
import topBar from '@/components/topbar/topBar.vue'
import Content from '@/components/content/Content.vue'

import { watch,ref } from 'vue';
import { SearchOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router';
import { useState } from "@/store/pageDirection"
import { restHttp } from '@/kits/HttpKit';
import { img_url } from '@/kits/ImgKit'
import { useCategoryState } from "@/store/category"

const useCategory = useCategoryState()
const router = useRouter();
const state = useState();
const route = useRoute();
const categoryResult = ref([])
const title = ref([])
const tabName = useCategory.categoryItem
const goto = (path) => {
    state.setDirection("forward")
    router.push({
        path
    })
}

const back = () =>{
    state.setDirection("backward")
    router.go(-1)
}

const query = {
    name: route.query.name,
    tabName
}
// console.log(query.name);
const fetchData = async () =>{
    try {
        const res = await restHttp('/categoryresult',query)
        // console.log(res.data);
        // console.log(res.data.categoryResult[0].name);
        categoryResult.value = res.data.goods
        title.value = res.data.categoryResult[0].name
        return { code: "ok" }
    } catch (error) {
        
    }
}
fetchData()
watch(() => route.path, (curr) => {
    if (curr.indexOf('/categoryresult/') >= 0) {
        fetchData()
    }
})

const gotoDetail = (name,id)=>{
    state.setDirection("forward")
    router.push({
        path: '/gooddetail',
        query: {
            name,
            id
        }
    })
}

</script>

<template>
    <div>
        <topBar>
            <template v-slot:left>
                <left-outlined class="left" @click="back()" />
            </template>
            <template v-slot:middle>
                <h1 class="title">{{title}}</h1>
            </template>
            <template v-slot:right>
                <search-outlined class="right" @click="goto('/search')" />
            </template>
        </topBar>
        <content :hasTabBar="false" :pull="true" :refreshFunc="fetchData" style="padding: 0px;">
            <div class="top">商品({{categoryResult.length}})</div>
            <div class="goods">
                <div v-for="(item,index) in categoryResult" class="good-item" @click="gotoDetail(item.desc,item.id)">
                    <img :src="img_url.img + item.imgpath" class="good-img" />
                    <div class="good-desc">{{item.desc}}</div>
                </div>
            </div>
        </content>
    </div>
</template>
<style scoped>
.left,.right {
    font-size: 30px;
    color: #fff;
}
.title{
    font-size: 18px;
    color: #fff;
    margin: 0 0 0 10px;
    font-weight: bold;
}
.top {
    width: 100px;
    height: 35px;
    line-height: 35px;
    background-color: #FD791C;
    margin-left: 40px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    border-radius: 24px;
}
.goods {
    display: flex;
    flex-wrap: wrap;
}
.good-item {
    width: 185px;
    /* height: 185px; */
    /* background-color: #FD791C; */
    margin: 5px;
}
.good-img{
    width: 100%;
    height: 185px;
}
.good-desc {
    width: 176px;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:clip;
}
</style>