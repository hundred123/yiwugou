import VueRouter from 'vue-router'
import Vue from 'vue'
import MyHome from '../views/MyHome'
import MyUser from '../views/MyUser'
import MyMall from '../views/MyMall'
import PageOne from '../views/PageOne'
import PageTwo from '../views/PageTwo'
import Main from '../views/Main.vue'
import MyLogin from '../views/MyLogin/index.vue'
import {getItem} from '@/kits/LocalStorageKit.js'
const router=new VueRouter({
	routes:[
		/* {
			path:'/',
			redirect:{path:'/login'},
		}, */
		{
			path:'/login',
			name:'login',
			component:MyLogin
		},
		{
			path:'/home',
			path:'/',
			redirect:'/home',
			name:'Main',
			component:Main,
			children:[
				{
					name:'home',
					path:'home',
					component:MyHome
				},
				{
					path:'user',
					name:'user',
					component:MyUser
				},
				{
					path:'mall',
					name:'mall',
					component:MyMall
				},
				{
					path:'page1',
					name:'page1',
					component:PageOne
				},
				{
					path:'page2',
					name:'page2',
					component:PageTwo
				},
				
			]
		},
	]
})
// 全局前置守卫

router.beforeEach((to,from,next)=>{
	const token=getItem('token')
	if(!token&&to.name!=='login'){
		next({name:'login'})
	}else{
		next()
	}
})


// router.beforeEach((to,from,next) => {
// 	console.log('toto',to)
// 	/* if(to.path==='/login'){
// 		next()
// 		router.push('/home')
// 	} */
// 	next()
//    if (to.path !== '/' && to.path !== '/login') {
//    // if (to.path !== '/login') {
// 		 console.log(1111)
// 		 if(getItem('token')==='')
// 		 console.log(3333)
// 			return '/login'
//    }else{
// 		 console.log(2222)
// 		 if(getItem('token')!==''){
// 			 console.log(3333)
// 			 return '/home'
// 		 }
// 	 }
//  })
export default router