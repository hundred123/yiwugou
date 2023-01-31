<template>
	<div>
		<el-form ref="form" :model='form' label-width="100px" :inline='inline'>
			<el-form-item
			v-for="item in formLabel"
			:label='item.label'>
				<el-input 
				v-if="item.type=='input'"
				v-model="form[item.model]"
				:placeholder='`请输入${item.label}`'
				></el-input>
				
				<!-- <el-switch v-if="item.type=='switch'" v-model="form[item.model]"></el-switch> -->
				
				<el-select
				v-if="item.type=='select'"
				v-model="form[item.model]"
				placeholder='请选择'
				>
					<el-option 
					v-for="item in item.opts"
					:key="item.value"
					:label='item.label'
					:value='item.value'
					></el-option>
				</el-select>
				
				<el-date-picker
				type='date'
				v-if="item.type=='date'"
				v-model="form[item.model]"
				placeholder="选择日期"
				value-format="yyyy-MM-dd">
				</el-date-picker>
			</el-form-item>
			<el-form-item><slot></slot></el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		props: {
			formLabel:Array,
			form:Object,
			inline:Boolean
		},
	}
</script>

<style scoped>

</style>