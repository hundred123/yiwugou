export default{
	namespaced:true,
	state:{
		isCollapse:false,
		tabList:[
			{
				path:'/',
				label:'首页',
				name:'home',
				icon:'home'
			}
		],
		cuurentMenu:null
	},
	mutations:{
		COLLAPS_EMENU(state){
			state.isCollapse=!state.isCollapse
		},
		SELECT_MENU(state,val){
			if(val.name!='home'){
				state.cuurentMenu=val
				const result=state.tabList.findIndex(item=>item.name===val.name)
				if(result===-1){
					state.tabList.push(val)
				}else{
					state.cuurentMenu=null
				}
			}
		},
		CLOSE_TAG(state,val){
			const index=state.tabList.findIndex(item=>item.name==val.name)
			console.log(index)
			state.tabList.splice(index,1)
		}
	} 
}