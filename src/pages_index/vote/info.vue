<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" placeholder @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">详情</text>
      </view>
    </u-navbar>
    <view class="header">
      <u-swiper
        :list="workInfo.img"
        indicator
        indicatorMode="line"
        height="750"
        circular
      ></u-swiper>
    </view>
    <view class="content">
      <view class="num">
        <view class="numBox">
          <p>{{ workInfo.poll_ranking }}</p>
          <p>当前排名</p>
        </view>
        <u-line
          color="rgba(153, 153, 153, 0.5)"
          length="80px"
          direction="col"
        />
        <view class="numBox">
          <p>{{ workInfo.total_votes }}</p>
          <p>当前票数</p>
        </view>
        <u-line
          color="rgba(153, 153, 153, 0.5)"
          length="80px"
          direction="col"
        />
        <view class="numBox">
          <p>{{ workInfo.diff_votes }}</p>
          <p>距上一名</p>
        </view>
      </view>
      <view class="info">
        <p class="title">作品名称</p>
        <p class="dec">
          {{ workInfo.title }}
        </p>
        <p class="title">公司名称</p>
        <p class="dec">
          {{ workInfo.company_name }}
        </p>
        <p class="title">作品简介</p>
        <rich-text :nodes="workInfo.content"></rich-text>
        <view class="tag">
          <view class="tagBox">{{ workInfo.get_work_cate.name }}</view>
        </view>
      </view>
    </view>
    <view class="footer">
      <view class="shareBox" @tap="showPop = true">
        <u-icon name="share" size="48rpx"></u-icon>
        <text>分享</text>
      </view>
      <view class="collectBtn" :style="'background:' + bgColor" @tap="vote">
        <text>投票</text>
      </view>
    </view>
    <view>
      <u-popup :show="showPop" safeAreaInsetBottom @close="close" @open="open">
        <view class="popTitle">分享至</view>
        <view class="sharePop">
          <button class="shareOpen" open-type="share">
            <view>
              <img
                src="../../pages_platform/static/wx.png"
                class="shareImg"
                alt=""
              />
            </view>
            <view>微信好友</view>
          </button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import { getWorkInfo, userVotesWork } from "./api";
import {getInfo} from "@/api/list.js";
export default {
  data() {
    return {
      workInfo: {},
      showPop: false,
      lock: true,
      bgColor: uni.getStorageSync("color"),
    };
  },
  onLoad(options) {
    let workId = null;
    
    // 处理直接传递的work_id参数
    if(options.work_id){
      workId = options.work_id;
    }
    // 处理分享场景码参数
    else if(options.scene){
      const scene = decodeURIComponent(options.scene);
      let arr = scene.split(',');
      if(arr[0] === 'w' && arr[2]){
        workId = arr[2];
        // 同时设置exhibit_id
        if(arr[1]){
          uni.setStorageSync('exhibit_id', arr[1]);
          getInfo({exhibit_id:arr[1]}).then((res)=>{
							uni.setStorageSync("ceilingImg", res.data.img);
							uni.setStorageSync('color', res.data.color_main);
							uni.setStorageSync('color_d', res.data.color_deputy);
						})
        }
      }
    }
    // 从本地存储获取work_id（兜底方案）
    else {
      workId = uni.getStorageSync('work_id');
    }
    
    if(workId){
      getWorkInfo({ work_id: workId }).then((res) => {
        this.workInfo = res.data;
      });
    }
  },
  onShareAppMessage(res) {
			if (res.from === "button") {
			// 来自页面内分享按钮
			}
			return {
			title: "请帮我投票!",
			path:`/pages_index/vote/info?scene=w,${uni.getStorageSync("exhibit_id")},${this.workInfo.work_id}`,
			};

		},
		onShareTimeline() {
			(res) => {
			return {
				title: "请帮我投票!",
				path:`/pages_index/vote/info?scene=w,${uni.getStorageSync("exhibit_id")},${this.workInfo.work_id}`,
				imageUrl: imageUrl,
			};
			};
		},
  methods: {
    vote() {
      if (this.lock) {
        this.lock = false;
        userVotesWork({ work_id: this.workInfo.work_id }).then((res) => {
          if(res.code ==1){
            this.workInfo.total_votes = this.workInfo.total_votes + 1;
          }
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
          this.lock = true;

        });
      } else {
        return;
      }
    },
    open() {},
    close() {
      this.showPop = false;
    },
    back() {
      uni.navigateBack(
        { 
          delta: 1,
            fail: () => {
              uni.switchTab({ url: "/pages/index/index" });
            }
         }
        
      );
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  min-height: 92vh;
  background: rgb(239, 239, 239);
  padding-bottom: 100rpx;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
.navTitle {
  display: flex;
  color: rgb(255, 255, 255);
  font-size: 36rpx;
  font-weight: 700;
  line-height: 36rpx;
  text-align: left;
}
.header {
  width: 100%;
  height: 750rpx;
}
.content {
  padding: 24rpx 32rpx;
  .num {
    background: #fff;
    display: flex;
    padding: 24rpx 0 20rpx;
    border-radius: 20rpx;

    .numBox {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      line-height: 56rpx;
      font-weight: 700;
    }
  }
  .info {
    background: #fff;
    margin-top: 24rpx;
    border-radius: 20rpx;
    padding: 24rpx 32rpx;
    .title {
      font-weight: 700;
      margin: 16rpx 0;
    }
    .dec {
      font-size: 28rpx;
    }
    .tag {
      display: flex;
      margin: 16rpx 0;
      .tagBox {
        height: 38rpx;
        color: #fff;
        padding: 6rpx 15rpx;
        border-radius: 38rpx;
        font-size: 24rpx;
        background: #e99d42;
        text-align: center;
        line-height: 38rpx;
      }
    }
  }
}
.footer {
  background: #fff;
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  .shareBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text {
      font-size: 24rpx;
    }
  }
  .collectBtn {
    width: 480rpx;
    height: 72rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 20rpx;
  }
}
.popTitle {
  margin: 48rpx;
  font-weight: 600;
}
.sharePop {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-bottom: 30rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
  .shareImg {
    width: 112rpx;
    height: 112rpx;
    margin-bottom: 24rpx;
  }
}
.shareOpen {
  outline: none !important;
  border: none;
  overflow: visible;
  background: #fff;
  margin: 0;
  padding: 0;
  line-height: 32rpx !important;
}
button::after {
  border: none;
}
</style>

