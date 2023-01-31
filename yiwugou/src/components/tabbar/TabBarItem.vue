<script setup>
import { computed } from "vue"
import { useRoute, useRouter } from 'vue-router';
/* 
    route:当前激活或者正访问的这个路由
    router：项目路由的全局对象

*/
const route = useRoute()
const router = useRouter()
// console.log('route:', route);
// console.log('router:', router);
// if (route.path == props) {
//     const route = useRoute()
//     const router = useRouter()
//     console.log('route:', route);
//     console.log('router:', router);
// }
const props = defineProps({
    name: {
        type: String,
        default: '标题'
    },
    path: String
})
const doAcitve = () => {
    if (route.path !== props.path) {
        router.replace({
            path: props.path
        })
    }
}

const activeStyle = computed(() => {
    /*  
      1.拿到当前这个item代表的路由地址 props.path
      2.拿到当前正在访问的地址     route.path
      3.判断两个地址是否一样，如果一样那么将样式激活
    */
    return route.path === props.path ? { color: "#F0500E" } : null
})
</script>
<template>
    <div class="tab-bar-item" @click="doAcitve" :style="activeStyle">
        <slot name='icon'>
            <!-- 如果不传的话，就显示下面的 -->
            <div class="iconfont icon-shouye"></div>
        </slot>
        <div style="font-size:13px;">{{name}}</div>
    </div>
</template>
<style>
.tab-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}
</style>
