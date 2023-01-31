import Mock from 'mockjs'
import homeApi from './mockServeDate/home'
import userApi from './mockServeDate/user'
Mock.mock('/home/getData',homeApi.getStaticalData)
Mock.mock('/user\/add','post',userApi.createUser)
Mock.mock('/user\/edit','post',userApi.updateUser)
Mock.mock('/user\/getUser','get',userApi.getUserList)
Mock.mock('/user\/del','get',userApi.deleteUser)