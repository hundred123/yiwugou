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

export const restHttp = (api, param) => {
    return new Promise((resolve, reject) => {
        instance.post(api, param)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
    })
}