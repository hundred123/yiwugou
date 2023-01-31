<template>
	<div class="top-bar">
		<div class="left">
			<slot name="left"></slot>
		</div>
		<div class="middle">
			<slot name="middle">
				<a-input  v-if="edit" placeholder="请输入关键字" v-model:value="searchInput">
					<template #prefix>
						<search-outlined />
					</template>
				</a-input>
				<a-input v-else placeholder="请输入关键字" @focus="focusHandle">
					<template #prefix>
						<search-outlined />
					</template>
				</a-input>
			</slot>
		</div>
		<div class="right">
			<slot name="right"></slot>
		</div>
	</div>

</template>

<script setup>
	import {SearchOutlined} from '@ant-design/icons-vue';
	import {watch,ref} from 'vue'
	
	const emit=defineEmits(['chandlerTopBa','searchContentChangeHandle'])
	const focusHandle=()=>emit('chandlerTopBa')
	// 来接收search组件传过来的数据
	const props=defineProps({
		searchInput:String,
		edit:{
			type:Boolean,
			default:false
		}
	})
	
	// 保证searchContent是一个字符串
	const searchContent=ref(props.searchInput?props.searchInput:'')
	// console.log('props',props.searchInput)
	// 对input框进行防抖操作
	let timeId=null
	watch(()=>props.searchInput,(newvalue,oldvalue)=>{
		// console.log(newvalue)
		clearTimeout(timeId)
		timeId=setTimeout(()=>{
			// 向父组件传输输入框中的值
			emit('searchContentChangeHandle',newvalue)
		},500)
	})
</script>

<style scoped>
	.top-bar {
	    height: 50px;
	    box-shadow: 0px 1px 2px rgb(0 0 0 / 0.2);
	    background-color: #FF6600;
	    display: flex;
	    justify-content: space-around;
	    align-items: center;
	    padding:0 8px;
	    box-sizing: border-box;
	}
	
	.middle {
	    width:76%;
	}
	:deep(.ant-input-prefix){
		margin:5px;
	}
	.ant-input-affix-wrapper {
			height: 30px;
	    border-radius:4px;
	    border: unset;
	    background-color: rgb(0,0,0/ 0.1);
	    color:#979797;
			padding: 0;
	}
	
	/* 
	    我们现在想修改 input.ant-input 的背景颜色
	    但由于 input.ant-input 是.ant-input-affix-wrapper的后代样式
	    又由于我们的style是局部的 scoped
	    所以我们的效果没有生效，相当于被屏蔽。
	
	    结果方式两种：
	    第一种：把style行间的scoped去掉，但是同时会把这个style中的其他样式升级全局样式
	    第二种: 在样式前加上:deep(),这样在保持局部的情况下，这个能穿透
	*/
	:deep(.ant-input-affix-wrapper > input.ant-input) {
	    background-color:unset !important;
	}

</style>
