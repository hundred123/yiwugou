<template>
	<div class="root">
		<div class="cd">
			<span v-if="count>0" @click="goto"><span>跳过</span><span class="count">{{count}}</span></span>
			<span v-else>跳过</span>
		</div>
		<div class="coverImg"></div>
	</div>
</template>

<script setup>
	import {ref,watch} from 'vue'
	import {useRouter} from 'vue-router'
	import {useStore} from 'vuex'
	
	import {setItem} from '@/kits/LocalStorageKit.js'
	import {useState} from '@/store/pageDirection.js'
	setItem('firstOpen','1')
	const router =useRouter()
	const state = useState()
	let count=ref(3)
	const cd=(num)=>{
		if(num>0){
			setTimeout(()=>{
				count.value=num-1
					cd(count.value)
			},1000)
		}/* else{
			router.replace('/main/home')
		} */
	}
	cd(count.value)
	const goto=()=>{
		state.setDirection('forward')
		router.replace('/index/home')
	}
	watch(count,(newValue)=>{
		// console.log(newValue)
		if(newValue<1){
			state.setDirection('forward')
			router.replace('/index/home')
		}
	})
</script>

<style scoped>
	.root{
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.cd{
		position: absolute;
		display: flex;
		top: 10px;
		right: 10px;
		color: white;
		width: 80px;
		height: 30px;
		background-color: rgba(143, 23, 22, .5);
		/* border-radius: 50%; */
		justify-content: space-around;
		align-items: center;
		/* border: 1px solid #b620e0; */
		font-size: 18px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, .2);
	}
	.cd:nth-child(1){
		font-size: 14px;
	}
	.count{
		font-size: 16px;
		padding-left: 5px;
		color: #F9494A;
	}
	.coverImg{
		width: 100vw;
		height: 100vh;
		background-image: url(../../assets/imgs/cover.jpg);
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>