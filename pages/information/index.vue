<template>
	<view class="container">
		<view class="top">
			<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com//11.png" class="top-bg">
				<view class="top-title">人员健康登记表</view>
				<view class="top-box">
					<image src="https://jiankangdaka.oss-cn-beijing.aliyuncs.com//notice-logo.png" style="width:40px;height:40px" />
					<view>
						<view>应疫情防控要求，请进出人员进行填报登记。</view>
						<view style="margin-top:4px">个人信息不会对外泄露，请如实填写。</view>
					</view>
				</view>
		</view>
		<!-- 必填信息 -->
		<view class="information">
			<view class="i-title">
				<van-icon name="stop" />基本信息
			</view>
			<van-cell-group>
				<van-field required input-align="right" label="姓名" placeholder="填写您的姓名(必填)" @change="getName" />
				<van-field v-if="isIdCard" required input-align="right" label="身份证号" type="idcard" maxlength="18" placeholder="填写您的18位身份证号(必填)"
				 @change="getIdCardNumber" />
				<picker mode="region" @change="regionLiveChange" :value="region_live">
					<van-cell required title="居住地" :value="region_live.length==0?'请选择':region_live[0]+'-'+region_live[1]+'-'+region_live[2]"
					 is-link />
				</picker>
				<van-field required input-align="right" placeholder="街道/乡镇(必填)" @change="getAddress1" />
				<van-field required input-align="right" placeholder="小区(必填)" @change="getAddress2" />
				<!-- <van-field required input-align="right" placeholder="单元门/门牌号码(必填)" @change="getAddress3" /> -->
				<view style="font-size: 28rpx;display: flex;align-items: center;justify-content: space-between;padding-right: 30rpx;">
					<van-field required input-align="right" type="number" input-class="adzcc" @change="getHouseNum1" /><span>号楼</span>
					<van-field required input-align="right" type="number" input-class="adzcc" @change="getHouseNum2" /><span>单元</span>
					<van-field required input-align="right" type="number" input-class="adzcc" @change="getHouseNum3" /><span>门牌号</span>
				</view>
				<van-field required input-align="right" label="家庭人数" placeholder="填写您的家庭人数(必填)" @change="getFamilyPeople" />
				<van-field required input-align="right" label="手机号码" type="number" maxlength="11" placeholder="填写11位手机号码(必填)"
				 @change="getPhoneNumber" />
				<van-field center required label="短信验证码" placeholder="请输入短信验证码" use-button-slot maxlength="4" @change="getCodeMsg">
					<van-button slot="button" size="small" type="info" @click="getCode" :disabled="isCode">{{code}}</van-button>
				</van-field>
				<van-radio-group :value="radio" @change="onChange">
					<view style="display: flex;font-size: 28rpx;padding:28rpx 32rpx;border-bottom: 2rpx solid #ebedf0;color: #333;">
						<view class="requier" style="width: 30%;">是否隔离人员</view>
						<view style="display: flex;flex: 1;justify-content: space-around;">
							<van-radio name="1">否</van-radio>
							<van-radio name="2">是</van-radio>
						</view>
					</view>
				</van-radio-group>
				<van-radio-group :value="radioPartMember" @change="onPartMemberChange">
					<view style="display: flex;font-size: 28rpx;padding:28rpx 32rpx;color: #333;border-bottom: 2rpx solid #ebedf0;">
						<view class="requier" style="width: 30%;">是否党员</view>
						<view style="display: flex;flex: 1;justify-content: space-around;">
							<van-radio name="1">否</van-radio>
							<van-radio name="2">是</van-radio>
						</view>
					</view>
				</van-radio-group>
				<van-field v-if="radioPartMember==2" required input-align="right" label="人数" placeholder="请输入家庭中党员人数(必填)" @change="getPartMember" />
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
				// 是否要填写身份证
				isIdCard: false,
				// 姓名
				name: "",
				//身份证
				idCardNumber: "",
				// 居住地默认地址
				region_live: [],
				// 街道/乡镇
				address1: "",
				// 小区
				address2: "",
				// 几号楼
				houseNum1: '',
				// 几单元
				houseNum2: '',
				// 门牌号
				houseNum3: '',
				// 手机号
				phoneNumber: "",
				// 验证码框 内容
				code: "发送验证码",
				// 是否禁用验证码
				isCode: false,
				// 短信验证码
				codeMsg: "",
				// 单选框值 1:正常人员 2:隔离人员
				radio: '0',
				// 党员单选框 1:否 2:是
				radioPartMember: '0',
				// 党员人数
				partMember: '',
				// 家庭人数
				familyPeople: ''
			};
		},
		onLoad: function() {
			this.isIdCard = uni.getStorageSync('isIdCard')
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
			// 获取姓名
			getName: function(e) {
				this.name = e.detail;
			},
			// 获取身份证
			getIdCardNumber: function(e) {
				this.idCardNumber = e.detail;
			},
			// 获取选择居住省市区
			regionLiveChange: function(e) {
				this.region_live = e.detail.value;
			},
			// 获取街道/乡镇
			getAddress1: function(e) {
				this.address1 = e.detail;
			},
			// 获取小区/村/酒店
			getAddress2: function(e) {
				this.address2 = e.detail;
			},
			// 获取单元门/门牌号码
			// getAddress3: function(e) {
			// 	this.address3 = e.detail;
			// },
			// getHouseNum1
			getHouseNum1: function(e) {
				this.houseNum1 = e.detail
			},
			// getHouseNum2
			getHouseNum2: function(e) {
				this.houseNum2 = e.detail
			},
			// getHouseNum3
			getHouseNum3: function(e) {
				this.houseNum3 = e.detail
			},
			// 获取手机号
			getPhoneNumber: function(e) {
				this.phoneNumber = e.detail;
			},
			// 获取验证码
			getCodeMsg: function(e) {
				this.codeMsg = e.detail;
			},
			// 获取党员人数
			getPartMember: function(e) {
				this.partMember = e.detail
			},
			// 获取家庭人数
			getFamilyPeople: function(e) {
				this.familyPeople = e.detail;
			},
			// 点击获取验证码
			getCode: function() {
				var that = this;
				if (!this.isCode) {
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
				}
			},
			// 切换隔离单选框
			onChange: function(event) {
				this.radio = event.detail
			},
			// 切换党员单选框
			onPartMemberChange: function(event) {
				this.radioPartMember = event.detail
			},
			// 点击提交
			submite: function() {
				if (this.checked) {
					if (this.name && this.address1 && this.address2 && this.houseNum1 && this.houseNum2 && this.houseNum3 && this.phoneNumber &&
						this.codeMsg &&
						this.radio != "0" && this.radioPartMember != '0' && this.familyPeople) {
						Toast.loading({
							duration: 0,
							message: '完善信息中'
						});
						if (this.radioPartMember == '1') {
							this.sendInformation(0)
						} else if (this.radioPartMember == '2') {
							this.sendInformation(this.partMember)
						}
					} else {
						Toast('必填项不能为空')
					}
				} else {
					Toast('请先同意用户隐私条款')
				}
			},
			// 完善信息请求
			sendInformation: function(partMember) {
				var that = this
				this.uniFly.post({
					url: '/room/addSave',
					params: {
						deptId: uni.getStorageSync('deptId'),
						userName: this.name,
						phonenumber: this.phoneNumber,
						identityNumber: this.idCardNumber,
						address: this.region_live[0] + this.region_live[1] + this.region_live[2],
						street: this.address1,
						plot: this.address2,
						houseNumber: Number(this.houseNum1) + '-' + Number(this.houseNum2) + '-' + Number(this.houseNum3),
						openId: uni.getStorageSync('openId'),
						code: this.codeMsg,
						personId: this.radio,
						cardStatus: this.isIdCard ? '1' : '2',
						spare1: partMember,
						spare2: this.familyPeople
					}
				}).then(res => {
					if (res.data.code == 0) {
						uni.setStorageSync('isInformation', true)
						Toast.clear()
						that.checkUserDetail()
						Dialog.alert({
							title: '提示',
							message: '信息完善成功'
						}).then(() => {
							Dialog.close()
							Dialog.alert({
								title: '提示',
								message: '立即上传人脸'
							}).then(() => {
								uni.navigateTo({
									url: '../addFaceDetector/index'
								})
							})
						})
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 查询用户信息
			checkUserDetail: function() {
				var that = this
				this.uniFly.post({
					url: '/room/getUserByOpenIdApp',
					params: {
						openId: uni.getStorageSync('openId')
					}
				}).then(res => {
					console.log("查询用户信息:")
					console.log(res)
					if (res.data.code == 0) {
						uni.setStorageSync('userDetail', res.data.data)
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
