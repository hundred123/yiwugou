// 因为原生的localStorage仅能处理storage所以要进行封装
export const getArray=(key)=>{
	const item=localStorage.getItem(key)
	return item===null?[]:item.split(',')
}
export const setArray=(key,value)=>{
	let arr=getArray(key)
	// 进行去重
	// let index=arr.indexOf(value)
	// if(index>=0){
	// 	arr.splice(index,1)
	// }
	arr.unshift(value)
	arr=[...new Set(arr)]
	localStorage.setItem(key,arr.toString())
}
export const clearItem=(key)=>{localStorage.removeItem(key)}

// 设置splash页面
export const getItem=(key)=>{
	return localStorage.getItem(key)?localStorage.getItem(key):''
}
export const setItem=(key,value)=>{
	return localStorage.setItem(key,value)
}