import axios from 'axios'
import { options } from 'less'
import config from '../config/index.js'
//拿到接口地址
const baseUrl=process.env.NODE_ENV==='development'? config.baseURL.dev:config.baseURL.pro
/* const ip = '127.0.0.1'
const port = 3000
export const baseUrl = `http://${ip}:${port}` */
class HttpRequest{
	constructor(baseUrl){
		this.baseUrl=baseUrl
	}
	//定义axios的相关配置
	getInsideConfig(){
		const config={
			baseUrl:this.baseUrl,
			Header:{
			},
			
			// baseURL:this.baseUrl,
			// timeout: 250000, // 超时时间是25s
			// headers: {
			//     'content-type': 'application/json',
			// }
			
		}
		return config
	}
	//拦截器
	interceptors(instance){
		instance.interceptors.request.use(function (config) {
		    // 在发送请求之前做些什么
		    return config;
		  }, function (error) {
		    // 对请求错误做些什么
		    return Promise.reject(error);
		  });
		
		// 添加响应拦截器
		instance.interceptors.response.use(function (response) {
		    // 2xx 范围内的状态码都会触发该函数。
		    // 对响应数据做点什么
		    return response;
		  }, function (error) {
		    // 超出 2xx 范围的状态码都会触发该函数。
		    // 对响应错误做点什么
			console.log('error',error)
		    return Promise.reject(error);
		  })
	}
	 //后续接口请求时拿到
	 request(options){
	 			  const instance=axios.create()
	 			  options={...this.getInsideConfig(),...options}
					console.log('options',options)
	 			  this.interceptors(instance)
	 			  return instance(options)
	 }
}
 export default new HttpRequest(baseUrl)