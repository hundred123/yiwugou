<template>
	<div class="table">
		<el-table
		:data='tableData'
		style="height: 90%;"
		:v-loding='config.loding'
		stripe>
			<el-table-column
			show-overflow-tooltip
			v-for="item in tableLabel"
			:label="item.label"
			align='center'
			:width='item.width? item.width:125'>
			<template slot-scope='scope'>
				<span>{{scope.row[item.prop]}}</span>
			</template>
			</el-table-column>
		</el-table>
		<el-pagination
			class="pager"
		    layout="prev, pager, next"
		    :total="config.total"
			:page-size="20"
			:current-page.sync='config.page'
			@current-change='changePage()'>
		  </el-pagination>
	</div>
</template>

<script>
	import {restHttp} from '../../src/kits/HttpKit.js'
	export default {
		name:'commonTable',
		data(){
			return{
			}
		},
		props:{
			tableData:Array,
			tableLabel:Array,
			config:Object
		},
		methods:{
			handleEdit(row){
				this.$emit('edit',row)
			},
			handleDelete(row){
				this.$emit('del',row)
			},
			changePage(val){
				this.$emit('changePage',val)
			},
		},
	}
</script>

<style scoped lang="less">
	.pager{
		float: right;
		margin-top: 15px;
	}
</style>