<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="themeColors" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">活动详情</text>
      </view>
    </u-navbar>
    <view class="header">
      <image
        style="width: 750rpx; height: 532rpx"
        :src="imgSrc"
        mode="scaleToFill"
      />
    </view>
    <view class="content">
      <view class="acInfo">
        <view class="title">
          <text class="titleText">{{ info.title || "" }} </text>
          <view class="star">
            <u-icon
              v-if="showStar"
              @tap="collect"
              name="star-fill"
              label="收藏"
              labelPos="bottom"
              labelSize="10px"
              space="5px"
              color="#999"
              labelColor="rgb(153, 153, 153)"
            ></u-icon>
            <u-icon
              v-if="!showStar"
              @tap="collect"
              name="star-fill"
              label="已收藏"
              labelPos="bottom"
              labelSize="10px"
              space="5px"
              color="#FADB14"
              labelColor="rgb(153, 153, 153)"
            ></u-icon>
          </view>
        </view>
        <u-line margin="18rpx 0 40rpx 0" color="rgb(210, 210, 210)"></u-line>
        <view class="acContent">
          <view class="clist" v-for="(item, index) in list" :key="index">
            <view class="up">
              <view class="colorBox" :style="'background:'+ themeColors" />
              <view class="acTitle">
                {{ item.name }}
              </view>
            </view>
            <view v-if="item.name =='日程'">
              <view class="schedule">
                <view class="sBox" v-for= "acitem,acindex in list.schedule.content" :key="acindex"  :style="'background:'+ themeColors+'D5'">
                    <viewd style="display: flex;flex-wrap: wrap;"> {{ acitem.schedule_title }}</viewd>
                    <view style="font-size: 28rpx;margin: 20rpx 0 25rpx 0;"> {{ acitem.time_slot }}</view>
                    <view> —
                      <text v-for="name,nindex in acitem.guest_list" :key="nindex">
                        {{ name.full_name + '  ' }}
                      </text>
                    </view>
                </view>
              </view>
            </view>
            <view v-else-if="item.name =='嘉宾'">
              <view class="guest" >
                  <view class="guestBox" @tap="showInfo(guitem.guest_id)" v-for="guitem,guindex in list.guest.content" :key="guindex">
                    <view><img class="avatar" :src="guitem.avatar" alt=""/></view>
                    <view style="font-size: 24rpx;color: #000;">{{ guitem.full_name}}</view>
                    <view style="font-size: 24rpx;margin: 14rpx 0 10rpx 0;">{{ guitem.job_title}}</view>
                    <!-- {{ guitem.job_title}} -->
                    <view style="font-size: 24rpx;wdith:396rpx; -webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;text-overflow: ellipsis; word-wrap: break-word;display:-webkit-box; ">
                      {{ guitem.depiction}}
                    </view>
                  </view>
              </view>
             
            </view>

            <view v-else class="down">
              {{ item.content }}
            </view>
            
          </view>
          <view class="clist">
            <view class="up">
              <view class="colorBox" :style="'background:'+ themeColors" />
              <view class="acTitle"> 活动介绍 </view>
            </view>
            <view class="down">
              <rich-text :nodes="info.content" @tap="handleRich"></rich-text>
            </view>
          </view>
        </view>
      </view>
      <view class="footerBtn">
        <button class="shareBtn" :style="'color:'+ themeColors+';border-color:'+themeColors" open-type="share"> 分享好友 </button>
        <!-- 暂时隐藏 -->
        <view
          v-if="exhibitId !== 4"
          class="btn"
          @tap="apply"
          :style="showapply ? 'background: rgb(153, 153, 153);' : 'background:'+ themeColors"
        >
          {{ bmText }}
        </view>
      </view>
    </view>
    <u-popup :show="showPop" @close="close">
        <view class="guestInfo">
            <view class="popBox" style="display: flex;">
              <view class="popavatar">
                <image
                :src="guestInfo.avatar"
                mode="scaleToFill"
              />
              </view>
              <view style="margin-left: 60rpx">
                <view style="margin-bottom:36rpx;font-size: 36rpx;">{{ guestInfo.full_name }}</view>
                <view style="font-size: 26rpx;">{{ guestInfo.job_title }}</view>
              </view>
            </view>
            <view class="popBox">
              <view style="font-size: 40rpx;margin-bottom: 20rpx;">简介</view>
              <view style="margin-left:20rpx;font-size: 24rpx;">{{ guestInfo.depiction }}</view>
            </view>
            <view class="popBox">
              <view style="font-size: 40rpx;margin-bottom: 20rpx;">日程</view>
              <view style="margin: 0 0 20rpx 20rpx;"  v-for="listItem,listIndex in guestInfo.schedule_list" :key="listIndex">
                <view>{{ listItem.schedule_title }}</view>
                <view style="font-size: 24rpx;margin-top: 10rpx;">{{ listItem.time_slot }}</view>
              </view>
            </view>
        </view>
		  </u-popup>
  </view>
