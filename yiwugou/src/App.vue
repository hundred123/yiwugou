<!-- SFC   Simple Fafment Compnent -->
<script setup>
import {useState} from '@/store/pageDirection.js'	
	
import { watch, ref } from 'vue'
// router是用来操作路由的，route是用来获取路由信息的。
import { useRoute } from 'vue-router';

const transitionName = ref('')
const route = useRoute();
const state=useState()
// console.log(route);

watch(() => route.path, (curr, prev) => {
    // console.log('当前路径', curr, '上一路径', prev);
    if (curr.indexOf('/index/') >= 0 && prev.indexOf('/index/') >= 0) {
        // 在一级页面中跳转不同的选项卡
        transitionName.value = ''
    } else {
        if (state.direction == 'forward') {
            transitionName.value = 'fold-left'
        } else {
            transitionName.value = 'fold-right'
        }
    }

})
</script>

<template>
    <router-view v-slot="{Component}">
        <!-- fold-left 进入下一个页面 -->
        <!-- fold-right 回退上一个页面 -->
        <!-- transitonName -->
        <transition :name="transitionName">
            <component :is="Component"></component>
        </transition>
    </router-view>
</template>
<style>
@import '@/assets/iconfont/iconfont.css';

body {
    margin: 0px;
}

.fold-left-enter-active {
    position: fixed;
    height: 100vh;
    width: 100vw;
    animation-name: fold-left-in;
    animation-duration: 0.3s;
}

@keyframes fold-left-in {
    0% {
        transform: translate(100%, 0);
        /*此时新页面在屏幕的右侧*/
    }

    100% {
        transform: translate(0, 0);
        /*此时新页面在屏幕内*/
    }
}

.fold-right-enter-active {
    position: fixed;
    height: 100vh;
    width: 100vw;
    animation-name: fold-right-out;
    animation-duration: 0.3s;
}

@keyframes fold-right-out {
    0% {
        /* transform: translate(x,y); */
        /* transform: translate3d(x,y,z); */
        transform: translate(-100%, 0);
        /* 此时新页面在屏幕的左侧 */
    }

    100% {
        transform: translate(0, 0);
        /* 此时新页面在屏幕内 */
    }
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
    display: none;
}
</style>
