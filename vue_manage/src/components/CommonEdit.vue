<template>
	<div>
		<div style="display:flex;justify-content: space-between;">
			<div class="upload-btn">
				<input id="fileId" class="myfile" type="file" @change="uploadImg" />
				<label for="fileId" class="diyfile">+</label>
			</div>
			<div class="show-img" :style="imgStyle"></div>
		</div>
		<a-form ref="productForm" :model="form" layout="horizontal" style="margin-top:50px;" :rules="rules"
			:form="form1">
			<a-form-item label="商品名称" name="name">
				<a-input v-model:value="form.desc" size="large" placeholder="请输入商品名称"></a-input>
			</a-form-item>
			<a-form-item label="商店名称" name="shops">
				<a-input v-model:value="form.shops" size="large" placeholder="请输入商店名称"></a-input>
			</a-form-item>
			<a-form-item label="商品价格" name="price">
				<a-input v-model:value="form.price" type="number" size="large" placeholder="请输入价格"></a-input>
			</a-form-item>
			<a-form-item label="运费" name="delivery">
				<a-input v-model:value="form.delivery" type="number" size="large" placeholder="请输入运费"></a-input>
			</a-form-item>
			<a-form-item label="商品库存">
				<a-select v-model:value="form.total">
					<a-select-option value="100">100</a-select-option>
					<a-select-option value="200">200</a-select-option>
					<a-select-option value="500">500</a-select-option>
					<a-select-option value="800">800</a-select-option>
					<a-select-option value="1000">1000</a-select-option>
					<a-select-option value="1500">1500</a-select-option>
					<a-select-option value="2000">2000</a-select-option>
					<a-select-option value="5000">5000</a-select-option>
					<a-select-option value="10000">10000</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="商品类型">
				<a-radio-group v-model:value="form.type">
					<a-radio value="01">化妆品</a-radio>
					<a-radio value="02">地摊挑货</a-radio>
					<a-radio value="03">玩具</a-radio>
					<a-radio value="04">饰品</a-radio>
					<a-radio value="05">袜类</a-radio>
					<a-radio value="06">厨卫</a-radio>
					<a-radio value="07">服饰</a-radio>
					<a-radio value="08">内衣</a-radio>
					<a-radio value="09">办公文具</a-radio>
					<a-radio value="10">体育用品</a-radio>
					<a-radio value="11">箱包</a-radio>
					<a-radio value="12">宠物用品</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="商品状态">
				<a-switch v-model:checked="form.status_show" checked-children="上架" un-checked-children="下架" />
			</a-form-item>
			<a-form-item label="上架日期">
				<a-date-picker v-model:value="form.date_show" placeholder="选择日期" :locale="locale"
					format="YYYY-MM-DD HH:mm:ss" style="width:100%;" @change="dateChange" />
			</a-form-item>

			<a-form-item style="margin-top:45px;">
				<a-button v-if="form.id === ''" type="primary" @click="sub">新增</a-button>
				<a-button v-else type="primary" @click="sub">修改</a-button>
				<a-button style="margin-left:8px;" @click="resetForm">重置/新增</a-button>
			</a-form-item>
		</a-form>

		<a-modal v-model:visible="visible" title="裁切图片" @ok="modalOk" @cancel="modalCancel" :forceRender="true">
			<div class="cut-img">
				<img style="width:100%;height: 100%;" ref="image" :src="cropperImg" />
			</div>
		</a-modal>
	</div>
