<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
			<view class="navTitle" slot="left">
				<u-icon name="arrow-left" color="#FFF"></u-icon>
				<text style="margin-left: 10rpx">登记核销</text>
			</view>
		</u-navbar>
		
		<view class="qrcode">
			<image
				class="bgimg"
				:src="imgInfo.tickets_img"
				mode="scaleToFill"
			/>
			<view class="time">{{ nowTime }}</view>
			<view style="position: relative;z-index: 888;top: 150rpx;">
				<image
					v-show="!showModal"
					:src="qrcode"
					style="width:286rpx;height:286rpx;"
					mode="scaleToFill"
				/>
				<uqrcode ref="uqrcode" canvas-id="qrcode" :value="info.card_num" 
					v-show="false" 
					size="143"
					@complete="complete"
					:options="{margin : 2, foregroundColor:qrColor, }"></uqrcode>
			</view>
			<view class="num">可入场次数:{{ info.enter_num }}</view>
			<image
				src="https://qdhaiming.oss-cn-qingdao.aliyuncs.com/XCX/CW/TicketQR.png"
				mode="scaleToFill"
				:show-menu-by-longpress="true"
				style="position: relative;width: 130rpx;height: 130rpx;top: 370rpx;"
			/>
		</view>
		<!-- <view class="shareBtn" :style="`background:`+themeColors" @tap="showPop = true">
			分享
		</view> -->
		<u-modal :show="showModal" showCancelButton :title="title" :content='content' @cancel="back" @confirm="modalConfirm"></u-modal>
		<u-popup :show="showPop" mode="center" bgColor="transparent">
            <view class="popBox">
                <image
					class="free"
					:src="imgInfo.enroll_pop_img"
					mode="scaleToFill"
				/>
				<view class="popBtn">
					<button class="btn" open-type='share' style="background: #04C15F;margin:  0 9rpx 0 0; ">微信分享</button>
					<view class="btn" @tap="showPoster" style="background: #0041AB;">海报分享</view>
				</view>
				<view class="close" @tap="showPop = false">
					<u-icon name="close-circle" color="#fff" size="64"></u-icon>
				</view>
            </view>
		</u-popup>
		<u-popup :show="poster" mode="center" bgColor="transparent">
            <view class="popBox">
				<image
					:src="picture2"
					style="width: 500rpx; height:974.3rpx;position: relative;z-index:999 ;"
					mode="aspectFit"
				/>
				<l-painter css="width: 500rpx; height:974.3rpx; " 
						custom-style="position: fixed; left: 200%"
						@fail="fail"
						@done="done"
						pathType="url"
						ref="poster"
						performance
					>
						<l-painter-image :src="posterInfo.bg.bg_img" css="width: 500rpx; height:974.3rpx; position:absolute; "/>
						<l-painter-view   css="color:#0041AB;position:absolute;top:63.5%; left:140rpx;width:338rpx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;height:59.2rpx;line-height:59.2rpx;text-align:center">
							<l-painter-text :css="`font-size:26rpx`" :text="posterInfo.map.username"/>
						</l-painter-view>
						<l-painter-image :src="posterInfo.map.qr_code_mini_url" css="width: 124.8rpx;height: 124.8rpx; border-radius:50%;position:absolute;top:77%;right:12%; "/>
					</l-painter>
				<view class="popBtn">
					<view class="btn" @tap="save" style="background: #0041AB;margin:0; ">保存图片</view>
				</view>
				<view class="close" @tap="poster = false">
					<u-icon name="close-circle" color="#fff" size="64"></u-icon>
				</view>
            </view>
		</u-popup>
	</view>
