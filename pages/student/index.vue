<template>
	<view class="container">
		<view class="box" @click="toEnterStudent">
			<view>
				<image src="../../static/entering.png" style="width: 100rpx;height: 100rpx;" mode=""></image>
			</view>
			<p>录入学生信息</p>
		</view>
		<view class="box" @click="toCheckStudent">
			<view>
				<image src="../../static/check.png" style="width:110rpx;height: 100rpx;" mode=""></image>
			</view>
			<p>查看学生信息</p>
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

			}
		},
		methods: {
			// 跳转录入学生信息页面
			toEnterStudent: function() {
				uni.navigateTo({
					url: '../enterStudent/index'
				})
			},
			// 跳转查看学生信息页面
			toCheckStudent: function() {
				// Toast('敬请期待')
				uni.navigateTo({
					url: '../checkStudent/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		background-image: linear-gradient(120deg, #007AFF, #7bed9f);
		padding-top: 100rpx;

		.box {
			width: 300rpx;
			height: 300rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			box-sizing: border-box;
			margin: 60rpx auto;
			box-shadow: 10rpx 10rpx 30rpx rgba($color: #000000, $alpha: 0.3);
			position: relative;
			padding: 20rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;

			p {
				padding-top: 30rpx;
				text-align: center;
				font-weight: bold;
			}
		}

		.box:active {
			top: 2rpx;
			left: 2rpx;
		}
	}
</style>
