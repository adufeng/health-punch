<template>
	<view class="container">
		<view class="top-login">
			<view v-if="isLogin" style="font-size:16px;color:#FFFFFF;font-weight: bolder;display: flex;justify-content: flex-end;">
				<view v-if="scene">{{deptName}} — </view>
				<view v-if="!scene && isComplete">{{deptName}} — </view>
				<view v-if="isScanCodeDept" style="padding-left: 10rpx;">欢迎您，{{userName}}</view>
				<view v-if="isScanCodeSchool" style="padding-left: 10rpx;">欢迎您</view>
			</view>
			<view v-else>
				<van-button type="default" round size="small" @click="toLogin" custom-class="shadow-btn">请登录</van-button>
			</view>
		</view>
		<view class="func-box">
			<van-grid :column-num="isScanCodeSchool ? '1':'3'" :clickable="true" :border="true">
				<van-grid-item v-if="isScanCodeDept" icon="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/door1.png" text="进门" @click="openDoor(1)" />
				<van-grid-item v-if="isScanCodeDept" icon="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/door2.png" text="出门" @click="openDoor(2)" />
				<van-grid-item v-if="isScanCodeDept" icon="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/company.png" text="企业打卡"  @click="checkCompanyInformation" />
				<van-grid-item v-if="isScanCodeSchool" icon="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/student.png" text="家长入口" @click="toStudent" />
			</van-grid>
			<view class="func-ncovdetail">
				<van-notice-bar left-icon="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/noticy.png" :text="titleNews"
				 backgroundColor="#ffffff" color="#111111" />
				<view>
					<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/title1.png" style="height: 70rpx;"></image>
				</view>
				<view class="detail">
					<view class="time">
						<view>截止 {{nowTime}} 全国数据统计</view>
						<view>数据来源 - 丁香园</view>
					</view>
					<view class="detail1">
						<van-icon name="stop" color="orangered" style="margin: 6rpx;" />
						<view>{{ncovDetail.note1}}</view>
					</view>
					<view class="detail1">
						<van-icon name="stop" color="orangered" style="margin: 6rpx;" />
						<view>{{ncovDetail.note2}}</view>
					</view>
					<view class="detail1">
						<van-icon name="stop" color="orange" style="margin: 6rpx;" />
						<view>{{ncovDetail.note3}}</view>
					</view>
					<view class="detail1">
						<van-icon name="stop" color="orange" style="margin: 6rpx;" />
						<view>{{ncovDetail.remark1}}</view>
					</view>
					<view class="detail1">
						<van-icon name="stop" color="orange" style="margin: 6rpx;" />
						<view>{{ncovDetail.remark2}}</view>
					</view>
					<view class="detail1">
						<van-icon name="stop" color="orange" style="margin: 6rpx;" />
						<view>{{ncovDetail.remark3}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="ncov-live-detail">
			<view>
				<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/title2.png" style="height: 70rpx;"></image>
			</view>
			<view style="padding-bottom: 16rpx;">
				<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com/oval.png" style="height: 20rpx;"></image>
			</view>
			<!-- <swiper v-if="ncovDetail.quanguoTrendChart" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="1000"
			 :circular="true" style="height: 500rpx;">
				<swiper-item v-for="(item,index) in ncovDetail.quanguoTrendChart" :key="index">
					<view class="swiper-item">
						<image :src="item.imgUrl" style="width: 100%;" />
					</view>
				</swiper-item>
			</swiper> -->
			<view class="city-title">
				<view class="area">地区</view>
				<view class="diagnose">确诊</view>
				<view class="death">死亡</view>
				<view class="cure">治愈</view>
			</view>
			<view v-for="(item, index) in cityList" :key="index" class="city-list">
				<view class="area-o">{{item.provinceName}}</view>
				<view class="diagnose-o">{{item.confirmedCount}}</view>
				<view class="death-o">{{item.deadCount}}</view>
				<view class="cure-o">{{item.curedCount}}</view>
			</view>
		</view>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
		<!-- 点击进出 -->
		<van-dialog use-slot title="请填写以下信息" :show="isShowDialog" show-cancel-button @confirm="clickConfirm" @cancel="clickCancel">
			<van-radio-group v-if="userDetail.dept.type=='2'" :value="radio" @change="radioChange">
				<van-cell-group>
					<van-cell title="本人" clickable data-name="1" @click="radioClick">
						<van-radio slot="right-icon" name="1" />
					</van-cell>
					<van-cell title="家庭成员" clickable data-name="2" @click="radioClick">
						<van-radio slot="right-icon" name="2" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-cell-group>
				<!-- <van-field v-if="radio==1" label="体温" input-align="right" placeholder="请输入当前体温" type="digit" :value="temperature"
				 :border="true" @change="getTemperature"  /> -->
				<van-cell v-if="radio==1" title="体温" is-link @click="showTemperature" :value="temperature==''? '请选择':temperature" />
				<van-field v-if="userDetail.dept.type=='2'&&radio==2" label="手机号码" input-align="right" placeholder="请输入家庭成员手机号"
				 type="number" :value="familyTelNumber" :border="true" @change="getFamilyTelNumber" />
				<!-- <van-field label="开门事由" placeholder="请输入开门事由" input-align="right" :value="cause" :border="true" @change="getCause" /> -->
				<van-cell title="事由" is-link @click="showCause" :value="cause==''? '请选择':cause" />
				<van-cell v-if="status==2" title="请选择目的地" is-link :value="selectAddressName==''?'请选择':selectAddressName" @click="getMap" />
			</van-cell-group>
		</van-dialog>

		<!-- 家庭成员二维码 -->
		<van-dialog use-slot title='请扫码' :show="isShowFamilyCode">
			<image :src="familyCode" />
			<p style="padding: 20rpx 0 40rpx; font-size:28rpx;text-align: center;font-weight: bold;">请进出家庭人员扫码，并妥善保存二维码</p>
		</van-dialog>

		<!-- 电子卡信息 -->
		<van-popup :show="isShowElectronicCard" position="bottom" round @close="closeElectronicCard">
			<view class="electronicCard">
				<view class="msg">
					<van-icon name="down" />
					<view>请展示此卡</view>
				</view>
				<view class="showCard">
					<view style="display: flex;align-items: center;">
						<image :src="userImg" class="avatarUrl" />
						<view style=";padding: 0 40rpx;font-size: 26rpx;">
							<view style="display: flex;">
								<view>姓名：{{userDetail.userName}}</view>
								<view style="margin-left: 40rpx;">门牌号：{{userDetail.houseNumber}}</view>
							</view>
							<view style="margin-top: 20rpx;" v-if="isIdCard">身份证号：{{userDetail.identityNumber}}</view>
						</view>
					</view>
					<view style="text-align: center;padding-top: 20rpx;font-size: 40rpx;font-weight: bold;">
						<view v-if="userDetail.personId=='1'">可正常通行<span style="font-size: 24rpx;margin-left: 20rpx;">事由：{{userCause}}</span></view>
						<view v-else>请居家隔离</view>
						<view style="display: flex;justify-content: center;font-size: 28rpx;padding-top: 20rpx;">
							<view>总计可出:{{eleDetail.frequency}}次</view>
							<view style="padding: 0 30rpx;">已出:{{eleDetail.uses}}次</view>
							<view>剩余:{{eleDetail.remaining}}次</view>
						</view>
					</view>
				</view>
			</view>
		</van-popup>
		<!-- 点击显示体温弹窗 正常/异常 -->
		<van-dialog use-slot title="请选择" :show="isShowSelectTemperature" :showConfirmButton="false" :confirm="onTemperatureDialog">
			<van-radio-group :value="temperatureRadio" @change="onSelectTemperatureChange">
				<van-cell-group>
					<van-cell v-for="(item,index) in temperatureList" :key="index" :title="item" clickable :data-name="index+1" @click="onSelectTemperatureClick">
						<van-radio slot="right-icon" :name="index+1" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-dialog>
		<!-- 点击显示事由弹窗 上班/回家/外出采购 -->
		<van-dialog use-slot title="请选择" :show="isShowSelectCause" :showConfirmButton="false" :confirm="onCauseDialog">
			<van-radio-group :value="causeRadiu" @change="onSelectCauseChange">
				<van-cell-group>
					<van-cell v-for="(item,index) in causeList" :key="index" :title="item" clickable :data-name="index+1" @click="onSelectCauseClick">
						<van-radio slot="right-icon" :name="index+1" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-dialog>
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast';
	import Dialog from '../../wxcomponents/vant/dialog/dialog';
	import "./index.scss";
	export default {
		data() {
			return {
				// 是否扫码打开小程序
				isScanCode: false,
				// 扫码内容是否为小区/公司用户
				isScanCodeDept:false,
				// 扫码内容是否为学校用户
				isScanCodeSchool:false,
				// 是否需要填写身份证号码(完善信息用)
				isIdCard: false,
				// 顶部新闻内容
				titleNews: "",
				// 城市动态
				cityList: "",
				// 是否登录
				isLogin: false,
				// 是否完善个人信息
				isComplete: false,
				// 用户昵称
				userName: "",
				// 用户头像
				userImg: "",
				// 临时code
				snapCode: '',
				// 是否显示输入体温框
				isShowDialog: false,
				// 用户输入的体温
				temperature: '',
				// 用户进or出 1:进 2:出
				status: 0,
				// 事由
				cause: '',
				// 用户详细信息
				userDetail: {},
				// 疫情传播途径等
				ncovDetail: {},
				// 当前时间
				nowTime: '',
				// 用户选择的地点名称
				selectAddressName: '',
				// 是否显示查看电子卡
				isShowElectronicCard: false,
				// 电子卡需要的内容
				eleDetail: '',
				// 扫码的值
				scene: '',
				// 用户输入的事由（后台返回） 
				userCause: '',
				// 小区名字
				deptName: '',
				// 单选框值 1:本人 2:家庭成员
				radio: '1',
				// 家庭成员电话号码
				familyTelNumber: '',
				// 生成的家庭成员二维码
				familyCode: '',
				// 是否显示家庭成员二维码
				isShowFamilyCode: '',
				// 是否显示选择体温 正常/异常 弹窗
				isShowSelectTemperature: false,
				// 事由可选择的值
				temperatureList: ['正常', '异常'],
				// 体温弹窗单选框的值
				temperatureRadio: '0',
				// 是否显示事由 上班/回家/外出采购 弹窗
				isShowSelectCause: false,
				// 事由可选择的值
				causeList: ['上班', '回家', '外出采购', '来访', '其他'],
				// 事由弹窗单选框的值
				causeRadiu: '0',
				// 云平台设备号
				cloudNo: ''
			}
		},
		onLoad: function(options) {
			var that = this
			// 判断是否扫码打开
			if (decodeURIComponent(options.scene) != 'undefined') {
				this.isScanCode = true
				uni.setStorageSync('isScanCode', true)
				// -1:小区/公司用户 其他:学校用户
				if(decodeURIComponent(options.scene).indexOf('a')=='-1'){
					console.log('扫码，小区/公司用户')
					this.isLogin = false
					uni.setStorageSync('isLogin',false)
					uni.setStorageSync('deptId', decodeURIComponent(options.scene))
					this.scene = decodeURIComponent(options.scene)
					this.isScanCodeDept = true
					uni.setStorageSync('isScanCodeDept',true)
					uni.setStorageSync('isScanCodeSchool',false)
					this.getDeptName(decodeURIComponent(options.scene))
					if (uni.getStorageSync('isInformation')) {
						this.setDeptId(uni.getStorageSync('userDetail').userId)
					}
				}else{
					console.log('扫码，学校用户')
					this.isLogin = true
					uni.setStorageSync('isLogin',true)
					var id = decodeURIComponent(options.scene).slice(1,decodeURIComponent(options.scene).length)
					uni.setStorageSync('deptId',id)
					this.scene = id
					this.isScanCodeSchool = true
					uni.setStorageSync('isScanCodeDept',false)
					uni.setStorageSync('isScanCodeSchool',true)
					this.getSchoolName(id)
				}
			} else if (uni.getStorageSync('deptId')) {
				// 小区/公司用户
				if(uni.getStorageSync('isScanCodeDept')){
					console.log('未扫码，小区/公司用户')
					this.isScanCodeDept = true
					this.getDeptName(uni.getStorageSync('deptId'))
					if (uni.getStorageSync('openId')) {
						this.uniFly.post({
							url: '/room/getUserByOpenIdApp',
							params: {
								openId: uni.getStorageSync('openId')
							}
						}).then(res => {
							console.log("当前用户详情:")
							console.log(res)
							if (res.data.code == 1) {
								that.isComplete = false
							} else if (res.data.code == 0) {
								that.isComplete = true
								that.userDetail = res.data.data
								uni.setStorageSync('userDetail', res.data.data)
							}
						})
					}
				}else{
					// 学校用户
					console.log('未扫码，学校用户')
					this.isScanCodeSchool = true
					this.isLogin = true
					this.scene = uni.getStorageSync('deptId')
					uni.setStorageSync('isLogin',true)
					this.getSchoolName(uni.getStorageSync('deptId'))
				}
			}
			// 判断本地缓存是否有deptid 没有就提醒用户重新扫码
			if (!uni.getStorageSync('deptId')) {
				Dialog.alert({
					title: '提示',
					message: '信息已失效，请重新扫码打开'
				}).then(() => {
					Dialog.close()
				})
			}
			// 获取疫情信息
			this.getEpidemicNews()
			this.getEpidemicCityDetail()
			// 获取当前时间+格式化
			this.getNowTime()
			// 是否登录并完善
			this.isLogin = uni.getStorageSync('isLogin')
			this.isComplete = uni.getStorageSync('isInformation')
			// 已登录获取昵称和图片
			if (uni.getStorageSync('isLogin')) {
				this.userName = uni.getStorageSync('userInfo').nickName
				this.userImg = uni.getStorageSync('userInfo').avatarUrl
			}
			// 获取授权信息
			this.openAuthSetting()
		},
		onShow: function() {
			var that = this
			// 是否登录并完善
			this.isLogin = uni.getStorageSync('isLogin')
			this.isComplete = uni.getStorageSync('isInformation')
			// 已登录获取昵称和图片
			if (uni.getStorageSync('isLogin')) {
				this.userName = uni.getStorageSync('userInfo').nickName
				this.userImg = uni.getStorageSync('userInfo').avatarUrl
			}
			// 已完善 获取用户详细信息
			if (uni.getStorageSync('isInformation')) {
				that.userDetail = uni.getStorageSync('userDetail')
			}
			// 获取当前时间+格式化
			this.getNowTime()
		},
		methods: {
			// 获取学校名称
			getSchoolName:function(id){
				var that = this
				this.uniFly.post({url:'/room/getSchool',params:{
					deptId:id
				}}).then(res=>{
					console.log('学校名称')
					console.log(res)
					if(res.data.code==0){
						that.deptName = res.data.data.deptName
					}
				})
			},
			// 跳转学生页面
			toStudent:function(){
				uni.navigateTo({
					url:'../student/index'
				})
			},
			// 获取是否添加人脸
			checkIsFace: function() {
				var that = this
				return new Promise(
					function(resolve) {
						that.uniFly.post({
							url: 'https://wts.yinshangjituan.com/app/authentication/wx/isFaceRegistration',
							params: {
								userId: that.userDetail.userId
							}
						}).then(res => {
							console.log('是否添加人脸:')
							console.log(res)
							if (res.data.code == 0) {
								if (res.data.data.status == 0) {
									resolve(false)
								} else if (res.data.data.status == 1) {
									resolve(true)
								}
							} else {
								Toast(res.data.msg)
							}
						})
					}
				)
			},
			// 点击事由显示事由体温弹窗
			showCause: function() {
				this.isShowSelectCause = true
			},
			onSelectCauseChange: function(event) {
				this.cause = this.causeList[event - 1]
				this.causeRadiu = event.detail.toString()
				this.isShowSelectCause = false
			},
			onSelectCauseClick: function(event) {
				const {
					name
				} = event.currentTarget.dataset;
				this.cause = this.causeList[name - 1]
				this.causeRadiu = name.toString()
				this.isShowSelectCause = false
			},
			onCauseDialog: function() {
				this.isShowSelectCause = false
			},
			// 点击体温显示体温弹窗
			showTemperature: function() {
				this.isShowSelectTemperature = true
			},
			onSelectTemperatureChange: function(event) {
				this.temperature = this.temperatureList[event - 1]
				this.temperatureRadio = event.detail.toString()
				this.isShowSelectTemperature = false
			},
			onSelectTemperatureClick: function(event) {
				const {
					name
				} = event.currentTarget.dataset;
				this.temperature = this.temperatureList[name - 1]
				this.temperatureRadio = name.toString()
				this.isShowSelectTemperature = false
			},
			onTemperatureDialog: function() {
				this.isShowSelectTemperature = false
			},
			// 点击登录 跳转登录页
			toLogin: function() {
				uni.navigateTo({
					url: '../login/index'
				})
			},
			// 检查是否完善企业信息
			checkCompanyInformation: function() {
				var that = this
				this.uniFly.post({
					url: '/enterprise/info/getEnterpriseInfo',
					params: {
						userId: this.userDetail.userId
					}
				}).then(res => {
					console.log('是否完善企业信息:')
					console.log(res)
					if (res.data.code == 0) {
						// 0未审核 1审核通过 2不通过
						if (res.data.data.auditingStatus == 0) {
							Dialog.alert({
								title: '提示',
								message: '企业信息审核中',
							}).then(() => {
								Dialog.close()
							})
						} else if (res.data.data.auditingStatus == 1) {
							uni.navigateTo({
								url: '../companyPunch/index?userId=' + that.userDetail.userId
							})
						} else if (res.data.data.auditingStatus == 2) {
							Dialog.alert({
								title: '提示',
								message: '企业信息审核未通过，请联系管理员',
							}).then(() => {
								Dialog.close()
							})
						}
					} else {
						Dialog.confirm({
							title: '提示',
							message: '检测到未完善企业信息，请完善',
							confirmButtonText: '去完善'
						}).then(() => {
							uni.navigateTo({
								url: '../companyInformation/index?userId=' + that.userDetail.userId
							})
						}).catch(() => {
							Dialog.close()
						})
					}
				})
			},
			// 获取输入的家庭成员手机号码
			getFamilyTelNumber: function(e) {
				this.familyTelNumber = e.detail
			},
			// 选择是本人还是家庭成员
			radioChange: function(event) {
				this.radio = event.detail
			},
			radioClick: function(event) {
				const {
					name
				} = event.currentTarget.dataset;
				this.radio = name
			},
			// 地图选择地区
			getMap: function() {
				var that = this
				uni.chooseLocation({
					success: function(res) {
						console.log('选择的地区:')
						console.log(res)
						that.selectAddressName = res.name
					}
				})
			},
			// 获取小区名称
			getDeptName: function(deptId) {
				var that = this
				this.uniFly.post({
					url: '/room/getDeptName',
					params: {
						deptId: deptId
					}
				}).then(res => {
					console.log('小区名称')
					console.log(res)
					if (res.data.code == 0) {
						that.deptName = res.data.data.deptName
						uni.setStorageSync('isIdCard', res.data.data.spare == '1' ? true : false)
						uni.setStorageSync('faceId', res.data.data.spare3) // 0:老用户 1:云卡 2:百度 3:平台云识别
						if (res.data.data.spare3 == '3') {
							that.cloudNo = res.data.data.spare2
						}
					}
				})
			},
			// 打开授权信息
			openAuthSetting: function() {
				wx.getSetting({
					success: function(res) {
						// 判断定位的授权
						if (!res.authSetting['scope.userLocation']) {
							uni.authorize({
								scope: 'scope.userLocation',
								success: function(e) {
									console.log('已授权定位信息')
								}
							})
						}
					}
				})
			},
			// 获取扫码的内容 绑定/修改 小区
			setDeptId: function(userId) {
				var that = this
				var id = uni.getStorageSync('deptId')
				if (id) {
					console.log(id)
					this.uniFly.post({
						url: '/room/updateRegion',
						params: {
							userId: userId,
							deptId: id
						}
					}).then(res => {
						console.log('绑定/修改 小区:')
						console.log(res)
						if (uni.getStorageSync('isInformation')) {
							this.uniFly.post({
								url: '/room/getUserByOpenIdApp',
								params: {
									openId: uni.getStorageSync('openId')
								}
							}).then(res => {
								console.log("当前用户详情:")
								console.log(res)
								if (res.data.code == 1) {
									that.isComplete = false
								} else if (res.data.code == 0) {
									that.isComplete = true
									that.userDetail = res.data.data
									uni.setStorageSync('userDetail', res.data.data)
								}
							})
						}
					})
				}
			},
			// 获取用户信息
			getUserDetail: function() {
				var that = this
				this.uniFly.post({
					url: '/room/getUserByOpenIdApp',
					params: {
						openId: uni.getStorageSync('openId')
					}
				}).then(res => {
					console.log("当前用户详情:")
					console.log(res)
					if (res.data.code == 1) {
						that.isComplete = false
					} else if (res.data.code == 0) {
						that.isComplete = true
						that.userDetail = res.data.data
						// 如果是扫码打开，就发送
						if (uni.getStorageSync('isScanCode')) {
							that.setDeptId(res.data.data.userId)
						} else {
							that.getDeptName(res.data.data.deptId)
						}
					}
				})
			},
			// 查看电子卡
			checkElectronicCard: function() {
				console.log(this.isComplete, this.isLogin)
				if (this.isLogin) {
					if (this.isComplete) {
						console.log("查看电子卡")
						this.isShowElectronicCard = true
					} else {
						Dialog.alert({
							title: '提示',
							message: '请先完善个人信息'
						}).then(() => {
							uni.navigateTo({
								url: '../information/index'
							})
						})
					}
				} else {
					Dialog.alert({
						title: '提示',
						message: '请先登录'
					}).then(() => {
						uni.navigateTo({
							url: '../login/index'
						})
					})
				}
			},
			// 点击空白关闭电子卡
			closeElectronicCard: function() {
				this.isShowElectronicCard = false
			},
			// 获取当前时间+格式化
			getNowTime: function() {
				var myDate = new Date();
				var year = myDate.getFullYear(); //年
				var month = myDate.getMonth() + 1; //月
				var day = myDate.getDate(); //日
				var hours = myDate.getHours(); //小时
				if (hours < 10) hours = '0' + hours
				var minutes = myDate.getMinutes(); //分钟
				if (minutes < 10) minutes = '0' + minutes
				this.nowTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
			},
			// 点击开门(进,出)
			openDoor: function(e) {
				var that = this
				this.status = e
				if (this.isLogin) { //先判断登录
					if (this.isComplete) { //在判断是否完善信息
						if (this.userDetail.personId == '1') { //判断人员是否隔离
							if (this.userDetail.spare3 == '0' || this.userDetail.spare3 == '') { //判断是否为老用户
								that.isShowDialog = true
							} else if (uni.getStorageSync('faceId') == '1') { // 云卡(魏书豪)
								console.log('检测是否上传人脸-云卡')
								that.checkIsFace().then(res => {
									if (res) {
										that.isShowDialog = true
									} else {
										Dialog.alert({
											title: '提示',
											message: '检测到未添加人脸，请添加'
										}).then(() => {
											uni.navigateTo({
												url: '../addFaceDetector/index'
											})
										})
									}
								})
							} else if (uni.getStorageSync('faceId') == '2') { // 百度
								console.log('检测是否上传人脸-百度')
								if (that.userDetail.spare4 == '') {
									Dialog.alert({
										title: '提示',
										message: '检测到未添加人脸，请添加'
									}).then(() => {
										uni.navigateTo({
											url: '../addFaceDetector/index'
										})
									})
								} else {
									that.isShowDialog = true
								}
							} else if (uni.getStorageSync('faceId') == '3') { //云平台
								console.log('检测是否上传人脸-云平台:')
								that.uniFly.post({
									url: '/wo/selectWoInfo',
									params: {
										userId: uni.getStorageSync('userDetail').userId,
										deptId: uni.getStorageSync('userDetail').deptId
									}
								}).then(res => {
									console.log(res)
									if (res.data.code == 0) {
										if (res.data.data.flag) {
											that.isShowDialog = true
										} else {
											Dialog.alert({
												title: '提示',
												message: '检测到未添加人脸，请添加'
											}).then(() => {
												uni.navigateTo({
													url: '../addFaceDetector/index?cloudNo=' + that.cloudNo
												})
											})
										}
									} else {
										Toast(res.data.msg)
									}
								})
							}
						} else {
							Dialog.alert({
								title: '提示',
								message: '当前为隔离人员，请在家自觉隔离'
							}).then(() => {
								Dialog.close()
							})
						}
					} else {
						Dialog.alert({
							title: '提示',
							message: '请先完善个人信息'
						}).then(() => {
							uni.navigateTo({
								url: '../information/index'
							})
						})
					}
				} else {
					Dialog.alert({
						title: '提示',
						message: '请先登录'
					}).then(() => {
						Dialog.close()
					})
				}
			},
			// 输入体温后点击确定
			clickConfirm: function() {
				var that = this
				this.isShowDialog = false
				// 1:本人
				if (this.radio == '1') {
					this.saveMySelf()
				} else {
					// 判断是进还是出
					if (this.status == '2') {
						// 2:家庭
						// this.saveFamily()
						// 天数限制1
						if (this.userDetail.dept.frequencyDay == 1) {
							this.uniFly.post({
								url: '/room/getTheDayFamily',
								params: {
									userId: that.userDetail.userId,
									deptId: that.userDetail.deptId
								}
							}).then(res => {
								console.log("获取当天进出总数:")
								console.log(res)
								if (res.data.code == 0) {
									console.log('用每天次数-当天进出次数', that.userDetail.dept.frequency - res.data.data.number)
									if ((that.userDetail.dept.frequency - res.data.data.number) <= 0) {
										Dialog.alert({
											title: '提示',
											message: '请按当前小区的要求次数进出'
										}).then(() => {
											Dialog.close()
										})
									} else {
										that.saveFamily()
									}
								} else {
									Toast(res.data.msg)
								}
							})
						} else {
							// 和当前系统时间对比 看是否超过规定天数
							this.uniFly.post({
								url: '/room/getUpToDate',
								params: {
									userId: that.userDetail.userId,
									deptId: that.userDetail.deptId
								}
							}).then(res => {
								console.log("获取家人测量最新记录:")
								console.log(res)
								var creatTime = ''
								var nowTime = Date.parse(new Date()) / 1000
								if (res.data.code == 0) {
									console.log('当前时间-最新时间')
									creatTime = res.data.data.create_time
									console.log("当前时间", nowTime)
									console.log("最近一次出的时间", creatTime)
									if ((nowTime - creatTime) / 86400 <= that.userDetail.dept.frequencyDay) {
										Dialog.alert({
											title: '提示',
											message: '请按当前小区的要求次数进出'
										}).then(() => {
											Dialog.close()
										})
									} else {
										that.saveFamily()
									}
								} else if (res.data.code == 1) {
									that.saveFamily()
								}
							})
						}
					} else {
						that.saveFamily()
					}

				}
			},
			// 添加本人出去
			saveMySelf: function() {
				var that = this
				if (this.temperatureRadio == '0') {
					Toast('请选择体温')
				}
				if (this.causeRadiu == '0') {
					Toast('请选择事由')
				}
				if (this.temperatureRadio != '0' && this.causeRadiu != '0') {
					this.uniFly.post({
						url: '/room/addTemperature',
						params: {
							degree: this.temperatureRadio == '1' ? '36.5' : '38',
							deptId: uni.getStorageSync('isScanCode') ? uni.getStorageSync('deptId') : this.userDetail.deptId,
							userId: this.userDetail.userId,
							remark: this.cause,
							status: this.status,
							destination: this.selectAddressName
						}
					}).then(res => {
						console.log('输入体温事由后点击确定:')
						console.log(res)
						that.temperature = ''
						that.cause = ''
						that.selectAddressName = ''
						that.temperatureRadio = '0'
						that.causeRadiu = '0'
						if (res.data.code == 0) {
							if (that.status == 2) {
								res.data.data.uses = res.data.data.uses + 1
								res.data.data.remaining = res.data.data.remaining - 1
							}
							that.eleDetail = res.data.data
							that.userCause = res.data.data.cause
							that.isShowElectronicCard = true
						} else {
							Toast(res.data.msg)
						}
					})
				}
			},
			// 添加家庭
			saveFamily: function() {
				var that = this
				this.uniFly.post({
					url: '/room/addFamilyTemperature',
					params: {
						deptId: uni.getStorageSync('isScanCode') ? uni.getStorageSync('deptId') : this.userDetail.deptId,
						userId: this.userDetail.userId,
						remark: this.cause,
						status: this.status,
						destination: this.selectAddressName,
						familyPhone: this.familyTelNumber
					}
				}).then(res => {
					that.familyTelNumber = ''
					that.cause = ''
					that.selectAddressName = ''
					that.temperatureRadio = '0'
					that.causeRadiu = '0'
					console.log('家庭成员:')
					console.log(res)
					if (res.data.code == 0) {
						that.familyCode = res.data.data.code
						that.isShowFamilyCode = true
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 点击取消
			clickCancel: function() {
				this.isShowDialog = false
				this.cause = ''
				this.causeRadiu = '0'
				this.temperature = ''
				this.temperatureRadio = '0'
				this.familyTelNumber = ''
				this.selectAddressName = ''
				this.radio = '1'
			},
			// 获取用户输入的体温
			getTemperature: function(e) {
				this.temperature = e.detail
			},
			// 获取用户输入的事由
			getCause: function(e) {
				this.cause = e.detail
			},
			// 获取疫情实时新闻动态
			getEpidemicNews: function() {
				this.uniFly.post({
					url: 'https://api.tianapi.com/txapi/ncov/index?key=0d0324aee1bcb2141f37d9f2e944991d'
				}).then(res => {
					console.log("疫情实时新闻动态:");
					console.log(res);
					this.titleNews = res.data.newslist[0].news[0].summary + "[" + res.data.newslist[0].news[0].pubDateStr + "]";
					this.ncovDetail = res.data.newslist[0].desc
				})
			},
			// 获取疫情各城市详情
			getEpidemicCityDetail: function() {
				this.uniFly.post({
					url: 'https://api.tianapi.com/txapi/ncovcity/index?key=0d0324aee1bcb2141f37d9f2e944991d'
				}).then(res => {
					console.log("疫情城市详情:");
					console.log(res);
					this.cityList = res.data.newslist;
				});
			}
		}
	}
</script>

<style scoped lang="scss"></style>
