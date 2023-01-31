import {
	createRouter,
	createWebHashHistory
} from 'vue-router'

import Home from '@/components/pages/tabs/Home.vue'
import Category from '@/components/pages/tabs/Category.vue'
import ShopCart from '@/components/pages/tabs/ShopCart.vue'
import Account from '@/components/pages/tabs/Account.vue'

import index from '@/components/pages/index.vue'
import Search from '@/components/topbar/Search.vue'
import SearchResult from '@/components/topbar/SearchResult.vue'
import BlankPage from '@/components/pages/nav/BlankPage.vue'
import Splash from '@/components/splash/Splash.vue'

import Login from '@/components/pages/Login.vue'
import Register from '@/components/pages/Register.vue'
import UploadAvatar from "@/components/pages/UploadAvatar.vue"
import Edit from '@/components/pages/Edit.vue'
import About from '@/components/pages/About.vue'
import Settings from '@/components/pages/Settings.vue'
import Address from '@/components/pages/Address.vue'
import Purchase from '@/components/pages/Purchase.vue'

import CategoryResult from '@/components/pages/CategoryResult.vue'
import GoodDetail from '@/components/pages/GoodDetail.vue'
import PayMethods from '@/components/pages/PayMethods.vue'
import GoodsAddress from '@/components/pages/GoodsAddress.vue'
import EditAddress from '@/components/pages/EditAddress.vue'
import PaySuccess from '@/components/pages/PaySuccess.vue'
import GoodStatus from '@/components/pages/GoodStatus.vue'


import {
	getItem
} from '@/kits/LocalStorageKit.js'
const firstOpen = getItem('firstOpen')
export default createRouter({
	history: createWebHashHistory(),
	routes: [{
			path: '/',
			redirect: {
				path: firstOpen ? '/index/home' : '/splash'
			}
		},
		{
			path: '/index',
			component: index,
			children: [{
					path: 'home',
					component: Home,
				},
				{
					path: 'category',
					component: Category
				},
				{
					path: 'shopcart',
					component: ShopCart
				},
				{
					path: 'account',
					component: Account
				}
			]

		},
		{
			path: '/search',
			component: Search
		}, {
			path: '/searchresult',
			component: SearchResult
		},
		{
			path: '/splash',
			component: Splash
		},
		{
			path: "/login",
			component: Login
		},
		{
			path: "/register",
			component: Register
		},
		{
			path: "/categoryresult",
			component: CategoryResult
		},
		{
			path: "/settings",
		 component: Settings
		},
		{
			path: "/edit",
			component: Edit
		},
		{
			path: "/about",
			component: About
		},
		{
			path: '/uploadavatar',
			component: UploadAvatar
		},
		{
			path: '/gooddetail',
			component: GoodDetail
		},
		{
			path: '/blankpage',
			component: BlankPage
		},{
			path: '/purchase',
			component: Purchase
		},
		{
			path: '/address',
			component: Address
		},{
			path: '/paymethods',
			component: PayMethods
		},{
			path: '/goodsaddress',
			component: GoodsAddress
		},{
			path: '/editaddress',
			component: EditAddress
		},{
			path: '/paysuccess',
			component: PaySuccess
		},{
			path: '/goodstatus',
			component: GoodStatus
		},{
			path: '/vrroom',
			component: ()=>import('@/components/pages/VrRoom.vue')
		}
	]
})
