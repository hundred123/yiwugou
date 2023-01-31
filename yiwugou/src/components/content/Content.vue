<template>
	<div class="content" ref='contetnRef'>
		<div v-if="loding" class="loding">{{msg}}</div>
			<slot></slot>
	</div>
</template>

<script setup>
	// 获取节点的属性getCurrentInstance().refs.(contetnRef即自定义ref的名字)
	import {onMounted,getCurrentInstance,ref} from 'vue'
	let tarchStart = 0,distance = 0
	let loding=ref(false)
	let msg=ref('下拉刷新')
	// 这个props的作用是
	const props=defineProps({
		// 为了动态计算content的高度
		hasTabBar:{
			type:Boolean,
			default:false
		},
		// 判断数据是否刷新成功，如果刷新成功在返回数据
		refreshfunc:{
			type:Function,
			default:function(){}
		},
		// 是否进行下拉刷新
		pull:{
			type:Boolean,
			default:false
		}
	})
	let contetnRef=ref(null)//获取到div这个属性 第二种方法
	const topbar_height = 90
	const tabbar_height = 58
	const sub_height=props.hasTabBar?(tabbar_height+topbar_height)+'px':topbar_height+'px'
	onMounted(() => {
		if(props.pull){
			// console.log(getCurrentInstance().refs.contetnRef)
			// const app = getCurrentInstance().refs.contetnRef //获取到div这个属性 第一种方法
			let app=contetnRef.value//获取到div这个属性 第二种方法
			// 收到控制手指移动的距离，本质是监听touchstart,touchmove,touchend这三个事件
			// touchstart是为了获取手指刚触碰屏幕时的事件，这个事件里有手指位于屏幕的坐标
			app.addEventListener('touchstart', (e) => {
				// e.preventDefault()
				tarchStart = e.targetTouches[0].clientY
				// console.log('scroll-top-start', app.scrollTop)
			}, {
				passive: true
			})
			// 手指移动屏幕
			app.addEventListener('touchmove', (e) => {
				// e.preventDefault()
				if(loding.value){
					e.stopPropagation()
					return
				}
				let scroll_top = app.scrollTop
				if (scroll_top === 0) {//这里的scrollTop判断的时在不在起点位置，如果不在起点位置，那么就为距离起点的位置了，就不可以刷新了
					distance = e.targetTouches[0].clientY - tarchStart
					// console.log('scroll-top-move', scroll_top)
					// 当scroll-top大于0时在，说明页面在向上滑动，所以我们不需要计算distance，
					if (distance > 0) {
						loding.value=true
						// 由于越往下滑动值越大 当distance>0说明搜索结果区域时向下‘拽’e.targetTouches[0].clientY(如50)-tarchStart(如30)
							if(distance<=80){
								app.style.transform = `translateY(${distance}px)`
							}
					}
				}
			}, {
				passive: true
			})
			// 手指移动结束
			// console.log('msg.value',props.refreshfunc)
			app.addEventListener('touchend', (e) => {
				// console.log('scroll-top-end', app.scrollTop)
				if(distance===0) return
				msg.value='正在加载'
				props.refreshfunc().then(res=>{
					// console.log('刷新结果',res)
					if(res.code==='ok'){
						msg.value='加载成功'
					}else{
						msg.value='加载失败'
					}
					// console.log(res)
// 注意：这里的setTimout是为了是msg显示为“两段式”，先显示加载是否成功，然后隔几秒后再重置最初的状态
				setTimeout(()=>{
					tarchStart = 0
					distance = 0
					app.style.transform = `translateY(0)`
					msg.value='下拉刷新'
					loding.value=false
					},1000)
				})
			}, {
				passive: true
			})
		}
	})
</script>

<style scoped>
	.content {
		/* 为了解决顶部搜索不会动，变成固定的 */
		height: calc(100vh - v-bind(sub_height));
		overflow-y: auto;
		transition:all .5s ease;
		/* padding: 2px; */
	}
	::webkit-scrollbar {
		display: none;
	}
	.loding{
		display: flex;
		justify-content: center;
		font-size: 16px;
		color: #7f7f7f;
	}
</style>
