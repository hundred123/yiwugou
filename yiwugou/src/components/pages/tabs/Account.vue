<script setup>
import topBar from '@/components/topbar/topBar.vue'
import Content from '@/components/content/Content.vue'

import { ref,inject,onMounted} from 'vue'
import { SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router';
import { useState } from "@/store/pageDirection"
import { getItem } from '@/kits/LocalStorageKit.js'
import { restHttp } from '@/kits/HttpKit';
import ProductCardVertical from '@/components/product/ProductCardVertical.vue'

const router = useRouter();
const state = useState();
	const message = inject('$message')
	let start = parseInt(Math.random() * (50 - 0)) + 0,count = 4
	let data = ref([])
	let lodingMore = ref(false)
	const awaitCount=ref(0)
	const deliveryCount=ref(0)
	const initData = async () => {
		// let res = await restHttp('/totalCategoryListItem', options)
		// console.log('这是首页返回回来的数据：', res)
		let options = {
			start,
			count
		}
		try {
			let res = await restHttp('/totalCategoryListItem',options)
			// console.log('rerere',res)
			if (res && res.length > 0) {
				data.value = data.value.concat(res)
			}
			// console.log(data.value)
			return {
				code: 'ok'
			}
		} catch (e) {
			message.error('initData错误',e.message)
		}
	}
// 加载更多选项
	const onLoadMore = async () => {
		try {
			// 点击加载更多后出现小圆圈
			start = parseInt(Math.random() * (50 - 0)) + 0 + count
			let options3 = {
				start,
				count
			}
			lodingMore.value = true
			const res = await initData(options3)
			// 查询完之后让小圆圈消失
			lodingMore.value = false
			return {
				code: 'ok'
			}
		} catch (e) {
			console.log(e.message)
			message.error('onLoadMore错误',e.message)
		}
	}

const goto = (path) => {
    state.setDirection("forward")
    router.push({
        path
    })
}

const loginStatus = ref((getItem("token") && getItem("token") !== "") ? true : false)
const userId = ref((getItem("userId") && getItem("userId") !== "") ? getItem("userId") : "")
const avatar = ref((getItem("avatar") && getItem("avatar") !== "") ? getItem("avatar") : "")

const fetchData = async () =>{
    return {code: "ok"}
}
// 待付款的内容开始
	const getAwaitPaid= async()=>{
		// return { code: "ok" }
		const await_paid_Data = await restHttp('/getorder')
		let await_paid_list=await_paid_Data.data.filter(item=>{
			return item.status==='1'
		})
		awaitCount.value=await_paid_list.length
	}
//  待付款的内容结束
// 待发货的内容开始
	const getDelivery= async()=>{
		// return { code: "ok" }
		const await_paid_Data = await restHttp('/getorder')
		let await_paid_list=await_paid_Data.data.filter(item=>{
			return item.status==='2'
		})
		deliveryCount.value=await_paid_list.length
	}
//  待发货的内容结束
// 去发货页面
	const gotoDelivery=()=>{
		state.setDirection("forward")
		router.push({
			path:'/goodstatus',
			query:{
				selectId:2
			}
		})
	}
// 去付款页面
	const gotoPay=()=>{
		state.setDirection("forward")
		router.push({
			path:'/goodstatus',
			query:{
				selectId:1
			}
		})
	}
// 下拉刷新开始
const flushed=async ()=>{
	start = parseInt(Math.random() * (50 - 0)) + 0
	const res=await onLoadMore()
	if (res.code === 'ok') {
		return res
		// return {code: 'ok'}
	} else {
		return {
			code: 'fail'
		}
	}
}

// 下拉刷新结束

	// 页面加载完毕之后
	onMounted(() => {
		initData()
		fetchData()
		getAwaitPaid()
		getDelivery()
	})
</script>
<template>
   <div>
    <!-- <content :hasTabBar="false" :pull="true" :refreshFunc="fetchData" style="padding:0"> -->
    <content :hasTabBar='false' :pull='true' :refreshfunc='flushed' style="padding:0">
        <div class="topbar">
            <topBar class="account">
                <template v-slot:middle>
                    <div>
                        <template v-if="loginStatus">
                            <div class="user">
                                <a-avatar size="large" shape="square" v-if="avatar" :src="avatar">
                                    <template #icon>
                                        <UserOutlined />
                                    </template>
                                </a-avatar>
                                <div class="userName" style="margin: 10px 20px;">
                                    <div class="id">{{userId}}<span class="iconfont icon-shouji"></span></div>
                                    <button class="btn" @click="goto('/edit')">编辑资料</button>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="protrait">
                                <a-avatar shape="square" size="large" @click="goto('/login')">
                                    <template #icon>
                                        <UserOutlined />
                                    </template>
                                </a-avatar>
                                <span class="title">登录/注册</span>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-slot:right>
                    <setting-outlined class="right" @click="goto('/settings')" />
                </template>
            </topBar>
        </div>
        <div class="center-item" v-if="loginStatus">
            <div class="center-item-title">
                <div>我的订单</div>
                <div class="center-item-right" @click="goto('/goodstatus')">查看全部 > </div>
            </div>
            <div class="center-item-icon">
                <div class="center-item-name" @click="gotoPay">
									<van-badge :content="awaitCount" :show-zero='false'>
									  <!-- <div class="child" /> -->
                    <div class="iconfont icon-daifukuan"></div>
									</van-badge>
                    <div style="font-size: 12px;">待付款</div>
                </div>
                <div class="center-item-name"  @click="gotoDelivery">
									<van-badge :content="deliveryCount" :show-zero='false'>
                    <div class="iconfont icon-daifahuo"></div>
									</van-badge>
                    <div style="font-size: 12px;">待发货</div>
                </div>
                <div class="center-item-name">
                    <div class="iconfont icon-daishouhuo"></div>
                    <div style="font-size: 12px;">待收货</div>
                </div>
                <div class="center-item-name">
                    <div class="iconfont icon-31daipingjia"></div>
                    <div style="font-size: 12px;">待评价</div>
                </div>
                <div class="center-item-name">
                    <div class="iconfont icon-shouhouwuyou"></div>
                    <div style="font-size: 12px;">退款/售后</div>
                </div>
            </div>
        </div>
        <div>
            <div class="center-manage" v-if="loginStatus">
                <div class="center-manage-icon">
                    <div class="center-manage-name">
                        <div class="iconfont icon-shangpinshoucang"></div>
                        <div style="font-size: 12px;">商品收藏</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-guanzhu"></div>
                        <div style="font-size: 12px;">商铺关注</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-icon-safe-bluefuben"></div>
                        <div style="font-size: 12px;">账户资金</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-liulanjilu"></div>
                        <div style="font-size: 12px;">浏览历史</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-pingjiaguanli"></div>
                        <div style="font-size: 12px;">评价管理</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-shouhuodizhi"></div>
                        <div style="font-size: 12px;">收货地址</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-shouhuodizhi"></div>
                        <div style="font-size: 12px;">发布求购</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-lingjuanzhongxin"></div>
                        <div style="font-size: 12px;">领劵中心</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-guanfangkefu"></div>
                        <div style="font-size: 12px;">官方客服</div>
                    </div>
                </div>
            </div>
            <div class="center-mange-unlogin" v-else>
                <div class="center-manage-icon">
                    <div class="center-manage-name">
                        <div class="iconfont icon-shangpinshoucang"></div>
                        <div style="font-size: 12px;">商品收藏</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-icon-safe-bluefuben"></div>
                        <div style="font-size: 12px;">账户资金</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-liulanjilu"></div>
                        <div style="font-size: 12px;">浏览历史</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-pingjiaguanli"></div>
                        <div style="font-size: 12px;">评价管理</div>
                    </div>
                    <div class="center-manage-name">
                        <div class="iconfont icon-lingjuanzhongxin"></div>
                        <div style="font-size: 12px;">领劵中心</div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="goods" v-if="loginStatus">
                <div class="goods-title">精选推荐</div>
								<!-- 商品卡片 -->
								<div class="category-list">
									<a-list :data-source='data'>
										<template #loadMore>
											<div v-if="data.length>0"
												:style="{textAlign: 'center',marginTop: '12px',height: '32px', lineHeight: '32px'}">
												<a-spin v-if="lodingMore"></a-spin>
												<a-button v-else style="color: #7f7f7f;" @click="onLoadMore">loading more</a-button>
											</div>
										</template>
										<template #renderItem='{item}'>
											<!-- <product-card :product='item' @click="goto(item)"></product-card> -->
											<product-card-vertical style="margin-bottom: 2px;" :product='item'></product-card-vertical>
										</template>
									</a-list>
									
									<!-- <product-card-vertical style="margin-bottom: 2px;" v-for="item in categoryList" :product='item'>
									</product-card-vertical> -->
								</div>
            </div>
            <div class="goods-unlogin" v-else>
                <div class="goods-title">精选推荐</div>
								<!-- 商品卡片 -->
								<div class="category-list">
									<a-list :data-source='data'>
										<template #loadMore>
											<div v-if="data.length>0"
												:style="{textAlign: 'center',marginTop: '12px',height: '32px', lineHeight: '32px'}">
												<a-spin v-if="lodingMore"></a-spin>
												<a-button v-else style="color: #7f7f7f;" @click="onLoadMore">loading more</a-button>
											</div>
										</template>
										<template #renderItem='{item}'>
											<!-- <product-card :product='item' @click="goto(item)"></product-card> -->
											<product-card-vertical style="margin-bottom: 2px;" :product='item'></product-card-vertical>
										</template>
									</a-list>
									
									<!-- <product-card-vertical style="margin-bottom: 2px;" v-for="item in categoryList" :product='item'>
									</product-card-vertical> -->
								</div>
            </div>
        </div>
    </content>
   </div>
</template>
<style scoped>
.topbar{
    position: relative;
}
.account {
    height: 230px;
    position: relative;
}

.right {
    font-size: 30px;
    position: absolute;
    top: 10px;
    right: 6px;
    color: #fff;

}

.user {
    display: flex;
    position: absolute;
    top: 30px;
    left: 28px;
}

.id {
    font-size: 18px;
    color: #fff;
    margin-bottom: 10px;
}

.btn {
    width: 100px;
    border: 2px solid #fff;
    background-color: #FE6500;
    color: #fff;
    border-radius: 10px;
}

.protrait {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 16px;
    color: #fff;
    margin-top: 10px;
}

.avatar {
    width: 100%;
}

.ant-avatar-square {
    border-radius: 22px !important;
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
    border: 3px solid #fff;
}
.center-item{
  position:absolute;
  top: 160px;
  left: 13px;
  width: 364px;
  height: 126px;
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
}

.center-manage{
    position: absolute;
    top: 310px;
    left: 13px;
    width: 364px;
    height: 130px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
}
.center-mange-unlogin {
    margin: 20px 12px;
    width: 364px;
    height: 70px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
}
.center-item-title{
    display: flex;
    justify-content: space-between;
}
.center-item-right{
    font-size: 12px;
		color: #FF6600;
}
.center-item-icon{
    display: flex;
    justify-content: space-between;
}
.center-manage-icon{
    display: flex;
    flex-wrap: wrap;
}
.center-item-name{
    margin: 2px 8px;
    text-align: center;
    font-size: 14px;
}
.center-manage-name{
    margin: 4px 12px;
    text-align: center;
    font-size: 14px;
}
.center-item-name .iconfont{
    font-size: 30px;
    color: #FE6500;
}
.center-manage-name .iconfont{
    font-size: 24px;
}
.goods{
    position: absolute;
    top: 55%;
    /* left: 43%; */
}

.goods-title {
    font-size: 16px;
		text-align: center;
}
	/* 商品列表 */
	.category-list {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 14px;
	}
	:deep(.ant-list-items) {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	/* badge图标 */
	:deep(.van-badge--top-right){
		top: 16px;
		right: 6px;
	}
	:deep(.van-badge){
		background-color: #ff6600;
	}
</style>