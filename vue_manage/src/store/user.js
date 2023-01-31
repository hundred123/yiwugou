/* import cookie from 'js-cookie'
export default{
	namespaced:true,
	state:{
		token:''
	},
	mutations:{
		SET_COOKIE(state,value){
			state.token=value
			cookie.set('token',value)
		},
		REMOVE_COOKIE(state,value){
			state.token=''
			cookie.remove('token')
		},
		GET_COOKIE(state){
			state.token=state.token||cookie.get('token')
		}
	}
} */