</template>
<script>
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
	import moment from 'moment';
	import {
		img_url
	} from '../kits/ImgKit.js'
	import {
		formDataHttp,
		restHttp
	} from '../kits/HttpKit.js';
	export default {
		name: 'CommonEdit',
		data() {
			return {
				imgpath: '',
				cropperImg: '',
				visible: false,
				rules: {
					name: [{
							required: true,
							message: "请输入账号",
							trigger: "blur"
						}, // 必填的校验规则
					],
					price: [{
						validator: this.validPrice
					}]
				},
				img_url: '',
				cropper: {
					value: null
				},
				locale: {},
				form: {
					id: "",
					desc: "",
					price: 0.00,
					total: 0,
					shops: '',
					delivery: 0,
					imgpath_filename: "",
					status: "off",
					status_show: false,
					date_show: moment(moment(), "YYYY-MM-DD HH:mm:ss"),
					date: moment().format("YYYY-MM-DD HH:mm:ss"),
					type: "",
					imgpath_blob: ""
				},
				form1: this.$form.createForm(this),
			}
		},
		watch: {
			selected: function(curr) {
				this.form.id = curr.id
				this.form.desc = curr.desc
				this.form.price = curr.price[0]
				this.form.total = curr.total
				this.form.shops = curr.shops
				this.form.delivery = curr.delivery
				this.form.type = curr.type
				this.form.status = (curr.status && curr.status !== "") ? curr.status : "on"
				this.form.status_show = this.form.status === "on" ? true : false
				this.form.date = curr.date ? curr.date : moment().format("YYYY-MM-DD HH:mm:ss")
				this.form.date_show = moment(this.form.date, "YYYY-MM-DD HH:mm:ss")
				this.form.imgpath_filename = "",
					this.form.imgpath_blob = ""
			}
		},
		computed: {
			selected() {
				return this.$store.state.product.selected
			},
			selectedImgpath: {
				get() {
					if (this.selected.imgpath) {
						return this.img_url + this.$store.state.product.selected.imgpath
					} else {
						return ''
					}
				},
				set(val) {
					this.img_url + this.$store.state.product.selected.imgpath === val
				}

			},
			imgStyle() {
				return {
					backgroundImage: this.imgpath === '' ? `url(${this.selectedImgpath})` : `url(${this.imgpath})`,
					// backgroundImage: `url(${this.imgpath})`,
					"background-size": "cover",
					"background-repeat": "no-repeat"
				}
			}
		},
		methods: {
			async sub() {
				// const formRef = this.$refs.productForm
				// console.log(formRef);
				// try {
				// await formRef.validate()
				// const formRef = {
				//     name: 123,
				//     price: 1000,
				// }
				try {
					const key = 'loading'
					this.$message.loading({
						key,
						content: '操作中',
					})
					console.log('form.id：', this.form.id)
					if (this.form.id === "" && this.form.imgpath_blob === "") {
						this.$message.warning({
							key,
							content: "新增商品时需传图片"
						})
						return
					}
					const formData = new FormData()
					if (this.form.imgpath_blob !== "") {
						formData.append('file', this.form.imgpath_blob, this.form.imgpath_filename);
					}
					const formObj = this.form
					for (const key in formObj) {
						if (key.indexOf("_") < 0) {
							if (key === "status") {
								formData.append(key, this.form.status_show ? "on" : "off");
							} else {
								formData.append(key, formObj[key]);
							}
						}
					}
					const resData = await formDataHttp('/modifyproduct', formData)
					// console.log("resData:", resData)
					if (resData.code === 1) {
					 this.$message.success({
								key,
								content: resData.msg,
								duration: 2
							})
							// 修改 store 中的 selected ！！！！！
							this.$store.commit('product/refreshCountAdd')
						}else{
							this.$message.error({
								key,
								content: resData.msg,
								duration: 2
							})
						}
					} catch (e) {
						console.log(3000, e)
					}
				},
				uploadImg(e) {
						const imgFile = e.target.files[0]
						new Promise((resolve, reject) => {
							const render = new FileReader()
							render.readAsDataURL(imgFile)
							render.onload = () => {
								resolve(render.result)
							}
						}).then(res => {
							this.cropperImg = res
							this.form.imgpath_filename = imgFile.name
							// console.log('sssss:', this.form.imgpath_filename);
							this.showModal()
						}).catch(e => {
							console.log('eeee', e)
						})
					},
					showModal() {
						this.visible = true,
							this.$nextTick(() => {
								const image = this.$refs.image
								// console.log('aaaaaaaaaaa', image)
								this.cropper.value = new Cropper(image, {
									aspectRatio: 16 / 9,
									// ready: () => console.log("cropperjs is ready!"),
								});
							})
					},
					validPrice(rule, value) {
						if (value && value.length > 0 && value > 0) {
							return Promise.resolve()
						} else {
							return Promise.reject("请输入正确的价格")
						}
					},
					modalOk() {
						this.cropper.value.getCroppedCanvas().toBlob((blob) => {
							this.form.imgpath_blob = blob;
							new Promise((resolve, reject) => {
								const render = new FileReader()
								render.readAsDataURL(blob)
								render.onload = () => {
									resolve(render.result)
								}
							}).then(res => {
								this.imgpath = res
								// console.log('imgpathimgpath', this.imgpath)
							}).catch(e => {
								console.log('eeee', e)
							})
							this.visible = false
						})
						// console.log(11);
						this.cropper.value.destroy()
					},
					modalCancel() {
						// console.log(22);
						this.cropper.value.destroy()
					},
					// 重置
					resetForm() {
						this.$store.commit('product/setSelected', {
							id: "",
							desc: "",
							price: 0.00,
							total: 0,
							shops: '',
							delivery: 0,
							type: ''
						})
					},
					dateChange(obj) {
						// console.log(obj);
						this.form.date = obj.format("YYYY-MM-DD HH:mm:ss")
					},
			},

			mounted() {
				this.img_url = img_url.img
				// http://127.0.0.1:3000/static/imgs/
				// http://127.0.0.1:3000/static/imgs/http://localhost:3000/static/imgs/oduct/1668083840881.png
			},



		}
</script>
<style scoped>
	.show-img {
		flex: 2;
		height: 200px;
		background-color: #e5e5e5;
		border-radius: 12px;

	}

	.upload-btn {
		flex: 1;
		border: 1px dotted #e5e5e5;
		border-radius: 15px;
		text-align: center;
		margin-right: 24px;
	}

	.myfile {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.diyfile {
		display: inline-block;
		border-radius: 12px;
		line-height: 200px;
		color: #e5e5e5;
		font-size: 64px;
	}

	.cut-img {
		height: 200px;
		border: 1px dashed #cacaca;

	}
</style>
