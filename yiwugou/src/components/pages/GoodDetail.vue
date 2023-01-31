<script setup>
import { ref,watch,inject} from 'vue';
import Content from '@/components/content/Content.vue';
import tabBar from '@/components/tabbar/tabBar.vue';
import { useRouter, useRoute } from 'vue-router';
import { useState } from "@/store/pageDirection";
import { LeftOutlined, ShoppingCartOutlined, SearchOutlined, EllipsisOutlined, DownOutlined ,RightOutlined } from '@ant-design/icons-vue'
import { restHttp } from '@/kits/HttpKit';
import { img_url } from '@/kits/ImgKit';
import {getItem} from '@/kits/LocalStorageKit.js';
import {useState as useCartState} from '@/store/cart.js';
const route = useRoute();
const router = useRouter();
const state = useState();
const cartState=useCartState()
const message = inject('$message')
const goodsList = ref([])
const count = ref([])
const price = ref([])
const back = () => {
    state.setDirection("backward")
    router.go(-1)
}
const goto = (path) => {
    state.setDirection("forward")
    router.push({
        path
    })
}
const query = {
    goodName:route.query.name,
    goodId:route.query.id
}
// console.log("query",query);

const fetchData = async () => {
    try {
        const res = await restHttp('/gooddetail', query)
        // console.log(res.data[0]);
        goodsList.value = res.data[0]//id,desc,count,price,shop,total
        count.value = res.data[0].count
        price.value = res.data[0].price
        // console.log('price.value', price.value);
        return { code: "ok" }

    } catch (error) {
        
    }
}
fetchData()

watch(() => route.path, (curr) => {
    if (curr.indexOf('/goodsdetail/') >= 0) {
        fetchData()
    }
})

// 添加到购物车
	const addCart = () => {
		/* 
		1.校验当前用户是否登录(查看是否有登录后的会话缓存信息 session)
				客户端本地缓存中是否在token(身份信息令牌 一串随机码，以前叫sessionID)
		2.如果存在，说明已经登录
				把当前商品加入到购物车中
		3.如果不存在，说明未登录
				页面自带跳转到登录页面
		 */
		// console.log('购物车页面')
		// router.push({
		// 	path:'/login'
		// })

		// 验证token
		const token = getItem('token')
		const userId = getItem('userId')
		if (token && token !== '') {
			// 放到全局状态管理当中
			cartState.addCart({
				token,
				userId,
				ifIncrease:true,
				good:goodsList.value//gql拿到的所有数据
			}).then(res => {
				// console.log('%%',cartState.cart)
				// console.log('购物车页面的res',res)
				switch (res.code) {
					case 1:
						message.success(res.msg)
						// router.push({
						// 	path: "/cart"
						// })
						break;
					case 101:
					case 102:
						message.warning(res.msg)
						clearItem("token");
			state.setDirection("forward")
						router.push({
							path: "/login"
						})
						break;
					default:
						message.warning(res.msg)
						break;
				}
			})
			}else {
			state.setDirection("forward")
			router.push('/login')
		}
	}
	// 立即去购买
	const buy=()=>{
		state.setDirection("forward")
		/*
		1.校验当前用户是否登录(查看是否有登录后的会话缓存信息 session)
				客户端本地缓存中是否在token(身份信息令牌 一串随机码，以前叫sessionID)
		2.如果存在，说明已经登录
				把当前商品加入到购物车中
		3.如果不存在，说明未登录
				页面自带跳转到登录页面
		 */
		// console.log('购物车页面')
		// router.push({
		// 	path:'/login'
		// })
		
		// 验证token
		const token = getItem('token')
		const userId = getItem('userId')
		if (token && token !== '') {
			// 放到全局状态管理当中
			cartState.addCart({
				token,
				userId,
				ifIncrease:true,
				good:goodsList.value//gql拿到的所有数据
			}).then(res => {
				// console.log('%%',cartState.cart)
				// console.log('购物车页面的res',res)
				switch (res.code) {
					case 1:
					// console.log('goodeList的信息##：',goodsList.value)
					goodsList.value.checked==true
						// message.success(res.msg)
						router.push({
							path: "/index/shopcart"
						})
						break;
					case 101:
					case 102:
						message.warning(res.msg)
						clearItem("token");
			state.setDirection("forward")
						router.push({
							path: "/login"
						})
						break;
					default:
						message.warning(res.msg)
						break;
				}
			})
			}else {
			state.setDirection("forward")
			router.push('/login')
		}
		// router.push('/purchase')
	}
