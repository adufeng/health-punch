<template>
	<view style="height: 100vh;background: linear-gradient(90deg,rgba(35,164,255,1) 0%,rgba(45,122,238,1) 100%);padding-top: 100rpx;">
		<view class="title">健康打卡</view>
		<view class="padding" v-if="isShowLoginBtn">
			<van-button type="default" plain round block custom-class="shadow-btn text-green text-bold" icon="chat" open-type="getUserInfo"
			 @getuserinfo="getUserInfo">微信登录</van-button>
		</view>
		<view class="padding" v-else>
			<van-button type="default" plain round block custom-class="shadow-btn text-green text-bold" icon="chat">微信登录</van-button>
		</view>
		<view class="padding" v-if="false">
			<van-button type="default" plain round block custom-class="shadow-btn text-blue text-bold" icon="phone" open-type="getPhoneNumber"
			 @getphonenumber="getPhoneNumber">手机号登录</van-button>
		</view>
		<view class="padding notify shadow-btn" v-if="false">
			<view>提示：</view>
			<view>
				<view>1.普通用户请通过微信登录</view>
				<view style="padding-top: 14rpx;">2.通过信息导入的用户请通过手机号登录</view>
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
				// 临时code
				snapCode: '',
				// 点击登录后换一个按钮
				isShowLoginBtn: true
			};
		},
		onLoad: function() {
			var that = this
			// 获取临时code
			uni.login({
				success: function(res) {
					that.snapCode = res.code;
				}
			});
		},
		methods: {
			// 点击登录
			getUserInfo: function(e) {
				var that = this
				if (e.detail.errMsg == 'getUserInfo:ok') {
					this.isShowLoginBtn = false
					Toast.loading({
						duration: 0,
						mask: true,
						message: '登录中'
					});
					uni.setStorage({
						key: 'userInfo',
						data: e.detail.userInfo
					});
					this.uniFly
						.post({
							url: '/room/decodeUserInfo',
							params: {
								iv: e.detail.iv,
								encryptedData: e.detail.encryptedData,
								code: that.snapCode
							}
						}).then(res => {
							console.log("解密openId:")
							console.log(res)
							if (res.data.code == 0) {
								uni.setStorageSync('openId', res.data.data.openId)
								uni.setStorageSync('isLogin', true)
								Toast.clear()
								that.uniFly.post({
									url: '/room/getUserByOpenIdApp',
									params: {
										openId: res.data.data.openId
									}
								}).then(ress => {
									console.log("查询是否完善信息:")
									console.log(ress)
									that.isShowLoginBtn = true
									if (ress.data.code == 1) {
										Dialog.alert({
											title: '提示',
											message: '登陆成功，去完善信息'
										}).then(() => {
											uni.navigateTo({
												url: '../information/index'
											})
										})
									} else if (ress.data.code == 0) {
										uni.setStorageSync('isInformation', true)
										uni.setStorageSync('userDetail', ress.data.data)
										Dialog.alert({
											title: '提示',
											message: '登陆成功'
										}).then(() => {
											uni.navigateBack({
												delta: 1
											})
										})
									} else {
										Toast(ress.data.msg)
									}
								})
							} else {
								Toast(res.data.msg)
								that.isShowLoginBtn = true
							}
						})
				}
			},
			// 手机号登录
			getPhoneNumber: function(e) {
				var that = this
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					Toast.loading({
						message: '请等待',
						duration: 0
					});
					this.uniFly
						.post({
							url: '/room/decryptData',
							params: {
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
								code: that.snapCode
							}
						})
						.then(res => {
							if (res.data.code == 0) {
								that.getUserDetailByPhone(res.data.data.phoneNumber)
							} else {
								Toast(res.data.msg);
							}
						});
				}
			},
			// 通过手机号查用户信息
			getUserDetailByPhone: function(e) {
				this.uniFly.post({
					url: '/user/getImportUserInfoByPhoneNumber',
					params: {
						phonenumber: '19939153736'
					}
				}).then(res => {
					console.log(res)
				})
			}
		}
	};
</script>

<style scoped>
	.title {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 32rpx;
		margin: 40rpx 0;
	}

	.padding {
		padding: 30rpx;
	}

	.notify {
		width: 80%;
		margin: 50rpx auto 0;
		color: #333;
		background: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		font-weight: bolder;
	}
</style>
