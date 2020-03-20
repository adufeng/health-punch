<template>
	<view>
		<view class="top">
			<view class="top-title">完善教师信息</view>
			<view class="top-title1">请填写以下教师信息</view>
		</view>
		<van-cell-group :border="false">
			<!-- <picker mode="selector" :range="schoolList" :value="schoolIndex" @change="changeSchool">
				<van-cell title="学校" :value="school=='' ? '请选择':school " is-link required />
			</picker> -->
			<van-cell title="学校" :value="school" required />
			<picker mode="selector" :range="gradeList" :value="gradeIndex" @change="changeGrade">
				<van-cell title="年级" :value="grade=='' ? '请选择':grade " is-link required />
			</picker>
			<picker mode="selector" :range="classList" :value="classIndex" @change="changeClass">
				<van-cell title="班级" :value="classs=='' ? '请选择':classs " is-link required />
			</picker>
			<picker mode="selector" :range="sexList" :value="sexIndex" @change="changeSex">
				<van-cell title="性别" :value="sex=='' ? '请选择':sex " is-link required />
			</picker>
			<van-field label="姓名" placeholder="请输入教师姓名" required @input="getName" input-align="right" />
			<van-field label="手机号码" placeholder="请输入教师手机号码" required @input="getTeacherPhone" input-align="right" />
			<van-cell title="上传照片" :value="isOss ? '上传成功':'未上传'" is-link required @click="chooseImage" />
		</van-cell-group>
		<view style="padding:30rpx;font-size: 26rpx;color: #333;color: #777777;background-color: #FFFFFF;">
			提示:手机号码请勿输入汉字
		</view>
		<view style="padding: 0 20rpx;font-size: 26rpx!important;display: flex;align-items: center;">
			<van-checkbox :value="checked" checked-color="#07c160" @change="changeCheckBox">
			</van-checkbox>
			<view style="margin-left: 10rpx;">
				我同意<text @click="toPrivacy">《用户隐私条款》</text>
			</view>
		</view>
		<view style="padding: 30rpx;display: flex;justify-content: center;">
			<van-button type="info" custom-class="shadow-btn btn-padding" @click="submit">立即提交</van-button>
		</view>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast';
	import Dialog from '../../wxcomponents/vant/dialog/dialog';
	export default {
		data() {
			return {
				// 复选框
				checked: true,
				// 学校详情列表
				schoolDetailList: [],
				schoolList: [],
				// 年级详情列表
				gradeDetailList: [],
				gradeList: [],
				// 班级详情列表
				classDetailList: [],
				classList: [],
				// 性别列表
				sexList: ['男', '女'],
				// 学校下标
				schoolIndex: 0,
				// 年级下标
				gradeIndex: 0,
				// 班级下标
				classIndex: 0,
				// 性别下标
				sexIndex: 0,
				// 选择的学校名称
				school: '',
				// 选择的年级名称
				grade: '',
				// 选择的班级名称
				classs: '',
				// 选择的性别
				sex: '',
				// 姓名
				name: '',
				// 学号
				teacherPhone: '',
				// 是否上传阿里云
				isOss: false,
				// 阿里云地址和key
				ossDetail: {}
			}
		},
		onLoad: function() {
			// this.getSchoolList()
			// 获取学校名称
			this.getSchoolName()
			// 获取年级列表
			this.getGradeList()
		},
		methods: {
			// 跳转用户隐私协议页面
			toPrivacy: function() {
				uni.navigateTo({
					url: '../privacy/index'
				})
			},
			// 切换复选框
			changeCheckBox: function() {
				this.checked = !this.checked
			},
			// 获取学校名称
			getSchoolName: function() {
				var that = this
				this.uniFly.post({
					url: '/room/getSchool',
					params: {
						deptId: uni.getStorageSync('deptId')
					}
				}).then(res => {
					if (res.data.code == 0) {
						that.school = res.data.data.deptName
					}
				})
			},
			// 获取年级列表
			getGradeList: function() {
				var that = this
				this.uniFly.post({
					url: '/room/getSchoolName',
					params: {
						deptId: uni.getStorageSync('deptId')
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						that.gradeDetailList = res.data.data
						res.data.data.forEach(r => {
							that.gradeList.push(r.deptName)
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 选择年级
			changeGrade: function(e) {
				var that = this
				this.gradeIndex = e.detail.value
				this.grade = this.gradeList[e.detail.value]
				this.uniFly.post({
					url: '/room/getSchoolName',
					params: {
						deptId: this.gradeDetailList[e.detail.value].deptId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						that.classDetailList = res.data.data
						res.data.data.forEach(r => {
							that.classList.push(r.deptName)
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 选择班级
			changeClass: function(e) {
				console.log(e)
				this.classIndex = e.detail.value
				this.classs = this.classList[e.detail.value]
			},
			// 选择性别
			changeSex: function(e) {
				this.sexIndex = e.detail.value
				this.sex = this.sexList[e.detail.value]
			},
			// 获取输入姓名
			getName: function(e) {
				this.name = e.detail
			},
			// 获取输入的教师手机号
			getTeacherPhone: function(e) {
				this.teacherPhone = e.detail
			},
			// 点击选择照片
			chooseImage: function() {
				var that = this
				uni.chooseImage({
					count: 1,
					sizeType: 'compressed',
					sourceType: ['camera'],
					success: (e) => {
						if (e.errMsg == "chooseImage:ok") {
							Toast.loading({
								mask: true,
								duration: 0,
								message: '人脸上传中'
							})
							console.log(e.tempFilePaths[0])
							uni.uploadFile({
								url: 'https://dfl.yinshangjituan.com/app/room/uploadVideo',
								filePath: e.tempFilePaths[0],
								header: {
									'content-type': 'multipart/form-data'
								},
								name: 'file',
								success: function(res) {
									console.log(res);
									var mydata = JSON.parse(res.data);
									console.log(mydata)
									if (mydata.code == 0) {
										Toast.clear()
										that.ossDetail = mydata.data
										that.isOss = true
									} else {
										Toast(mydata.msg)
									}

								},
								fail: function(err) {
									console.log(err)
									Toast(err)
								}
							});
						}
					}
				})
			},
			// 点击提交
			submit: function() {
				var that = this
				// 是否同意条款
				if (this.checked) {
					if (!this.isOss) {
						Toast('请上传人脸照片')
					}
					if (this.teacherPhone == '') {
						Toast('请输入教师手机号')
					}
					if (this.name == '') {
						Toast('请输入教师姓名')
					}
					if (this.sex == '') {
						Toast('请选择性别')
					}
					if (this.classs == '') {
						Toast('请选择班级')
					}
					if (this.grade == '') {
						Toast('请选择年级')
					}
					if (this.grade && this.classs && this.sex && this.name && this.teacherPhone && this.isOss) {
						Toast.loading({
							mask: true,
							duration: 0,
							message: '完善中'
						})
						this.uniFly.post({
							url: 'https://wts.yinshangjituan.com/app/student/info/add',
							params: {
								name: this.name,
								studentId: this.teacherPhone,
								gender: this.sex,
								schoolId: uni.getStorageSync('deptId'),
								gradeId: this.gradeDetailList[this.gradeIndex].deptId,
								classId: this.classDetailList[this.classIndex].deptId,
								ossUrl: this.ossDetail.url,
								ossKey: this.ossDetail.key
							}
						}).then(res => {
							console.log(res)
							if (res.data.code == 0) {
								if (res.data.data.type == 1) {
									console.log('type:1,上传至百度云')
									that.checkIsFaceBaidu(that.ossDetail.url, res.data.data.id)
								} else if (res.data.data.type == 2) {
									console.log('type:2,上传至泽弘,暂时不需要操作')
								}
							} else {
								Toast(res.data.msg)
							}
						})
					}
				} else {
					Toast('请先同意用户隐私条款')
				}
			},
			// 检测是否是人脸 —— 百度
			checkIsFaceBaidu: function(url, id) {
				var that = this;
				this.uniFly
					.post({
						url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + uni.getStorageSync('access_token'),
						headers: {
							'Content-Type': 'application/json'
						},
						params: {
							image: url,
							image_type: 'URL',
							quality_control: 'NORMAL',
							face_field: 'age,beauty,expression,face_shape,gender,glasses,landmark,landmark150,race,quality,eye_status,emotion,face_type'
						}
					})
					.then(res => {
						console.log(res);
						if (res.data.error_code == 222202) {
							Toast('未检测到人脸');
							that.deleteStudent(id)
						} else if (res.data.error_code == 222204) {
							Toast('图片解析失败');
							that.deleteStudent(id)
						} else if (res.data.error_code == 0) {
							// 检测人脸是否存在
							that.faceDetectionExistsBaidu(url, id);
						} else {
							Toast('错误码：' + res.data.error_code);
							that.deleteStudent(id)
						}
					});
			},

			// 检测人脸是否在当前用户组中已经存在 —— 百度
			faceDetectionExistsBaidu: function(url, id) {
				var that = this;
				this.uniFly
					.post({
						url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + uni.getStorageSync('access_token'),
						headers: {
							'Content-Type': 'application/json'
						},
						params: {
							image: url,
							image_type: 'URL',
							quality_control: 'NORMAL',
							group_id_list: 'school'
						}
					})
					.then(res => {
						console.log('检测是否存在', res);
						// 成功
						if (res.data.error_code == 0) {
							// 人脸组存在 并且阀值大于80分 可以判定人脸存在
							if (res.data.result.user_list.length != 0 && res.data.result.user_list[0].score >= 80) {
								Toast('人脸已存在');
								that.deleteStudent(id)
							} else {
								// 人脸不存在 可以添加
								that.addFaceBaidu(url, id);
							}
						} else if (res.data.error_code == 222207) {
							// 人脸不存在 可以添加
							that.addFaceBaidu(url, id);
						} else {
							Toast('检测是否存在,错误码：' + res.data.error_code);
							that.deleteStudent(id)
						}
					});
			},
			// 上传人脸照片到百度 —— 百度
			addFaceBaidu: function(url, id) {
				var that = this;
				this.uniFly
					.post({
						url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + uni.getStorageSync(
							'access_token'),
						headers: {
							'Content-Type': 'application/json'
						},
						params: {
							image: url,
							image_type: 'URL',
							liveness_control: 'HIGH',
							group_id: 'school',
							quality_control: 'NORMAL',
							user_id: id
						}
					})
					.then(res => {
						console.log('上传', res);
						if (res.data.error_code == 0) {
							console.log("上传成功的回调")
							that.callBackBaidu(id, res.data.result.face_token)
						} else if (res.data.error_code == 223105) {
							Toast('该人脸已存在');
							that.deleteStudent(id)
						} else if (res.data.error_code == 223120) {
							Toast('活体检测未通过');
							that.deleteStudent(id)
						} else {
							Toast('上传失败,错误码：' + res.data.error_code);
							that.deleteStudent(id)
						}
					});
			},
			// 上传百度成功后的回调
			callBackBaidu: function(id, faceId) {
				this.uniFly.post({
					url: '/student/info/edit',
					params: {
						id: id,
						faceId: faceId,
						failRemark: 'SUCCESS',
						isBaidu: '2'
					}
				}).then(res => {
					console.log('修改教师信息状态:')
					console.log(res)
					Toast.clear()
					if (res.data.code == 0) {
						Dialog.alert({
							title: '提示',
							message: '教师信息完善成功'
						}).then(res => {
							uni.navigateBack({
								delta: 1
							})
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},

			// 删除学生信息
			deleteStudent: function(id) {
				this.uniFly.post({
					url: '/student/info/delete',
					params: {
						id: id
					}
				}).then(res => {
					console.log('删除教师信息:')
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		padding-bottom: 40rpx;

		.top-bg {
			width: 100%;
			height: 120px;
			position: absolute;
			z-index: -999;
		}

		.top-title {
			font-size: 52rpx;
			font-weight: bold;
			color: #000000;
			padding: 40rpx 30rpx 10rpx;
		}

		.top-title1 {
			padding: 0 30rpx;
			color: gray;
			font-size: 28rpx;
		}
	}

	.group-input {
		width: 95%;
		margin: 40rpx auto 0;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 0 6px rgba($color: #929ca3, $alpha: 1.0);
	}
</style>