</template>
<script>
	import {getMyTicket,getShareData} from "@/api/register";
	import {getInfo} from "@/api/list";
	export default {
		data() {
			return {
				themeColors:'',
				qrColor: "#000",
				info: {},
				nowTime: "",
				imgInfo:{},
				title:'提示',
				content:'您的入场次数以用尽，请充值后再进行入场！',
				showPop:false,
				showModal:false,
				poster:false,
				posterInfo:{},
				qrcode: "",
				picture2: "",
			};
		},
		//在mounted钩子函数中调用nowTimes函数、在beforeDestroy钩子函数中调用clear函数
		mounted() {
			this.nowTimes();
			setInterval(this.nowTimes, 1000);
		},
		onShareAppMessage(res) {
		if (res.from === "button") {
			// 来自页面内分享按钮
			console.log(res.target);
			}
			return {
				title: this.info.exhibit_one.name,
				path:`/pages_index/admission/share?scene=t,${uni.getStorageSync("exhibit_id")},${this.info.team.enroll_team_id}`,
			};
		},
		beforeDestroy() {
			this.clear();
		},
		 onShow() {
			this.themeColors =  uni.getStorageSync('color')
			getInfo({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res) => {
					this.imgInfo = res.data
			});
			getMyTicket({
				exhibit_id: uni.getStorageSync("exhibit_id"),
			}).then((res)=>{
				this.info = res.data
				if(this.info.enter_num == 0){
					this.showModal = true;
					
				}
				if (this.info.status == 0) {
					this.qrColor = "#000";
				} else if (this.info.status == 1) {
					this.qrColor = "#2CA347";
				}
		})
			// getShareData({exhibit_id:uni.getStorageSync('exhibit_id'),type:1}).then((res)=>{
			// 	this.posterInfo = res.data
			// 	const timestamp = new Date().getTime();
    		// 	this.posterInfo.map.qr_code_mini_url = `${this.posterInfo.map.qr_code_mini_url}?t=${timestamp}`;			
			// })	 
		},
		onLoad(){
			this.$refs.uqrcode.make({
					success: () => {
						console.log('生成成功');
					},
					fail: err => {
						console.log(err)
					}
			});
		},
		methods: {
			modalConfirm(){
				uni.navigateTo({ url: '/pages_index/pay/index?id='+this.info.exhibit_ticket_id })
			},
			complete(status){
				if(status.success)
				this.$refs.uqrcode.toTempFilePath({
					success: res => {
						console.log(res);
						this.qrcode = res.tempFilePath
					}
				});
			},
			//获取当前时间
			timeNow(timeStamp) {
				const date = new Date(timeStamp);
				const hh = String(date.getHours()).padStart(2, '0');
				const mm = String(date.getMinutes()).padStart(2, '0');
				const ss = String(date.getSeconds()).padStart(2, '0');
				this.nowTime = `${hh}:${mm}:${ss}`;
			},
			// 实时刷新当前时间，格式化
			nowTimes() {
				this.timeNow(new Date());
			},
			//清除定时器
			clear() {
				clearInterval(this.nowTimes);
				this.nowTimes = null;
			},
			// 生成海报
			showPoster(){
				this.showPop = false;
				this.poster = true
				this.$refs.poster.canvasToTempFilePathSync({
				fileType: 'jpg',
				quality: 1,
				success: (res) => {
					this.picture2 = res.tempFilePath
				}
			});
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
				uni.saveImageToPhotosAlbum({
					filePath: this.picture2,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						});
					},
				});
				
			},
			back() {
				uni.switchTab({
					url: "/pages/index/index",
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	.page {
		min-height: 97vh;
		height: auto;
		background: rgb(239, 239, 239);
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
	}

	.navTitle {
		display: flex;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}

	.headerImg {
		width: 750rpx;
		height: 532rpx;
		background: #000;
		display: flex;
	}
	.qrcode {
		margin: 24rpx 32rpx;
		border-radius: 20rpx;
		padding: 32rpx 76rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		background-size: cover; /* 让背景图覆盖整个容器 */
    	background-position: center; /* 让背景图在容器中居中显示 */
		.bgimg{
			position: absolute;
			height: 1050rpx;
			z-index: 0;
		}
		.time {
			position: relative;
			z-index: 999;
			top: 130rpx;
			font-weight: 700;	
			font-size:72rpx;
			color: #FFF;
		}
		.num{
			position: relative;
			z-index: 999;
			top: 155rpx;
			font-weight: 700;	
			font-size:38rpx;
			color: #FFF;

		}
	}
	.shareBtn{
		width: 96rpx;
		height: 96rpx;
		position: fixed;
		border-radius: 96rpx;
		color: #FFF;
		right: 16rpx;
		bottom:200rpx;
		display : flex;
		justify-content: center;
		align-items: center;
		font-weight: 700;
	}
	.popBox{
		position: relative;
		.free{
			width: 600rpx;
			height: 800rpx;
			border-radius: 20rpx;
			position: relative;
			z-index: 998;
		}
		.popBtn{
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			bottom:-30rpx;
			width: 100%;
			z-index: 999;
			.btn{
				width: 236rpx;
				height: 66rpx;
				text-align: center;
				line-height: 66rpx;
				border-radius: 10rpx;
				color: #FFF;
				font-size:36rpx;
				font-weight: 700;
			}
		}
		.close{
			position: absolute;
			bottom: -130rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
		}
	}
	
</style>