<template>
	<view class="container">
		<view class="group">
			<view class="box" @click="toEnterStudent">
				<view>
					<image src="../../static/enteringStudent.png" style="width: 100rpx;height: 100rpx;" mode=""></image>
				</view>
				<p>录入学生信息</p>
			</view>
			<view class="box" @click="toCheckStudent">
				<view>
					<image src="../../static/checkStudent.png" style="width:110rpx;height: 100rpx;" mode=""></image>
				</view>
				<p>查看学生信息</p>
			</view>
			<view class="box" @click="toEnterTeacher">
				<view>
					<image src="../../static/enteringTeacher.png" style="width: 100rpx;height: 100rpx;" mode=""></image>
				</view>
				<p>录入教师信息</p>
			</view>
			<view class="box" @click="toCheckTeacher">
				<view>
					<image src="../../static/checkTeacher.png" style="width:110rpx;height: 100rpx;" mode=""></image>
				</view>
				<p>查看教师信息</p>
			</view>
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
			},
			// 跳转录入教师信息页面
			toEnterTeacher: function() {
				uni.navigateTo({
					url: '../enterTeacher/index'
				})
			},
			// 跳转查看教师信息页面
			toCheckTeacher: function() {
				// Toast('敬请期待')
				uni.navigateTo({
					url: '../checkTeacher/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		background-image: linear-gradient(120deg, #007AFF, #7bed9f);

		.group {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			width: 90%;
			margin: 0 auto;
			padding-top: 200rpx;

			.box {
				width: 300rpx;
				height: 300rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				box-sizing: border-box;
				box-shadow: 10rpx 10rpx 30rpx rgba($color: #000000, $alpha: 0.3);
				position: relative;
				padding: 20rpx;
				margin-bottom: 40rpx;
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


	}
</style>
