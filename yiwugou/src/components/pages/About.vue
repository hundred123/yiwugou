<script setup>
    import Content from '@/components/content/Content.vue'
    import topBar from '@/components/topbar/topBar.vue'
    import { useRouter } from 'vue-router';
    import { useState } from "@/store/pageDirection"
    import { LeftOutlined, CloseOutlined } from '@ant-design/icons-vue'

    const router = useRouter();
    const state = useState();

    const back = () => {
    state.setDirection("backward")
    router.go(-1)
    }
</script>
<template>
  <div>
    <top-bar>
        <template v-slot:left>
            <left-outlined class="left" @click="back" />
        </template>
        <template v-slot:middle>
            <h1 class="title">关于义乌购</h1>
        </template>
        <template v-slot:right>
            <close-outlined class="close" @click="back" />
        </template>
    </top-bar>
    <content class="content">
        <div>
            义乌购（www.yiwugo.com），2012年10月21日上线，为浙江中国小商品城集团股份有限公司（股票代码：600415）旗下的义乌小商品官方平台。2014年10月，控股子公司浙江义乌购电子商务有限公司成立并运营义乌购。
        </div>
    
        <div>义乌购的定位：义乌小商品线上市场</div>
    
        <div>1.把义乌小商品搬上网，线上线下对应，找货更方便。</div>
        <div>2.覆盖义乌小商品市场、专业街、产业带等优质供应商，助力中小微企业开拓线上市场。</div>
        <div>3.义乌购为小商品商家量身打造，操作简单，通过智能流量分发机制，大幅降低电商流量成本。</div>
        <div>义乌购的特点：一手货源，品类丰富，交易有保障</div>
        <div>1.一手货源，服务产业链上游200万家中小微企业，背靠“全球最大小商品批发市场”，品质商品更低价；</div>
        <div>2.品类丰富，在线商品达500万，涉及26个大类，只有想不到，没有买不到；</div>
        <div>3.交易有保障，360度全景店铺，线上线下一一对应，依托实体市场的诚信优势，让每一笔交易都有诚信保障。</div>
        <div>目前，义乌购平台入驻商家5万，日均访客数80万，日均浏览量（PV）1500万，注册采购商达到800 万，其中10%为海外用户。义乌购已成为全球最大的小商品批发平台。
            小商品，就上义乌购！</div>
    
        <div>增值电信业务经营许可证: B2-20160949 浙网食 A33070004</div>
    
        <div>互联网药品信息服务资格证书（浙）－经营性－2020－0009</div>
    
        <div>医疗器械网络交易服务第三方平台备案：（浙）网械平台备字[2020]第00005号</div>
    
        <div>浙公网安备 33078202000413号 备案：浙ICP备15028362号</div>
    
    </content>
  </div>
</template>
<style scoped>
.left,
 .close{
    font-size: 30px;
    color: #fff;
}
.close{
    margin-left: 20px;
}
.title {
    font-size: 18px;
    color: #fff;
    margin: 0 0 0 10px;
    font-weight: bold;
}
.content {
    font-size: 16px;
    margin-top: 20px;
}

.content div {
    margin-bottom: 20px;
}
</style>