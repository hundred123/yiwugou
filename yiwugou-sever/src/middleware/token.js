import jwt from 'jsonwebtoken'
import { secreateOrPrivateKey } from '../../config/index.js'
export const checkToken = (req,resp,next) =>{
    const p = req.body
    // console.log('p',p);
    // console.log('校验token是否有效');
    if(p.token){
        try {
            const decoded = jwt.verify(p.token, secreateOrPrivateKey)
            //   console.log("解码之后的内容：", decoded)
            if(decoded.id === p.userId){
                console.log(111);
                next()
            }else{
                resp.send({
                    code:102,
                    msg:'非法token,请重新登录',
                    data:{}
                })
            }
        } catch (error) {
            resp.send({
                code: 103,
                msg: error.message,
                data: {}
            })
        }
    }else{
        resp.send({
            code: 101,
            msg: '缺少token,请登录',
            data: {}
        })
    }
}