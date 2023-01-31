<script setup>
import TabBar from '@/components/tabbar/TabBar.vue'
import TabBarItem from '@/components/tabbar/TabBarItem.vue'
</script>

<template>
    <div>
        <router-view></router-view>
        <!-- router-view可以理解为页面的占位符 -->
        <tab-bar>
            <tab-bar-item name="首页" path="/index/home">
                <template v-slot:icon>
                    <div class="iconfont icon-shouye" style="font-size:20px"></div>
                </template>
            </tab-bar-item>
            <tab-bar-item name="类别" path="/index/category">
                <template v-slot:icon>
                    <div class="iconfont icon-fenlei" style="font-size:20px"></div>
                </template>
            </tab-bar-item>
            <tab-bar-item name="购物车" path="/index/shopcart">
                <template v-slot:icon>
                    <div class="iconfont icon-gouwuchezhengpin" style="font-size:20px"></div>
                </template>
            </tab-bar-item>
            <tab-bar-item name="我的" path="/index/account">
                <template v-slot:icon>
                    <div class="iconfont icon-wodeqianfenleishouye" style="font-size:20px"></div>
                </template>
            </tab-bar-item>
        </tab-bar>
    </div>
</template>

   
