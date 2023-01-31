import * as api from "./api.js"
import { uploadImg,uploadProductImg } from "./middleware/upload.js"
import { checkToken } from "./middleware/token.js"

export const useRouter = app => {
    app.get("/", api.DefaultApi)
		// 连接mongoDb
    app.get('/pingdb', api.PingDb)
		// 获取 推荐页面 轮播图的数据
		app.post('/carousel',api.getCarousel)
		// 获取 推荐页面 icon的数据
		app.post('/icon',api.getIcon)
		// 获取 推荐页面 banner的数据
		app.post('/banner',api.getBanner)
		// 获取 category的数据
		app.post('/category',api.getCategory)
		// 获取 category具体的商品数据
		app.post('/categoryitem',api.getCategoryItem)
		// 获取 category具体的商品中的小商品数据
		app.post('/categoryListItem',api.getCategoryListItem)
		// 获取 goods具体的商品中的小商品数据
		app.post('/goods',api.getGoods)
		//把所有的数据进行拼接，为了在首页进行展示，以及进行查找时进行模糊查找
		app.post('/totalCategoryListItem',api.getTotalCategoryListItem)
		//进行修改商品的数据
		// app.post('/modifyproduct',api.ModifyProduct )
		 app.post("/modifyproduct",uploadProductImg.single("file"),api.ModifyProduct)
		//进行查找商品的数据
		app.post('/findgood',api.FindGood )
		//进行搜索查询
		app.post('/search',api.getSearchResult)
		 
		app.post('/categorylist',api.CategoryList)
		    
		app.post('/categoryresult', api.CategoryResult)
		
		app.post('/login', api.Login)
		
		app.post('/loginbyyzm', api.LoginByYzm)
		
		// 进行登录
		app.post('/register', api.Register)
		// 获取用户
		app.post('/getuser', api.getUser)
		
		app.post('/uploadimg', uploadImg.single("file"), checkToken, api.UploadImg)
		
		app.post('/gooddetail',api.GoodDetail)
		// 添加到购物车
		app.post("/addcart",checkToken,api.AddCart)
		// 获取到添加到购物车里的数据
		app.post("/getcart",checkToken,api.GetCart)
		// 创建订单
		app.post("/createorder",api.CreateOrder)
		// 移除已经提交的订单的数据
		app.post("/removecart",api.RemoveCart)
		// 获取到订单数据
		app.post("/getorder",api.getOrder)
		// 创建地址
		app.post("/createaddress",api.CreateAddress)
		// 取到地址
		app.post("/getaddress",api.GetAddress)
		// 更新地址
		app.post("/modifyaddress",api.ModifyAddress )
		// 删除地址
		app.post("/removeaddress",api.RemoveAddress )
		// 跳转支付界面
		app.post("/payment",api.Payment)
		// 支付成功或失败界面
		app.post("/queryorder",api.QueryOrder)
}