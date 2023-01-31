import { defineStore } from "pinia"

export const useCategoryState = defineStore("Category", {
    state: () => ({ categoryItem: "化妆品" }),
    actions: {
        setCtegoryItem(newVal) {
            // console.log("pinia : ",newVal)
            this.categoryItem = newVal
        }
    }
})