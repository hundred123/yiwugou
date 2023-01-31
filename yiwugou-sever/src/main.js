import express from 'express'
import { useRouter } from './router.js';
import cors from 'cors'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// 静态资源发布
// app.use("/static", express.static("./assets")) 
app.use('/static',express.static('./assets'))

app.use(cors())  // 解决跨域 自动将所有的接口都自动处理header中的信息

useRouter(app)

const port = 3000;

app.listen(port, () => console.log(`server is running,listen port ${port}`))