<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if (!uni.getStorageSync('isLogin')) {
				uni.setStorageSync('isLogin', false)
			}
			if (!uni.getStorageSync('isInformation')) {
				uni.setStorageSync('isInformation', false)
			}
			uni.setStorageSync('isScanCode', false)

			// 获取百度人脸识别token
			this.uniFly
				.post({
					url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=9ytlz9Qzj2PiyLCsFqGRlal0&client_secret=m552NIatEAyruhrXg0YjjksQeFW8qajB'
				})
				.then(res => {
					if (res.status == 200) {
						uni.setStorageSync('access_token', res.data.access_token)
					}
				});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.van-cell__value {
		color: #333333 !important;
	}

	.shadow-btn {
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.3);
	}

	.requier:before {
		position: absolute;
		content: "*";
		left: 8px;
		font-size: 14px;
		color: #ee0a24;
	}

	.border_bottom:after {
		position: absolute;
		box-sizing: border-box;
		-webkit-transform-origin: center;
		transform-origin: center;
		content: " ";
		pointer-events: none;
		top: auto;
		right: 0;
		bottom: 0;
		left: 16px;
		border-bottom: 1px solid #ebedf0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}

	.text-green {
		color: #39b54a !important;
	}

	.text-bold {
		font-weight: bold;
	}

	.text-blue {
		color: #0081ff !important;
	}

	.adzcc {
		width: 80rpx !important;
	}

	.van-notice-bar {
		padding: 0 !important;
	}

	.van-grid-item__text {
		color: #333333 !important;
		font-size: 26rpx !important;
		font-weight: bold;
		/* margin-top: -10rpx; */
	}

	.van-grid-item__icon {
		font-size: 88rpx !important;
	}

	.btn-padding {
		padding-left: 80rpx !important;
		padding-right: 80rpx !important;
	}

	.cell-bg {
		background-color: #f6feff !important;
		font-weight: bold !important;
	}
</style>
