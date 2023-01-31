import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import tab from './tab.js'
import user from './user.js'
import product from './product.js'
export default new Vuex.Store({
	modules:{
		tab,
		user,
		product
	}
})