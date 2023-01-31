<template>
    <div>
        <a-input-search 
            v-model:value="searchInput" 
            placeholder="请输入要查询的商品" 
            :loading="searchInputLoading" 
            style="margin:8px 0;"
            @search="resetSearch" 
            enter-button="搜索" 
        />
        <a-list :data-source="list">
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta :description="'￥'+item.price[0]">
                    <template #avatar>
                        <a-avatar shape="square" :src="img_url+item.imgpath" />
                    </template>
                    <template #title>
                        {{ item.desc }}
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <a @click="edit(item)">编辑</a>
                    <a style="color:red;" @click="del(item,index)">删除</a>
                </template>
            </a-list-item>
            <template #loadMore>
                <div v-if="list.length > 0"
                    :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore"></a-spin>
                    <a-button v-else style="color:#7F7F7F;border:unset;" block @click="onLoadMore">加载更多</a-button>
                </div>
            </template>
        </a-list>
    </div>
</template>
<script>
import { restHttp } from '../kits/HttpKit.js'
import { img_url } from '../kits/ImgKit.js'

export default {
    name: 'CommonList',
    data() {
        return {
            list:[],
            loadingMore:false,
            searchInput: '',
            searchInputLoading:false,
            params:{
                start: 0,
                count: 10,
            },
            img_url: img_url.img,
        }
    },
    created() {
        this.fetchData()
        
    },
    methods: {
        async fetchData(handler){
            this.loadingMore = true

            try {
                const goods = await restHttp('/goods', this.params)
                if(goods && goods.length > 0){
                    this.list = this.list.concat(goods);
                    this.params.start += goods.length
                }
                // console.log(this.list);
            } catch (error) {
                this.message.warning(e.message)
            } finally {
                this.loadingMore = false
            }
        },
        resetSearch(){
            this.start = 0;
            this.searchInput = ''
        },
        edit(product){
            // console.log(product);
            this.$store.commit('product/setSelected',product)
        },
        async del(item,idx){
           try {
            // 在数据库删除数据----没写
               this.list.splice(idx, 1)
               this.message.success('删除成功')
           } catch (error) {
               this.message.warning(e.message)

           }
        },
        initdata(){
            // this.fetchData()
        },
        onLoadMore(){
            this.fetchData()
        },
        mock() {
            console.log('模拟请求网络');
            setTimeout(()=>{
                this.searchInputLoading = false
								
            },2000)
        },
    },
    
    watch:{
        searchInput:function(newVal){
        console.log("new:",newVal)
            clearTimeout(this.stId) // undefined lastStId
            // 用“抖动”控制何时请求网络
            this.stId = setTimeout(() => {
                this.searchInputLoading = true
								restHttp('/findgood',{desc:newVal}).then(res=>{
									// console.log('resresrse',res)
									this.list=res.data
								})
                this.mock()
            }, 500);
        }
       
    },
}
</script>
<style scoped>
	.ant-avatar-square{
	    width: 60px;
	    height: 60px;
	}
</style>
