import config from 'config'
import Mock from 'mockjs'
export default{
	getMenu:config=>{
		const {username,passward}=JSON.parse(config.body)
		//先判断用户是否存在
		//判断账号密码是否对应
	}
}