<template>
  <div id="app">
	<router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
	}
	body{margin:0;}
	#app{
		height: 100vh;
	}
</style>
