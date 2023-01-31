import {
	formDataHttp
} from '../kits/HttpKit.js';
export default {
	namespaced: true,
	state: {
		selected: {},
		refreshCount: 0,
		newAddData: {}
	},
	mutations: {
		setSelected(state, product) {
			state.selected = product
		},
		refreshCountAdd(state) {
			state.refreshCount++
		},
		setNewAddData(state, product) {
			// state.selected=product
		}
	}
}
