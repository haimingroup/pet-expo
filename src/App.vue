<script>
import {getInfo} from "@/api/list.js";
	export default {
		onLaunch: function(options) {

			if(uni.getStorageSync('token')){
				if(uni.getStorageSync('defaultTim '!==false)){
					
					 uni.clearStorageSync();
				}else{
					let timestamp = Date.now();
				  if(uni.getStorageSync('defaultTime') < timestamp){
					console.log(uni.getStorageSync('defaultTime') , timestamp)
					
					uni.clearStorageSync();
				  }
				}
			}else{
				  uni.clearStorageSync();
			}
			console.log(options.query)
			if(options.query.scene){

			}else if(options.query.exhibit_id){
				uni.setStorageSync('exhibit_id',options.query.exhibit_id)
				getInfo({exhibit_id:options.query.exhibit_id}).then((res)=>{
					uni.setStorageSync("ceilingImg", res.data.img);
					uni.setStorageSync('color', res.data.color_main);
					uni.setStorageSync('color_d', res.data.color_deputy);
				})
			}
			const updateManager = uni.getUpdateManager() // 小程序版本更新管理器
		  	updateManager.onCheckForUpdate(res => { // 检测新版本后的回调
		      if(res.hasUpdate) { // 如果有新版本提醒并进行强制升级
		          uni.showModal({
		              content: '新版本已经准备好，是否重启应用？',
		              showCancel: false,
		              confirmText: '确定',
		              success: res => {
		                  if (res.confirm) {
		                      updateManager.onUpdateReady(res => { // 新版本下载完成的回调
		                          updateManager.applyUpdate() // 强制当前小程序应用上新版本并重启
		                      })
		
		                      updateManager.onUpdateFailed(res => { // 新版本下载失败的回调
		                          // 新版本下载失败，提示用户删除后通过冷启动重新打开
		                          uni.showModal({
		                              content: '下载失败，请删除当前小程序后重新打开',
		                              showCancel: false,
		                              confirmText: '知道了'
		                          })
		                      })
		                  }
		              }
		          })
		      }
		  }) 
		},
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
	@font-face {
		font-family: "阿里妈妈数黑体 Bold";
		font-weight: 700;
		src: url("//at.alicdn.com/wf/webfont/SCxp2dD2ulj6/6GPSUjZeBDAe.woff2") format("woff2"),
			url("//at.alicdn.com/wf/webfont/SCxp2dD2ulj6/MShs9h5QakXU.woff") format("woff");
		font-display: swap;
	}
</style>