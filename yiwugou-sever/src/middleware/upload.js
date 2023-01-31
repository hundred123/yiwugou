import multer from "multer"
import path from 'path'
export const uploadImg = multer({
    // 定义了文件存储的路径
    // 改写了文件在服务器中的名字
    // 重要！同时也把前端传来的json格式的参数进行了“处理”，
    //  再往后的中间件或者api又可以通过req.body获取参数了ß
    storage: multer.diskStorage({
        destination: 'assets/upload/avatar',
        filename: (req, file, callback) => {
            const ext = path.extname(file.originalname)
            callback(null, Date.now() + ext)
        }
    })
})

	export const uploadProductImg = multer({
		    // 定义了文件存储的路径
		    // 改写了文件在服务器中的名字
		    // 重要！同时也把前端传来的json格式的参数进行了“处理”，
		    //      再往后的中间件或者api又可以通过req.body获取参数了ß
		    storage:multer.diskStorage({
		        destination:"assets/imgs/product/",
		        filename:(req,file,callback) => {
		            const ext = path.extname(file.originalname)
		            callback(null,Date.now()+ext);
		        }
		    })
		})