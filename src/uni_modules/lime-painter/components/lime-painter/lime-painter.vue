<template>
	<view class="page">
		<!-- <demo-block title="json用法">
			<image :src="picture" v-if="picture" mode="widthFix"></image>
			<l-painter :board="poster" @success="picture = $event" isCanvasToTempFilePath ref="json" style="position: fixed;left: 1500rpx;width: 750rpx;" path-type="url"></l-painter>
		</demo-block> -->
		<!-- <demo-block title="基础用法">
			<l-painter ref="painter">
				<l-painter-view css="background: #07c160; height: 120rpx; width: 120rpx; display: inline-block">
				</l-painter-view>
				<l-painter-view
					css="background: #1989fa; height: 120rpx; width: 120rpx; border-top-right-radius: 60rpx; border-bottom-left-radius: 60rpx; display: inline-block; margin: 0 30rpx;">
				</l-painter-view>
				<l-painter-view
					css="background: #ff9d00; height: 120rpx; width: 120rpx; border-radius: 50%; display: inline-block">
				</l-painter-view>
			</l-painter>
		</demo-block> -->
		<!-- <demo-block title="View 容器">
			<l-painter>
				<l-painter-view css="background: #f0f0f0; padding-top: 100rpx;">
					<l-painter-view css="background: #d9d9d9; width: 33.33%; height: 100rpx; display: inline-block">
					</l-painter-view>
					<l-painter-view css="background: #bfbfbf; width: 66.66%; height: 100rpx; display: inline-block">
					</l-painter-view>
				</l-painter-view>
			</l-painter>
		</demo-block> -->
		<!-- <demo-block title="Text 文本">
			<l-painter>
				<l-painter-view css="background: #f5f5f5; padding: 30rpx; color: #222a29">
					<l-painter-text text="登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼" />
					<l-painter-text text="登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼"
						css="text-align:center; padding-top: 20rpx; text-decoration: line-through " />
					<l-painter-text text="登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼" css="text-align:right; padding-top: 20rpx" />
					<l-painter-text text="水调歌头\n明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。"
						css="line-clamp: 3; padding-top: 20rpx; background: linear-gradient(,#ff971b 0%, #1989fa 100%); background-clip: text" />
				</l-painter-view>
			</l-painter>
		</demo-block> -->
		<!-- <demo-block title="Image 图片">
			<l-painter>
				<l-painter-view>
					<l-painter-text text="基础用法"
						css="margin-top: 30rpx; display: block; padding-bottom:20rpx; color: #999" />
					<l-painter-view>
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx" />
					</l-painter-view>
				</l-painter-view>
				<l-painter-view>
					<l-painter-text text="填充方式"
						css=" margin-top: 30rpx; display: block; padding-bottom:20rpx; color: #999" />
					<l-painter-view css="display: inline-block; padding-right: 12rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: contain; background: #f5f5f5" />
						<l-painter-text text="contain" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
					<l-painter-view css="display: inline-block; padding: 0 12rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: cover; background: #f5f5f5" />
						<l-painter-text text="cover" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
					<l-painter-view css="display: inline-block; padding: 0 12rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: fill; background: #f5f5f5" />
						<l-painter-text text="fill" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
					<l-painter-view css="display: inline-block; margin-top: 30rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: none; background: #f5f5f5" />
						<l-painter-text text="none" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
				</l-painter-view>
			</l-painter>
		</demo-block> -->
		<!-- <demo-block title="QRcode 二维码">
			<l-painter>
				<l-painter-qrcode text="limeui.qcoon.cn" css="width: 200rpx; height: 200rpx" />
			</l-painter>
		</demo-block> -->
		<l-painter css="width: 750rpx; padding-bottom: 100rpx; background: linear-gradient(180deg,#ff971b 0%, #ff5000 100%)" 
				@fail="fail"
				@done="done"
				pathType="url"
				ref="poster"
				performance
				>
				<l-painter-image :src="postInfo.bg_img" css="width: 640rpx;  height: 1386rpx;position:absolute; "/>
				<l-painter-image :src="postInfo.store_one.logo" css="width: 185rpx;  height: 98rpx;position:absolute;top:603rpx;left:218rpx; "/>
				<l-painter-text :text="postInfo.store_one.company_name" css="position:absolute;top:759rpx;left:197.5rpx;color:#055739;font-size:64rpx"></l-painter-text>
				<l-painter-text :text="postInfo.store_one.booth_no" css="position:absolute;top:859rpx;left:197.5rpx;color:#055739;font-size:64rpx"></l-painter-text>
				<l-painter-image :src="postInfo.qr_code_mini_url" css="width: 245rpx;  height: 245rpx;position:absolute;top:1000rpx;left:50rpx; "/>
		</l-painter>
		<button type="default" @click="save">save</button>

	</view>
</template>

<script>
import {getStorePost} from "@/api/v2.js";
	export default {
		props:[postInfo],
		data: () => ({
			postInfo:this.postInfo,
			picture: '',
			picture2: '',
			show: false,
		}),
		mounted() {

			this.$refs.poster.canvasToTempFilePathSync({
				fileType: 'jpg',
				quality: 1,
				success: (res) => {
					console.log(`mounted`, res.tempFilePath)
					this.picture2 = res.tempFilePath
					this.saveImage()
				}
			})
		},
		methods: {
			close() {
				this.show = false
			},
			fail(v) {
				console.log(v)
			},
			done(v) {
				console.log('绘制完成:',v)
			},
			save() {
				this.$refs.poster.canvasToTempFilePathSync({
					fileType: 'jpg',
					quality: 1,
					success: (res) => {
						console.log(res.tempFilePath)
						this.picture2 = res.tempFilePath
						this.saveImage()
					},
					fail(e) {
						console.log('???????????',e)
					}
				})
			},
			// 保存图征
			saveImage() {
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.picture,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						});
					},
				});
				// #endif
			}
		}
	};
</script>

<style lang="stylus" scoped>

</style>
