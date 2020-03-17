<template>
	<view class="container">
		<view class="top">
			<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com//11.png" class="top-bg">
				<view class="top-title">企业信息登记</view>
				<view class="top-box">
					<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com//notice-logo.png" style="width:40px;height:40px" />
					<view>
						<view>应疫情防控要求，请完善以下信息进行登记。</view>
						<view style="margin-top:4px">企业信息不会对外泄露，请如实填写。</view>
					</view>
				</view>
		</view>
		<!-- 必填信息 -->
		<view class="information">
			<view class="i-title">
				<van-icon name="stop" />基本信息
			</view>
			<van-cell-group>
				<van-field required input-align="right" label="企业名称" placeholder="填写企业名称(必填)" @change="getCompanyName" />
				<van-field required input-align="right" label="企业地址" placeholder="填写企业地址(必填)" @change="getCompanyAddress" />
				<van-field required input-align="right" label="负责人姓名" placeholder="填写您的姓名(必填)" @change="getName" />
				<van-field required input-align="right" label="负责人身份证" type="idcard" maxlength="18" placeholder="填写您的18位身份证号(必填)"
				 @change="getIdCardNumber" />
				<van-field required input-align="right" label="负责人手机号" type="number" maxlength="11" placeholder="填写11位手机号码(必填)"
				 @change="getPhoneNumber" />
				<van-field center required label="短信验证码" placeholder="请输入短信验证码" use-button-slot maxlength="4" @change="getCodeMsg">
					<van-button slot="button" size="small" type="info" @click="getCode" :disabled="isCode">{{code}}</van-button>
				</van-field>
			</van-cell-group>
			<view style="padding: 20rpx 20rpx 0;font-size: 26rpx!important;display: flex;align-items: center;">
				<van-checkbox :value="checked" checked-color="#07c160" @change="changeCheckBox">
				</van-checkbox>
				<view style="margin-left: 10rpx;">
					我同意<text @click="toPrivacy">《用户隐私条款》</text>
				</view>
			</view>
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
	let t;
	let count = 60;
	export default {
		data() {
			return {
				// 复选框
				checked: true,
				// 用户id
				userId: '',
				// 企业名称
				companyName: '',
				// 企业地址
				companyAddress: '',
				// 负责人姓名
				name: "",
				// 负责人身份证
				idCardNumber: "",
				// 负责人手机号
				phoneNumber: "",
				// 验证码框 内容
				code: "发送验证码",
				// 是否禁用验证码
				isCode: false,
				// 短信验证码
				codeMsg: ""
			};
		},
		onLoad: function(options) {
			this.userId = options.userId
		},
		methods: {
			// 跳转用户隐私协议页面
			toPrivacy: function() {
				uni.navigateTo({
					url:'../privacy/index'
				})
			},
			// 切换复选框
			changeCheckBox: function() {
				this.checked = !this.checked
			},
			// 获取企业名称
			getCompanyName: function(e) {
				this.companyName = e.detail
			},
			// 获取企业地址
			getCompanyAddress: function(e) {
				this.companyAddress = e.detail
			},
			// 获取负责人姓名
			getName: function(e) {
				this.name = e.detail;
			},
			// 获取负责人身份证
			getIdCardNumber: function(e) {
				this.idCardNumber = e.detail;
			},
			// 获取负责人手机号
			getPhoneNumber: function(e) {
				this.phoneNumber = e.detail;
			},
			// 获取验证码
			getCodeMsg: function(e) {
				this.codeMsg = e.detail;
			},
			// 点击获取验证码
			getCode: function() {
				var that = this;
				if (!this.isCode) {
					if (this.phoneNumber) {
						this.uniFly.post({
							url: '/room/register',
							params: {
								phonenumber: this.phoneNumber
							}
						}).then(res => {
							if (res.data.code == 0) {
								Toast("发送成功");
								// 开启定时器
								t = setInterval(function() {
									if (count == 0) {
										clearInterval(t);
										that.code = "获取验证码";
										that.isCode = false;
										count = 60;
									} else {
										count--;
										that.code = count + "秒";
										that.isCode = true;
									}
								}, 1000);
							} else {
								Toast("发送失败");
							}
						});
					} else {
						Toast('请输入手机号')
					}
				}
			},
			// 点击提交
			submite: function() {
				// console.log(this.companyName)
				// console.log(this.companyAddress)
				// console.log(this.name)
				// console.log(this.idCardNumber)
				// console.log(this.phoneNumber)
				// console.log(this.codeMsg)
				if (this.checked) {
					this.sendInformation()
				} else {
					Toast('请先同意用户隐私条款')
				}
			},
			// 完善信息请求
			sendInformation: function() {
				this.uniFly.post({
					url: '/enterprise/info/add',
					params: {
						enterpriseName: this.companyName,
						enterpriseAddress: this.companyAddress,
						leadingName: this.name,
						leadingPhone: this.phoneNumber,
						idNumber: this.idCardNumber,
						code: this.codeMsg,
						userId: this.userId
					},
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(res => {
					if (res.data.code == 0) {
						Dialog.alert({
							title: '提示',
							message: '提交成功，请等待审核'
						}).then(() => {
							uni.navigateBack({
								delta: 1
							})
						})
					} else {
						Toast(res.data.msg)
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
