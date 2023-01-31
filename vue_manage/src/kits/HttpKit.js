import axios from 'axios'

const ip = '127.0.0.1'
// const ip = '10.1.250.164'
const port = 3000
export const baseURL = `http://${ip}:${port}`
const instance = axios.create({
    baseURL,
    timeout: 250000, // 超时时间是25s
    headers: {
        'content-type': 'application/json',
    }
})
// 图片文件
const instanceFormData = axios.create({
    baseURL,
    timeout:12000, //12s 
    headers:{
        "Content-Type":"multipart/form-data"
    }
})

export const restHttp = (api, param) => {
    return new Promise((resolve, reject) => {
        instance.post(api, param)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
    })
}

export const formDataHttp = (api,param) => {
    return new Promise((resolve,reject) => {
        instanceFormData.post(api,param)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
    })
}