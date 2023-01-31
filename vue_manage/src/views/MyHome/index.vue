<template>
	<div style="height: 100vh;">
		<el-row>
			<el-col :span="8" style="margin-top: 20px;">
				<el-card shadow="hover">
					<div slot="header" class="user">
						<img :src='imgSrc' />
						<div class="userInfo">
							<p class="Admin">Admin</p>
							<p class="superManager">超级管理员</p>
						</div>
					</div>
					<div class="login-info">
						<p>上次登录时间:<span>2022-6-4</span></p>
						<p>上次登录点点:<span>天津</span></p>
					</div>
				</el-card>
				<el-card shadow="hover" class="tableData" >
					<el-table :data="tableData" style="width: 100%">
						<el-table-column v-for="(item,key) in tableLabel" :key="key" :prop="key" :label="item">
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :span='16'>
				<div class="numIndex">
					<el-card shadow="always" v-for="item in countData" class="oneNum" :body-style="{ padding: '0px' }">
						<template style="display: flex;">
							<i class="icon" :class="'el-icon-'+item.icon" :style="{backgroundColor:item.color}"></i>
							<div class="detail">
								<p class="num">￥{{item.value}}</p>
								<p class="txt">{{item.name}}</p>
							</div>
						</template>
					</el-card>
				</div>
				<el-card style="height: 280px; margin:20px 0 20px 20px;">
					<div style="height: 280px;" ref="eCharts">123</div>
				</el-card>
				<div class="graph">
					<el-card style="height: 260px;">
						<div style="height: 260px;" ref="uCharts"></div>
					</el-card>
					<el-card style="height: 260px;">
						<div style="height: 260px;" ref="vCharts"></div>
					</el-card>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {getData} from '../../../api/data.js'
	import {restHttp} from '../../kits/HttpKit.js'
	import * as echarts from 'echarts'
	export default {
		name: 'MyAbout',
		data() {
			return {
				imgSrc: require('../../assets/images/person.jpg'),
				tableData: [],
				awaitCountNum:0,
				deliveryCountNum:0,
				tableLabel: {
					name: '名称',
					todayBuy: '今日购买',
					monthBuy: '每月购买',
					totalBuy: '总购买'
				},
				countData: []
			}
		},
		methods:{
			// 待发货的内容开始
				async getDelivery (){
					// return { code: "ok" }
					const await_paid_Data = await restHttp('/getorder')
					// console.log('await_paid_Data',await_paid_Data)
					let await_paid_list=await_paid_Data.data.filter(item=>{
						return item.status==='2'
					})
					// deliveryCount.value=await_paid_list.length
					this.deliveryCountNum=await_paid_list.length
					// console.log('this.deliveryCountNum',this.deliveryCountNum)
				},
				// 待付款的内容开始
				async getAwaitPaid(){
					// return { code: "ok" }
					const await_paid_Data = await restHttp('/getorder')
					let await_paid_list=await_paid_Data.data.filter(item=>{
						return item.status==='1'
					})
					this.awaitCountNum=await_paid_list.length
					// console.log('this.awaitCountNum',this.awaitCountNum)
				},
				// 支付订单数据
				getcountData(){
					// console.log('this.awaitCountNum22222',this.awaitCountNum)
					// console.log('this.deliveryCountNum222222',this.deliveryCountNum)
					this.countData=[{
							name: '今日支付订单',
							value: this.deliveryCountNum,
							icon: 'success',
							color: '#2ec7c9'
						},
						{
							name: '今日收藏订单',
							value: '1234',
							icon: 'star-on',
							color: '#ffb980'
						},
						{
							name: '今日未支付订单',
							value: this.awaitCountNum,
							icon: 's-goods',
							color: '#5ab1ef'
						},
						{
							name: '本月支付订单',
							value: this.deliveryCountNum,
							icon: 'success',
							color: '#2ec7c9'
						},
						{
							name: '本月收藏订单',
							value: '210',
							icon: 'star-on',
							color: '#ffb980'
						},
						{
							name: '本月未支付订单',
							value: this.awaitCountNum,
							icon: 's-goods',
							color: '#5ab1ef'
						}]
				}
		},
		mounted() {
				// 获取到待发货与待付款
				setTimeout(()=>{
					this.getDelivery()
					this.getAwaitPaid()
				},100)
				// 给支付中赋值
			setTimeout(()=>{
				this.getcountData()
			},300)
			// 获取到数据
			getData().then(res => {
				const {
					code,
					data
				} = res.data
				if (code === 20000) {
					this.tableData = data.tableData
					const order = data.orderData
					const xData = order.data
					const keyArrar = Object.keys(xData[0])
					const series = []
					keyArrar.forEach(key => {
						series.push({
							name: key,
							type: 'line',
							data: xData.map(item => {
								return item[key]
							})
						})
						//console.log(xData.map(item=>{ item[key]}))
					})
					//折线图
					var option = {
						legend: {
							data: keyArrar
						},
						xAxis: {
							data: order.date
						},
						yAxis: {},
						series
					}
				}
				// console.log('res:', res)
				const lineChart = echarts.init(this.$refs.eCharts)
				lineChart.setOption(option)
				
				//柱状图
				var colOption = {
					color:['#2ec7c9','#b6a2de'],
					legend: {
						show: true
					},
					tooltip: { //提示框,默认为trigger:'item'
						trigger: 'item'
					},
					//x轴
					xAxis: {
						type:'category',
						data: data.userData.map(item=>item.data),
						axisLine: {
						lineStyle: {//x轴的颜色
								color: "#17b3a3"
							}
						},
						axisLabel:{//字的颜色
							color:'#333'
						}
					},
					//y轴
					yAxis: {
						axisLine: {
						lineStyle: {
								color: "#17b3a3"
							}
						}
					},
					series: [
					  {
					    name: '新增用户',
					    type: 'bar',
					    data: data.userData.map(item=>item.new)
					  },
					   {
					    name: '活跃用户',
					    type: 'bar',
					    data: data.userData.map(item=>item.active)
					  }					  
					]
				}
				const columCharts=echarts.init(this.$refs.uCharts)
				columCharts.setOption(colOption)
				
				//饼图
				const pieOption = {
				  tooltip: {
				    trigger: 'item'
				  },
				  series: [
				    {
				    type: 'pie',
					radius: '60%',
				    data: data.videoData,
				    }
				  ]
				}
				const pieCharts=echarts.init(this.$refs.vCharts)
				pieCharts.setOption(pieOption)
			})
		}
	}
