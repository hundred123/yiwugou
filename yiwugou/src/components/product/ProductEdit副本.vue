<template>
	<div class="product-edit">
		<div class="wrapper-cb">
			<div class="diy-cb">
				<input :id="id" type="checkbox" class="cb" v-model="product.checked"/>
				<label :for="id"></label>
			</div>
		</div>
		<div>{{product.desc}}</div>
	</div>
</template>

<script setup>
	import {computed,inject} from 'vue'
	import {useState} from '@/store/cart.js'
	import {getItem,clearItem} from '@/kits/LocalStorageKit.js'
	const state=useState()
	const token=getItem('token')
	const userId=getItem('userId')
	const message=inject('$message')
	const props=defineProps({
		product:Object
	})
	
</script>

<style scoped>
	/* 复选框 */
	.wrapper-cb {
		width: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.cb{
		visibility: hidden;
		width: 0;
		height: 0;
	}
	.diy-cb{
		position: relative;
		width: 16px;
		height: 16px;
	}
	.diy-cb label::before{
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 16px;
		height: 16px;
		border: 1px solid #b620e0;
		border-radius: 3px;
	}
	.diy-cb input[type='checkbox']:checked + label::after{
		content: '√';
		position: absolute;
		top: 0;
		left: 0;
		width: 16px;
		height: 16px;
		border: 1px solid #b620e0;
		border-radius: 3px;
		color: white;
		background-color: #b620e0;
		line-height: 16px;
		text-align: center;
	}
</style>