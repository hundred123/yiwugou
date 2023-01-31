<template>
	<div class="tags">
		<el-tag class="tag" v-for="(item,index) in tabList" :key="item.path" size='small' :closable='item.label!=="首页"'
			:effect="item.name==$route.name? 'dark':'plain'" @click="changeMenu(item)" @close="handleClose(item,index)">
			{{item.label}}
		</el-tag>
	</div>
</template>

<script>
	import {
		mapState,mapMutations
	} from 'vuex'
	export default {
		computed: {
			...mapState('tab', ['tabList'])
		},
		methods: {
			changeMenu(item) {
				this.$router.push(item.name)
			},
			handleClose(item,index) {
				console.log(this.$store)
				const length=this.tabList.length-1
				if(this.$route.name!==item.name) {
					this.$store.commit('tab/CLOSE_TAG',item)
					return
				}
				if(index==length){
					this.$router.push({
						name:this.tabList[length-1].name
					})
				}else{
					this.$router.push({
						name:this.tabList[index+1].name
					})
				}
				this.$store.commit('tab/CLOSE_TAG',item)
				console.log(index)
			},
			//...mapMutations('tab',{handleClose:'CLOSE_TAG'})
		}
	}
</script>

<style scoped>
	.tags {
		padding: 20px;
	}
	.tag {
		margin-right: 15px;
		cursor: pointer;
	}
</style>