</script>

<style scoped lang="less">
	* {
		padding: 0 !important;
	}

.tableData{
	margin-top: 20px; 
	height: 460px; 
	overflow-y: auto;
	
}
	.el-card img {
		width: 140px;
		height: 140px;
		border-radius: 50%;
	}

	.user {
		display: flex;
		align-items: center;

		.userInfo {
			line-height: 30px;
			margin-left: 70px;

			.Admin {
				font-weight: 600;
				font-size: 25px;
			}

			.superManager {
				font-size: 13px;
				font-weight: bold;
				color: #999999;
			}
		}
	}

	.login-info p {
		line-height: 25px;
		color: #999999;
		font-size: 13px;
		font-weight: bold;
	}

	.login-info span {
		color: gray;
		margin-left: 125px;
	}

	.numIndex {
		display: flex;
		flex-wrap: wrap;

		.oneNum {
			position: relative;
			margin-left: 20px;
			width: 30.33%;
			margin-top: 20px;

			.icon {
				width: 70px;
				height: 70px;
				line-height: 70px;
				color: white;
				font-size: 20px;
				text-align: center;
			}

			.detail {
				position: absolute;
				top: -4px;
				left: 85px;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.num {
					font-size: 30px;
					margin-bottom: 10px;
				}

				.txt {
					font-size: 14px;
					text-align: center;
					color: #999999;
				}
			}
		}
	}

	.graph {
		margin-left: 20px;
		display: flex;
		justify-content: space-between;
		.el-card {
			width: 48%;
		}
	}
	::-webkit-scrollbar {
	    display: none;
	}
</style>
