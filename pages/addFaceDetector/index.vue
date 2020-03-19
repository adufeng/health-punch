<template>
	<view>
		<view style="padding-top: 80rpx;">
			<!-- <image src="https://zhihuiyiyuan.oss-cn-beijing.aliyuncs.com/tupian/checkFace.png" style="width: 100%;height: 400px;"></image> -->
		</view>
		<view style="padding: 14rpx">
			<van-button type="info" round custom-class="shadow-btn" block @click="chooseFaceImage">点击开始检测</van-button>
		</view>
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
				// 0:云卡 1:百度 2:云平台
				faceId: '',
				// 云平台设备号
				cloudNo: ''
			};
		},
		onLoad: function(options) {
			this.faceId = uni.getStorageSync('faceId')
			if (options.cloudNo) {
				this.cloudNo = options.cloudNo
			}
		},
		methods: {
			chooseFaceImage: function() {
				var that = this
				uni.chooseImage({
					count: 1,
					sizeType: 'compressed',
					sourceType: ['camera'],
					success: (e) => {
						if (e.errMsg == 'chooseImage:ok') {
							Toast.loading({
								mask: true,
								duration: 0,
								message: '上传中'
							})
							if (that.faceId == '1') {
								console.log('调用云卡人脸')
								that.checkIsFaceYunKa(e.tempFilePaths[0])
							} else if (that.faceId == '2') {
								console.log('调用百度人脸')
								that.upLoadFaceBaidu(e.tempFilePaths[0])
							} else if (that.faceId == '3') {
								console.log('调用云平台人脸')
								that.upLoadFaceCloud(e.tempFilePaths[0])
							}
						}
					}
				})
			},
			// 检测人脸是否合格 —— 云卡
			checkIsFaceYunKa: function(e) {
				var that = this
				uni.uploadFile({
					url: 'https://wts.yinshangjituan.com/app/upload/check/facePhoto',
					filePath: e,
					header: {
						'content-type': 'multipart/form-data'
					},
					name: 'file',
					success: (res) => {
						var mydata = JSON.parse(res.data);
						console.log(mydata)
						if (mydata.code == 0) {
							that.addFaceYunKa(mydata.data)
						} else {
							Toast(mydata.msg)
						}
					},
					fail: (err) => {
						Toast(err)
					}
				})
			},
			// 上传人脸 —— 云卡
			addFaceYunKa: function(url) {
				this.uniFly.post({
					url: 'https://wts.yinshangjituan.com/app/authentication/wx/uploadUserPhoto',
					params: {
						photoPath: url,
						userId: uni.getStorageSync('userDetail').userId
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						Toast.clear()
						Dialog.alert({
							title: '提示',
							message: '上传成功'
						}).then(() => {
							uni.navigateBack({
								delta: 5
							})
						})

					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 上传人脸到服务器(返回网络地址) —— 百度
			upLoadFaceBaidu: function(e) {
				var that = this
				uni.uploadFile({
					url: 'https://dfl.yinshangjituan.com/app/room/uploadVideo',
					filePath: e,
					header: {
						'content-type': 'multipart/form-data'
					},
					name: 'file',
					success: function(res) {
						console.log(res);
						var mydata = JSON.parse(res.data);
						console.log(mydata.data.url)
						that.checkIsFaceBaidu(mydata.data.url)
					},
					fail: function(err) {
						Toast(err)
					}
				});
			},
			// 检测是否是人脸 —— 百度
			checkIsFaceBaidu: function(url) {
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
						} else if (res.data.error_code == 222204) {
							Toast('图片解析失败');
						} else if (res.data.error_code == 0) {
							// 检测人脸是否存在
							that.faceDetectionExistsBaidu(url);
						} else {
							Toast('错误码：' + res.data.error_code);
						}
					});
			},

			// 检测人脸是否在当前用户组中已经存在 —— 百度
			faceDetectionExistsBaidu: function(url) {
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
							group_id_list: 'main'
						}
					})
					.then(res => {
						console.log('检测是否存在', res);
						// 成功
						if (res.data.error_code == 0) {
							// 人脸组存在 并且阀值大于80分 可以判定人脸存在
							if (res.data.result.user_list.length != 0 && res.data.result.user_list[0].score >= 80) {
								Toast('人脸已存在');
							} else {
								// 人脸不存在 可以添加
								that.addFaceBaidu(url);
							}
						} else if (res.data.error_code == 222207) {
							// 人脸不存在 可以添加
							that.addFaceBaidu(url);
						} else {
							Toast('检测是否存在,错误码：' + res.data.error_code);
						}
					});
			},
			// 上传人脸照片到百度 —— 百度
			addFaceBaidu: function(url) {
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
							group_id: 'main',
							quality_control: 'NORMAL',
							user_id: uni.getStorageSync('userDetail').userId
						}
					})
					.then(res => {
						console.log('上传', res);
						if (res.data.error_code == 0) {
							that.callBackBaidu(res.data.result.face_token)
						} else if (res.data.error_code == 223105) {
							Toast('人脸已存在,请重新上传');
						} else {
							Toast('上传失败,错误码：' + res.data.error_code);
						}
					});
			},
			// 上传百度成功后的回调
			callBackBaidu: function(faceId) {
				this.uniFly.post({
					url: '/room/addFaceId',
					params: {
						spare4: faceId,
						userId: uni.getStorageSync('userDetail').userId
					}
				}).then(res => {
					console.log('上传百度成功后回调:')
					console.log(res)
					if (res.data.code == 0) {
						Toast.clear()
						Dialog.alert({
							title: '提示',
							message: '人脸上传成功'
						}).then(() => {
							uni.navigateBack({
								delta: 5
							})
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 上传照片至服务器 —— 云平台
			upLoadFaceCloud: function(e) {
				var that = this
				uni.uploadFile({
					url: 'https://dfl.yinshangjituan.com/app/room/uploadVideo',
					filePath: e,
					header: {
						'content-type': 'multipart/form-data'
					},
					name: 'file',
					success: function(res) {
						console.log(res);
						var mydata = JSON.parse(res.data);
						console.log(mydata.data.url)
						that.addFaceCloud(mydata.data.url)
					},
					fail: function(err) {
						Toast(err)
					}
				});
			},
			// 注册人脸照片 —— 云平台
			addFaceCloud: function(e) {
				console.log(e)
				var that = this
				this.uniFly.post({
					url: '/wo/addPersonInfo',
					params: {
						userId: uni.getStorageSync('userDetail').userId,
						imageUrl: e,
						equipmentNo: this.cloudNo
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						Toast.clear()
						Dialog.alert({
							title: '提示',
							message: '人脸上传成功'
						}).then(() => {
							uni.navigateBack({
								delta: 5
							})
						})
					} else {
						Toast(res.data.code)
					}
				})
			}
		}
	};
</script>

<style scoped>
	.detection {
		position: fixed;
		left: 0;
		bottom: 68rpx;
		width: 100%;
		padding: 30rpx;
		background: #2185ff;
		color: #ffffff;
	}
</style>
