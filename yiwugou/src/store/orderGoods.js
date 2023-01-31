import {
	defineStore
} from "pinia"

export const useState = defineStore("orderGoods", {
	state: () => {
		return {
			orderGoods: []
		}
	},
	actions: {
		setOrderGoods(newVal) {
			this.orderGoods.push(newVal)
		}
	}
})