</template>

<script>
import { activeCollect, activeEnroll } from "@/api/list";
import {getACInfo , getGuestInfo } from "@/api/v2";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      imgSrc: uni.getStorageSync("ceilingImg"),   
      exhibitId: uni.getStorageSync("exhibit_id"),
      showStar: true, //true为未收藏。
      starLock: false,
      showapply: false,
      bmText: "立即报名",
      info: {},
      guestInfo: {},
      showPop: false,
      list: {
        time: { name: "时间", content: "" },
        local: { name: "地点", content: "" },
        sponsor: { name: "主办方", content: "" },
        end_num: { name: "人数限制", content: "" },
      },
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    getACInfo({ activity_id: option.id }).then((res) => {
      this.info = res.data.activity;
      //对循环对象进行赋值
      this.list.time.content =
        this.info.start_time.slice(0, 16) +
        " - " +
        this.info.end_time.slice(0, 16); //时间
      this.list.local.content = this.info.address; //地点
      this.list.end_num.content = this.info.end_num + "人"; //限制人数
      this.list.local.content = this.info.address; //地点
      if(res.data.schedule.length != 0){
        this.list.schedule = {name : '日程',content:res.data.schedule}
      }
      if(res.data.guest.length != 0){
        this.list.guest={name : '嘉宾',content:res.data.guest}
      }
      
      this.list.sponsor.content = this.info.sponsor; //主办方
      let newContent = this.info.content.replace(/<img[^>]*>/gi, (match) => {
        match = match
          .replace(/style="[^"]+"/gi, "")
          .replace(/style='[^']+'/gi, "");
        match = match
          .replace(/width="[^"]+"/gi, "")
          .replace(/width='[^']+'/gi, "");
        match = match
          .replace(/height="[^"]+"/gi, "")
          .replace(/height='[^']+'/gi, "");
        match = match.replace(/style\s*=\s*(["'])(?:(?!\1).)*\1/gi, ""); // 去除 style=""这样的属性
        return match;
      });
      // img标签添加style属性：max-width:100%;height:auto
      this.info.content = newContent.replace(
        /\<img/gi,
        '<img style="width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
      );
      if (res.data.activity.enroll == 1) {
        this.bmText = "报名成功";
        this.showapply = true;
      }
      if (res.data.activity.collect == 1) {
        this.showStar = false;
      }
      uni.hideLoading();
    });
  },
  onShareAppMessage(res) {
			if (res.from === "button") {
			// 来自页面内分享按钮
			console.log(res.target);
			}
			return {
			title: this.info.title,
			path:`/pages_index/activityInfo/index?id=${this.info.activity_id}&exhibit_id=${uni.getStorageSync("exhibit_id")}`,
			};

		},
  onShareTimeline() {
    (res) => {
    return {
      title: this.info.title,
      path:`/pages_index/activityInfo/index?id=${this.info.activity_id}&exhibit_id=${uni.getStorageSync("exhibit_id")}`,
      imageUrl: imageUrl,
    };
    };
  },
  methods: {
    handleRich(){
      let regex = /<img.*?src="(.*?)"/g;
      let match = regex.exec(this.info.content)
      uni.previewImage({
        urls:[match[1]]
      })
    },
    apply() {
      if (this.showapply) {
        return;
      } else {
        uni.navigateTo({ url: '/pages_index/pay/list?activity_id='+this.info.activity_id })
      }
    },
    collect() {
      if (this.starLock) {
        return;
      } else {
        if (!this.showStar) {
          activeCollect({
            activity_id: this.info.activity_id,
            status: "0",
          }).then((res) => {
            uni.showToast({
              title: "取消收藏",
              icon: "",
            });
            this.showStar = !this.showStar;
            this.starLock = false;
          });
        } else {
          activeCollect({
            activity_id: this.info.activity_id,
            status: "1",
          }).then((res) => {
            uni.showToast({
              title: "已收藏",
              icon: "",
            });
            this.showStar = !this.showStar;
            this.starLock = false;
          });
        }
      }
    },
    showInfo(id){
      uni.showLoading({
        title: "加载中",
      });
      getGuestInfo({guest_id:id}).then((res)=>{
        this.guestInfo = res.data
        this.showPop = true;
        uni.hideLoading()
      })
    },
    close(){
      this.showPop = false;
    },
    back() {
      uni.navigateBack({
        fail:()=>{
          uni.switchTab({ url: '/pages/index/index' })
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 92vh;
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
.header {
  width: 750rpx;
  height: 532rpx;
  background-color: #999999;
}
.content {
  padding: 0 30rpx;
  position: relative;
  .acInfo {
    background-color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    position: relative;
    top: -60rpx;
    margin-bottom: 50rpx;
    .title {
      font-size: 32rpx;
      font-weight: 500;
      line-height: 36rpx;
      display: flex;
      .titleText {
        width: 85%;
        font-weight: 600;
      }
    }
    .star {
      width: 100rpx;
      height: 50rpx;
    }
  }
  .schedule{
    padding-left:30rpx ;
    .sBox{
      padding: 24rpx 32rpx ;
      border-radius: 20rpx;
      margin-top: 24rpx;
      font-size: 28rpx;
      color: #fff;
    }
  }
  .guest{
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-left: 30rpx;
    .guestBox{
      margin-top: 20rpx;
      color: #999999;
      .avatar{
        width: 200rpx;
        height: 200rpx;
        border-radius: 10rpx;
      }
    }
    .guestBox:nth-child(2n){
      margin-left: 26rpx;
    }
  }
 
  .acContent {
    .clist {
      margin-bottom: 20rpx;
      .up {
        display: flex;
        align-items: center;
        .colorBox {
          width: 10rpx;
          height: 40rpx;
          margin-right: 20rpx;
        }
        .acTitle {
          color: rgb(0, 0, 0);
          font-size: 32rpx;
        }
      }
      .down {
        margin: 20rpx 0 20rpx 30rpx;
        color: rgb(153, 153, 153);
        font-size: 28rpx;
        font-weight: 400;
      }
    }
  }
}
.guestInfo{
    height: 50vh;
    overflow: auto;
    background: #EFEFEF;
    padding: 30rpx 24rpx 0 24rpx;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
    .popBox{
      width: 91%;
      background: #fff;
      border-radius: 20rpx;
      padding: 32rpx;
      margin-top: 20rpx;
      .popavatar{
        width: 160rpx;
        height: 160rpx;
        
        image{
          width: 160rpx;
          height: 160rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
.footerBtn {
  display: flex;
  justify-content: space-around;
  position: relative;
  top: -60rpx;
  .btn {
    width: 300rpx;
    height: 70rpx;
    text-align: center;
    line-height: 70rpx;
    border-radius: 100px;
    color: rgb(255, 255, 255);
    font-size: 32rpx;
    font-weight: 600;
  }
  .shareBtn {
    font-size: 32rpx;
    font-weight: 600;
    border-radius: 100px;
    width: 300rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 4rpx solid $theme-color;
    margin: 0;  
  }
  .shareBtn::after{
    border: none;
  }
}
 ::v-deep .u-safe-bottom{
  background: #EFEFEF;
}
</style>