</script>
<template>
    <div style="background-color:#EEEEEE;">
        <div class="topbar">
            <div class="left">
                <div class="bgc">
                    <left-outlined class="icon" @click="back()" />
                </div>
            </div>
            <div class="right">
                <div class="bgc">
                    <shopping-cart-outlined class="icon" @click="goto('/index/shopcart')" />
                </div>
                <div class="bgc">
                    <search-outlined class="icon" @click="goto('/search')" />
                </div>
                <div class="bgc">
									<ellipsis-outlined class="icon" />
                </div>
            </div>
        </div>
        <content style="padding: 0;">
            <div style="background-color: #fff;">
                <img v-if='goodsList.imgpath' :src="img_url.img + goodsList.imgpath" class="good-img" />
                <div class="good-desc">{{goodsList.desc}}</div>
                <div class="good-item">
                    <div class="good-price">
                        <div v-for="(item,index) in price">￥{{item}}</div>
                    </div>
                    <div class="good-count">
                        <div v-for="(item) in count">{{item}}个起批</div>
                    </div>
                </div>
                <div class="good-total">
                    <div>起批量：{{count[0]}}</div>
                    <div>可售数量：{{goodsList.total}}</div>
                </div>
            </div>
            <div class="delivery">
                <div class="delivery-item">发往</div>
                <div class="delivery-item">浙江
                    <down-outlined />
                </div>
                <div class="delivery-item">快递 ￥{{goodsList.delivery}}</div>
								<div style="margin-left: 50px;">
									<div style="color:#FD791C" @click="goto('/vrroom')">
										进店查看
									  <right-outlined />
									</div>
								</div>
            </div>
            <div class="deliver">48小时内发货, 不支持7天无理由退货</div>
            <div class="comment">
                <div class="comment-top">
                    <div>订单评价</div>
                    <div style="color:#FD791C">查看全部
                        <right-outlined />
                    </div>
                </div>
                <a-skeleton avatar :paragraph="{ rows: 2 }" />
            </div>
        </content>
        <tab-bar style="height: 75px;">
            <div class="tabbar-item">
                <div class ="iconfont icon-kefu" >
                    <div>客服</div>
                </div>
                <div class ="iconfont icon-shangpu">
                    <div>商铺</div>
                </div>
                <div class ="iconfont icon-shoucang">
                    <div>收藏</div>
                </div>
                <a-button type="primary" @click="addCart">加入购物车</a-button>
                <a-button style='background-color: #FC2E55;color: white;' @click="buy()">立即购买</a-button>
            </div>
        </tab-bar>
    </div>
   
</template>

<style scoped>
.topbar{
       position: relative;
    }
    .left{
        position: absolute;
        top:10px;
        left:10px;
        margin: 10px 0;
    }
    .right{
        position: absolute;
        top:10px;
        right: 10px;
        display: flex;
        margin: 10px 0;
    }
    .right .bgc{
        margin-left: 10px;
    }
    .bgc{
        background-color:rgb(0 0 0 / 0.3);
        width: 35px;
        height: 35px;
        border-radius: 50%;
        position: relative;
    }
    .icon {
        position: absolute;
        top:7px;
        left:6px;
        color: #EDEDED;
        font-size: 22px;
    }
    .good-img{
        width: 100%;
    }
    .good-desc{
        font-size: 16px;
        padding: 10px;
        font-weight: bold;
    }
    .good-item{
        border-top: 1px solid #f4e9e9;
        height: 70px;
        margin: 10px 10px;
        padding-top: 10px;
    }
    .good-price{
        display: flex;
        justify-content: space-around;
        font-size: 22px;
        font-weight: bold;
        color: #FD791C;
    }
    .good-count{
        display: flex;
        justify-content: space-around;
        color: #C1C0C5;
    }
    .good-total{
        display: flex;
        justify-content: space-between;
        /* padding: 10px; */
        margin: 0 10px;
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #f4e9e9;
        border-bottom: 1px solid #f4e9e9;
    }
    .delivery{
        display: flex;
        background-color: #fff;
        margin-top: 15px;
        padding-left: 10px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f4e9e9;
    }
    .delivery-item{
        margin-right: 30px;
    }
    .deliver{
        background-color: #fff;
        padding-left: 10px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
    .comment{
        padding: 10px 10px;
        background-color: #fff;
        margin: 15px 0;
    }
    .comment-top{
        font-size: 16px;
        display: flex;
        justify-content: space-between;
    }
    .tabbar-item{
      display: flex;
      padding: 10px 0 10px 10px;
    }
    .iconfont{
        font-size: 16px;
        text-align: center;
        margin-right: 20px;
    }
    .ant-btn{
        width: 100px;
        height: 50px;
        margin-right: 10px;
    }
</style>

