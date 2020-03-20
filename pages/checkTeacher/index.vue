<template>
	<view class="container">
		<view v-if="isShowPage">
			<view class="top">
				<view class="top-title">教师详细信息</view>
			</view>
			<view style="margin-top: 60rpx;">
				<van-cell-group custom-class="cell-bg">
					<van-cell title="姓名:" :value="teacherInformation[0].name" :clickable="true" custom-class="cell-bg" />
					<van-cell title="手机号码:" :value="teacherInformation[0].studentId" :clickable="true" custom-class="cell-bg" />
					<van-cell title="年级:" :value="teacherInformation[0].gradeName+teacherInformation[0].className" :clickable="true"
					 custom-class="cell-bg" />
				</van-cell-group>
			</view>
			<view style="margin-top: 30rpx;padding:0 30rpx 30rpx 30rpx;">
				<p class="title" v-if="teacherInformation.length!=0">教师进出记录：</p>
				<view class="list-group" v-if="teacherInformation.length!=0">
					<view class="list-group-title">
						<view style="flex:1">姓名</view>
						<view style="flex:1">时间</view>
						<view style="flex:1" v-if="teacherInformation[0].temperature">体温</view>
						<view style="flex:1" v-if="teacherInformation[0].reverse2">进/出</view>
					</view>
					<view>
						<view class="list" v-for="(item,index) in teacherInformation" :key="index">
							<view style="flex:1">{{item.name}}</view>
							<view style="flex:1">{{item.createTime}}</view>
							<view style="flex:1" v-if="item.temperature">{{item.temperature}}°C</view>
							<view style="flex:1" v-if="item.reverse2">{{item.reserve2}}</view>
						</view>
					</view>
				</view>
				<view v-else class="none">
					暂无教师进出记录
				</view>
			</view>
		</view>
		<van-dialog use-slot title="请填写以下信息" :show="isShowDialog" @confirm="checkTeacherPhone">
			<view style="padding-top: 30rpx;">
				<van-cell-group>
					<!-- <picker mode="selector" :range="schoolList" :value="schoolIndex" @change="changeSchool">
						<van-cell title="学校" :value="school=='' ? '请选择':school " is-link required />
					</picker> -->
					<van-field placeholder="请在此输入手机号码" :value="teacherPhone" label="手机号" input-align="right" :border="true" @input="getTeacherPhone"
					 required />
				</van-cell-group>
				<view style="padding:30rpx;font-size: 26rpx;color: #777;">
					提示:手机号码请勿输入汉字
				</view>
				<view class="message" v-if="isShowMsg">
					查询结果为空，请重新查询或录入。
				</view>
			</view>
		</van-dialog>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default {
		data() {
			return {
				// 是否展示页面
				isShowPage: false,
				// 是否显示弹窗
				isShowDialog: true,
				// 是否显示错误信息
				isShowMsg: false,
				// 学校详情列表
				schoolDetailList: [],
				schoolList: [],
				// 学校下标
				schoolIndex: 0,
				// 选择的学校名称
				school: '',
				// 学号
				teacherPhone: '',
				// 学生数据
				teacherInformation: []
			}
		},
		onLoad: function() {
			// this.getSchoolList()
		},
		methods: {
			// 输入学号后点击确定
			checkTeacherPhone: function() {
				var that = this
				this.isShowDialog = false
				this.uniFly.post({
					url: '/student/info/studentInAndOutList',
					params: {
						// schoolId: this.schoolDetailList[this.schoolIndex].deptId,
						schoolId: uni.getStorageSync('deptId'),
						studentId: this.teacherPhone
					}
				}).then(res => {
					console.log('查询结果', res)
					if (res.data.code == 0) {
						that.isShowMsg = false
						that.isShowPage = true
						that.teacherInformation = res.data.data
					} else {
						that.isShowDialog = true
						that.isShowMsg = true
						that.school = ''
						that.schoolIndex = '0'
						that.teacherPhone = ''
					}
				})
			},
			// 获取输入的学号
			getTeacherPhone: function(e) {
				this.teacherPhone = e.detail
			},
			// 获取学校列表
			getSchoolList: function() {
				var that = this
				this.uniFly.post({
					url: '/room/getSchoolName',
					params: {
						deptId: '0'
					}
				}).then(res => {
					console.log('获取的学校列表', res)
					if (res.data.code == 0) {
						that.schoolDetailList = res.data.data
						res.data.data.forEach(r => {
							that.schoolList.push(r.deptName)
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 选择学校
			changeSchool: function(e) {
				var that = this
				this.schoolIndex = e.detail.value
				this.school = this.schoolList[e.detail.value]
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6feff;
	}

	.top {
		.top-bg {
			width: 100%;
			height: 120px;
			position: absolute;
			z-index: -999;
		}

		.top-title {
			width: 50%;
			text-align: center;
			font-size: 26px;
			font-weight: bold;
			color: #000000;
			padding: 20px 0 14rpx;
			margin: 0 auto;
			border-bottom: 4rpx solid #000000;
		}

		.top-box {
			width: 90%;
			margin: 0 auto;
			padding: 20px 10px;
			background-color: #ffffff;
			border-radius: 4px;
			box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
			display: flex;
			justify-content: space-around;
			align-items: center;
			font-size: 12px;
		}
	}

	.title {
		font-weight: bold;
	}

	.list-group {
		border: 2rpx solid #7b7b7b;
		margin-top: 20rpx;

		.list-group-title {
			padding: 30rpx 10rpx;
			border-bottom: 1px solid #c1c1c1;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			font-weight: bold;
			justify-content: space-around;

			view {
				// flex: 1;
				text-align: center;
			}
		}

		.list {
			padding: 30rpx 10rpx;
			border-bottom: 1px solid #c1c1c1;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			font-weight: bold;
			justify-content: space-around;

			view {
				// flex: 1;
				text-align: center;
				white-space: nowrap;
			}
		}
	}

	.message {
		padding: 0rpx 30rpx 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		color: #ff5500;
		text-align: center;
	}

	.none {
		border: 2rpx solid #7b7b7b;
		margin-top: 20rpx;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>
