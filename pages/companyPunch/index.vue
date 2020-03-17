<template>
	<view class="container">
		<view class="top">
			<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com//11.png" class="top-bg">
				<view class="top-title">企业每日健康打卡</view>
				<view class="top-box">
					<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com//notice-logo.png" style="width:40px;height:40px" />
					<view>
						<view>应疫情防控要求，请上午下午各打卡一次。</view>
						<view style="margin-top:4px">打卡信息不会对外泄露，请如实填写。</view>
					</view>
				</view>
		</view>
		<!-- 必填信息 -->
		<view class="information">
			<view class="i-title">
				<van-icon name="stop" />打卡信息
			</view>
			<van-cell-group>
				<van-field required input-align="right" label="来企办公人数" placeholder="填写当前来企人数(必填)" @change="getTotalCount" />
				<van-field required input-align="right" label="健康人数" placeholder="填写健康人数(必填)" @change="getHealthCount" />
				<van-field required input-align="right" label="发热人数" placeholder="填写发热人数(必填)" @change="getHeatCount" />
				<van-radio-group :value="radio" @change="onChange">
					<view style="display: flex;font-size: 28rpx;padding:28rpx 32rpx;border-bottom: 1rpx solid rgba(180, 180, 180, 0.4);">
						<view style="color: #222;" class="requier">防疫物资是否充足</view>
						<view style="display: flex;flex: 1;justify-content: space-around;">
							<van-radio name="1">是</van-radio>
							<van-radio name="2">否</van-radio>
						</view>
					</view>
				</van-radio-group>
				<view style="padding:30rpx;">
					<view class="requier" style="padding-bottom: 20rpx;font-size: 28rpx;color: #222;">请上传消毒图片：</view>
					<van-uploader :file-list="fileList" @after-read="afterRead" upload-text="点击上传" max-count="3" @delete="deleteImg" />
				</view>
			</van-cell-group>

			<view class="submite">
				<van-button type="info" block @click="submite">提交表单</van-button>
			</view>
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
				// 用户id
				userId: '',
				// 总人数
				totalCount: '',
				// 健康人数
				healthCount: '',
				// 发热人数
				heatCount: '',
				// 单选框值 1:是(足够) 2:否(不足)
				radio: '0',
				// 上传的图片
				fileList: [],

			};
		},
		onLoad: function(options) {
			this.userId = options.userId
		},
		methods: {
			// 选择完图片
			afterRead: function(event) {
				const {
					file
				} = event.detail;
				console.log(file)
				this.fileList.push({
					url: file.path
				})
			},
			// 点击右上角删除图片
			deleteImg: function(event) {
				this.fileList.splice(event.detail.index, 1)
			},
			// 切换单选框
			onChange: function(event) {
				this.radio = event.detail
			},
			// 获取输入的办公人数总
			getTotalCount: function(e) {
				this.totalCount = e.detail
			},
			// 获取输入的健康人数
			getHealthCount: function(e) {
				this.healthCount = e.detail
			},
			// 获取输入的发热人数
			getHeatCount: function(e) {
				this.heatCount = e.detail
			},
			// 点击提交
			submite: function() {
				this.sendInformation()
			},
			// 完善信息请求
			sendInformation: function() {
				var that = this
				// console.log(this.radio == '2' ? '0' : '1')
				if (this.totalCount && this.healthCount && this.heatCount && this.radio != '0' && this.fileList.length != 0) {
					Toast.loading({
						message: '上传中',
						duration: 0
					})
					let arr = [];
					for (let i = 0; i < that.fileList.length; i++) {
						uni.uploadFile({
							url: 'https://dfl.yinshangjituan.com/app/room/uploadVideo',
							filePath: that.fileList[i].url,
							header: {
								'content-type': 'multipart/form-data'
							},
							name: 'file',
							success: function(res) {
								console.log(res);
								var mydata = JSON.parse(res.data);
								console.log(mydata.data.url)
								arr.push(mydata.data.url);
								if (arr.length == that.fileList.length) {
									that.sendInformationDetail(arr)
									return;
								}
							},
							fail: function(err) {
								console.log(err)
								Toast('第' + i + '张图片上传失败')
							}
						});
					}
				} else {
					Toast('必填项不能为空')
				}
			},
			sendInformationDetail: function(arr) {
				console.log(arr)
				let arrString = ''
				for (var i = 0; i < arr.length; i++) {
					arrString += '|' + arr[i]
				}
				console.log(arrString)
				this.uniFly.post({
					url: '/enterprise/ptc/add',
					params: {
						officeNum: this.totalCount,
						healthyNum: this.healthCount,
						hotNum: this.heatCount,
						antisepsisImage: arrString,
						gam: this.radio == '2' ? '0' : '1',
						userId: this.userId
					},
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(res => {
					Toast.clear()
					if (res.data.code == 0) {
						Dialog.alert({
							title: '提示',
							message: '恭喜，打卡成功'
						}).then(() => {
							uni.navigateBack({
								delta: 1
							})
						})
					} else {
						Dialog.alert({
							title: '提示',
							message: res.data.msg
						}).then(() => {
							uni.navigateBack({
								delta: 1
							})
						})
					}
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
	}

	.top {
		.top-bg {
			width: 100%;
			height: 120px;
			position: absolute;
			z-index: -999;
		}

		.top-title {
			text-align: center;
			font-size: 26px;
			font-weight: bold;
			color: #000000;
			padding: 20px 0;
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

	.information {
		margin-top: 20px;

		.i-title {
			display: flex;
			align-items: center;
			padding: 0 0 10px 10px;
		}
	}

	.addPeople,
	.submite {
		width: 90%;
		margin: 20px auto;
	}

	.peers {
		border-top: 10px solid #f2f2f2;

		.p-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 10px;

			.p-left {
				display: flex;
				align-items: center;
				padding: 10px 0;
			}
		}
	}
</style>
