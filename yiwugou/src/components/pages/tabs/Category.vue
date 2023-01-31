<script setup>
import Content from '@/components/content/Content.vue'
import topBar from '@/components/topbar/topBar.vue'

import { ref } from 'vue';
import { restHttp } from '@/kits/HttpKit';
import { img_url } from '@/kits/ImgKit'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router';
import { useState } from "@/store/pageDirection.js"
import { useCategoryState } from "@/store/category"

const category = ref([])
const router = useRouter();
const state = useState();
const useCategory = useCategoryState()
const goto = (path) => {
    state.setDirection("forward")
    router.push({
        path
    })
}
const getTabsKey = (event) => {
    useCategory.setCtegoryItem(event)
    // tabName.value = event
}
const callback = val => {
    // console.log(val);
};
const categoryData = async () => {
    try {
        const res = await restHttp('/categorylist');
        // console.log(res.data);
        category.value = res.data
    } catch (error) {

    }
}


const goResult = (searchContent) => {
    state.setDirection("forward")
    router.push({
        // path: '/categoryresult',
        path: '/searchresult',
        query: {
            searchContent
        }
    }) 
} 
categoryData()
</script>


<template>
    <topBar>
        <template v-slot:middle>
            <h1 class="title">分类</h1>
        </template>
        <template v-slot:right>
            <search-outlined class="right" @click="goto('/search')" />
        </template>
    </topBar>
    <content :hasTabBar="false">
        <a-tabs tab-position="left" @tabScroll="callback" @tabClick="getTabsKey">
            <a-tab-pane v-for="(goods,index) in category" :key="goods.name" :tab="`${goods.name}`">
                <div class="category-right">
                    <div v-for="(item,index) in goods.items"  class="good-item" @click="goResult(item.name)">
                        <img :src="img_url.img + item.imgpath" class="good-img"/>
                        {{item.name}}
												<!-- <product-card-vertical style="margin-bottom: 2px;" :product='item'></product-card-vertical> -->
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </content>
</template>
<style scoped>
* {
    margin: 0;
    padding: 0;
}

.title {
    font-weight: bold;
    font-size: 18px;
    color: #fff;
    text-align: center;
    padding-top: 0px;
    box-sizing: border-box;
    /* margin-right: 70px; */
}

.right {
    font-size: 30px;
    color: #fff;
}



.category-right {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}
.good-item {
    display: flex;
    flex-direction: column;
    width: 66px;
    margin: 12px;
    text-align: center;
    white-space: nowrap;
}
:deep(.ant-tabs-nav){
	height: calc(100vh - 50px - 58px);
	overflow-y: auto;
}
:deep(.ant-tabs-nav-list > .ant-tabs-tab){
    display:block;
    background-color: #f5f5f5;
    height: 70px;
    line-height: 60px;
    font-size: 16px;
    margin: 0 !important ;
}
:deep(.ant-tabs-nav-list >.ant-tabs-tab-active){
    background-color: #fff;
    /* font-weight: bold; */
    border: 0 !important;
}

:deep(.ant-tabs-left>.ant-tabs-content-holder>.ant-tabs-content>.ant-tabs-tabpane){
    padding-left: 0;
}
.good-img {
    margin-bottom: 10px;
    width: 60px;
    height: 60px;
}

.ant-tabs-tab-active {
    background-color: #fff;
}



</style>