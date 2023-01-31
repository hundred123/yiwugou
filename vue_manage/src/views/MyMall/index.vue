<template>
	<div>
		<div class="store-managment">
			<div class="list">
				<common-list></common-list>
			</div>
			<div class="edit">
				<common-edit></common-edit>
			</div>
		</div>
	</div>
</template>

<script>
	import CommonList from '../../components/CommonList.vue';
	import CommonEdit from '../../components/CommonEdit.vue';
	export default{
		name:'MyMall',
		components:{
			CommonEdit,
			CommonList
		}
	}
</script>

<style scoped>
.store-managment {
			display: flex;
			height: calc(100vh - 60px);
		}
		.list {
			flex: 1;
			overflow-y: auto;
			padding: 12px 12px 24px 12px;
			box-sizing: border-box;
			border-right: 1px solid #eaeaea;
		}
		.edit {
			flex: 1;
			padding: 12px 12px 24px 12px;
			overflow-y: auto;
		}
	
		::-webkit-scrollbar {
			display: none;
		}
</style>