<template>
	<div v-if="clickNavItem==='推荐'">
		<slot name="rceommand"></slot>
	</div>
	<div v-else>
		<slot name="otherGoods"></slot>
	</div>

</template>

<script setup>
	const props = defineProps({
		clickNavItem: String
	})
</script>

<style scoped>
</style>
