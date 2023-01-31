<template>
	<div>
		<el-dialog
		:title="operateType==='add'? '新增用户':'修改用户'"
		:visible.sync=isShow
		>
			<common-form
			:formLabel='operateFormLabel'
			:form='operateForm'
			:inline='true'
			ref='form'
			><br />
			<div class="footer">
				<el-button @click="isShow=false">取消</el-button>
				<el-button type="primary" @click="confirm">确定</el-button>				
			</div>
			</common-form>
		</el-dialog>
		<div class="manage-Header" style="margin-left: 50%;transform: translateX(-25%);">
			<!-- <el-button type="primary" @click="addUser" class="newAdd">+新增</el-button> -->
				<common-form
				:formLabel='searchFormLabel'
				:form='searchForm'
				:inline='true'
				ref='form'
				>
				<el-button type="primary" @click="changePage(searchForm.keyWord)">搜索</el-button>
				</common-form>
		</div>
		<div>
			<common-table
			:tableData='tableData'
			:tableLabel='tableLabel'
			:config='config'
			@edit='editUser'
			@del='delUser'
			@changePage='changePage'
			></common-table>
		</div>
	</div>
</template>

<script>
	import CommonForm from '../../components/CommonForm.vue'
	import CommonTable from '../../components/CommonTable.vue'
	import {restHttp} from '../../kits/HttpKit.js'
	// import {getUser} from '../../../api/data.js'
	import {getItem} from '../../kits/LocalStorageKit.js'
	export default {
		name:'MyUser',
		components:{
			CommonForm,
			CommonTable
		},
		data(){
			return{
				operateType:'',
				isShow:false,
				operateFormLabel:[
					{
						model:'index',
						label:'序号',
						type:'input',
					},
					{
						model:'account',
						label:'账号',
						type:'input',
					},
					{
						model:'pwd',
						label:'密码',
						type:'input'
					},
					{
						model:'role',
						label:'角色',
						type:'input'
					},{
						model:'status',
						label:'状态',
						type:'input'
					},
				],
				operateForm:{
					index:'',
					account:'',
					pwd:'',
					role:'',
					status:''
				},
				searchFormLabel:[
					{
						model:'keyWord',
						label:'',
						type:'input'
					}
				],
				searchForm:{
					keyWord:''
				},
				tableData:[
					{
						
					}
				],
				tableLabel:[
					{
						prop:'index',
						label:'序号',
						width:200
					},
					{
						prop:'account',
						label:'账号',
						width:200
					},
					{
						prop:'pwd',
						label:'密码',
						width:200
					},
					{
						prop:'role',
						label:'角色',
						width:300
					},{
						prop:'status',
						label:'状态',
						width:300
					},
				],
				config:{
					total:20,
					page:1,
					loding:true
				}
			}
		},
		methods:{
			confirm(){
				if(this.operateType==='edit'){
					this.$axios.post('/user/edit',this.operateForm).then(res=>{
						console.log('edit:',res)
						this.isShow=false
						this.changePage()
					})
				}else{
					this.$axios.post('/user/add',this.operateForm).then(res=>{
						console.log('add:',res)
						this.isShow=false
						this.changePage()
					})
				}
			},
// 增加用户
			addUser(){
				this.isShow=true
				this.operateType='add'
				this.operateForm={
					index:'',
					account:'',
					pwd:'',
					role:'',
				}
			},
// 编辑用户
			editUser(row){
				this.isShow=true
				this.operateType='edit'
				this.operateForm=row
				console.log('row:',row)
			},
// 删除用户
			delUser(row){
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(res=>{
							const id=row.id
							this.$axios.get('user/del',{
								params:{id}
							})
						}).then(() => {
				          this.$message({
				            type: 'success',
				            message: '删除成功!'
				          });
				        })
						this.changePage()
			},
			changePage(name=''){
			this.config.loding=true
			name? (this.config.page=1):''
			restHttp('/getuser',{account:name}).then(res=>{
				const userId=getItem('userId')
				// console.log('resresrse',res)
				this.tableData=res.data.map((item,index)=>{
					item.role=item.role==='c'?'普通用户':'管理员'
					item.index=index+1
					item.account=item.id
					if(userId===item.id){
						item.status='在线'
					}else{
						item.status='离线'
					}
					return item
				})
				this.config.loding=false
			})
			},
		},
		created() {
			this.changePage()
			// this.getUserInfo()
		}
	}
</script>

<style scoped>
	.manage-Header{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.newAdd{
		margin-top: -22px!important ;
	}
	/deep/ .el-input__inner{
		width: 300px !important;
	}
</style>