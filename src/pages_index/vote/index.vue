<template>
 <view class="page" :style="keyboardHeight > 0 ? 'padding-bottom:' + keyboardHeight + 'rpx' : ''">
     <!-- 顶部标题栏 -->
     <u-navbar :fixed="true" :bgColor="bgColor" placeholder @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">投票列表</text>
      </view>
    </u-navbar>
    <view class="header">
        <u-swiper :list="info.get_slider"  keyName="img"  indicator indicatorMode="line" height="400" circular></u-swiper>
    </view>
    <view class="content">
      <view class="num">
        <view class="numBox"> 
          <p style="font-size: 32rpx;">{{ info.total_votes }}</p>
          <p style="font-size: 28rpx;">总投票数</p>
        </view>
        <u-line color="rgba(153, 153, 153, 0.5)" length="80px" direction="col" />
        <view class="numBox">
          <p style="font-size: 32rpx;">{{ info.total_visits }}</p>
          <p style="font-size: 28rpx;">总浏览量</p>
        </view>
      </view>
      <view class="info">
        <view>开始时间:{{ info.start_time }}</view>
        <view style="margin:20rpx 0">截止时间:{{ info.end_time }}</view>
        <view>活动规则:{{ info.poll_rules }}</view>
      </view>
      <view class="list">
        <u-tabs :list="info.get_work_cate" lineWidth="70rpx" lineHeight="3px" :activeStyle="activeStyle"
				:inactiveStyle="inactiveStyle" :lineColor="bgColor"  @click="click"></u-tabs>
        <view class="search" v-if="listInfo.cate_id !== '' " >
          <view class="searchInp"> 
            <u--input
                placeholder="请输入内容"
                border="surround"
                v-model="search"
              ></u--input>
          
            </view>
          <view class="searchBtn" :style="'color:'+bgColor" @tap="searchList" >搜索</view>
			  </view>
        <view class="tag" v-if="listInfo.cate_id !== '' ">
          <view class="tagBox">
              <u-tag
                text="全部"
                borderColor="#FFF"
                :bgColor="bgColor"
                :plain="child_id ==listInfo.cate_id ?  `` : `1`"
                type="warning"
                :name="''"
                @click="radioClick(listInfo.cate_id)"
              >
              </u-tag>
          </view>
          <view class="tagBox"  v-for="(item, index) in listInfo.get_child" :key="index">
              <u-tag
                :text="item.name"
                borderColor="#FFF"
                :bgColor="bgColor"
                :plain="item.cate_id == child_id? `` : `1`"
                type="warning"
                :name="item.cate_id"
                @click="radioClick(item.cate_id)"
              >
              </u-tag>
          </view>
        </view>
        <view class="exInfo"  v-show="listInfo.cate_id == '' ">
            <view class="exBox" v-for="item,index in rankList" :key="item.work_id" @tap="toinfo(item.work_id)">
              <view :style="index<=2? 'color:#FF6600' : ' '">{{index+1}}</view>
                <image
                  class="showPic"
                  :src="item.cover"
                  mode="scaleToFill"
                />
              <view>
                <p style="width:300rpx;font-size: 32rpx;">{{item.title}}</p>
                <p style=" width:300rpx;font-size: 28rpx;color:#999">{{ item.company_name }}</p>
                <p style="width:300rpx;font-size: 28rpx;color:#999">{{item.get_work_cate.name}}</p>
              </view>
              <view class="voteNum" style="font-size: 24rpx;color:#999;margin-left: 12rpx;">
               {{item.total_votes}} 票
              </view>
            </view>
            <u-loadmore marginTop="30" :status="exstatus" fontSize="32" />
        </view>
        <view class="seriesList" v-show="listInfo.cate_id !== '' ">
          <view class="grid-container">
            <view class="grid-item" v-for="(item, index) in workList" :key="index" @tap="toinfo(item.work_id)">
              <image
                class="gridImg"
                :src="item.cover"
                mode="scaleToFill"
              />
              <view class="total_vote">{{ item.total_votes }}票 </view>
              <view>
                <p style="height:72rpx;text-align: center;font-size: 24rpx;">{{ item.title }}</p>
                <p style="height:72rpx;text-align: center;font-size: 24rpx;">{{ item.company_name }}</p>
              </view>
              <view class="btns">
                <view class="btn" :style="'background:'+bgColor">详情</view>
                <view class="btn" :style="'background:'+bgColor" @tap.stop="vote(item.work_id,index)">投票</view>
              </view>
            </view>
          </view>
          <u-loadmore marginTop="30" :status="serstatus" fontSize="32" />
        </view>
      </view>
      <u-back-top :scroll-top="scrollTopu" bottom="250"></u-back-top>
    </view>
 </view>
</template>

<script>
import{getPollInfo,getWorkRankingList,getWorkList,userVotesWork}from'./api';
export default {
 data() {
 return {
        inactiveStyle: {
					color: "rgb(185, 185, 185)",
					fontSize: "32rpx",
					lineHeight: "46rpx",
          fontWeight:"700"
				},
				activeStyle: {
					color: '',
					fontSize: "32rpx",
					lineHeight: "46rpx",
					display: "block",
          fontWeight:"700"
				},
        info:{},
        listInfo:{},
        rankList:[],
        rankPage:1,
        workList:[],
        workPage:1,
        bgColor: uni.getStorageSync('color'),
        child_id:'',
        serstatus:'loadmore',
        exstatus:'loadmore',
        scrollTopu:0,
        lock:true,
        search:'',
        poll_id:'',

        keyboardHeight: 0,  // 新增键盘高度状态

 }
 },
 onLoad(options) {
  this.poll_id = options.id
  uni.showLoading({
    title: '加载中',
    mask: true
  })
  getPollInfo({poll_id:this.poll_id}).then(res=>{
    this.info = res.data
    if(this.info.ranking_status){
      this.info.get_work_cate.unshift({name:'排行榜',cate_id:'',get_child:[]})
      getWorkRankingList({poll_id:this.poll_id}).then(res=>{
        this.rankList = res.data.data
        if(res.data.data.length < 15){
          this.exstatus = 'nomore' 
        }
      })
    }
    this.listInfo = res.data.get_work_cate[0]
    getWorkList({poll_id:this.poll_id,cate_id:this.listInfo.cate_id,search:''}).then((res)=>{
      this.workList = res.data.data
      if(res.data.data.length < 15){
            this.serstatus = 'nomore' 
        }
    })
    uni.onKeyboardHeightChange(res => {
    this.keyboardHeight = res.height
 })
    uni.hideLoading()
  })
 },
 onReachBottom() {
  if(this.child_id ==''){
    if(this.exstatus == 'nomore'){
      return;
    }else{
      this.exstatus = 'loading'
      this.rankPage++
      getWorkRankingList({poll_id:this.poll_id,page:this.rankPage}).then(res=>{
        // 将新数据追加到现有rankList中
        this.rankList = this.rankList.concat(res.data.data) 
        if(res.data.data.length < 15){
          this.exstatus = 'nomore' 
        }
      })
     }
  }else{
      if(this.serstatus == 'nomore'){
        return; 
      }else{
        this.serstatus = 'loading'
        this.workPage++
        getWorkList({poll_id:this.poll_id,cate_id:this.listInfo.cate_id,search:this.search,page:this.workPage}).then((res)=>{
          // 将新数据追加到现有workList中
          this.workList = this.workList.concat(res.data.data)
          if(res.data.data.length < 15){
            this.serstatus = 'nomore' 
          }
        })
      }
  }
 },
 onPageScroll(event) {
  // 更新页面滚动高度
			this.scrollTopu =event.scrollTop;

		},
 methods:{
  vote(id,index){
    if (this.lock) {
        this.lock = false;
        userVotesWork({ work_id: id }).then((res) => {
          if(res.code ==1){
            this.workList[index].total_votes = this.workList[index].total_votes + 1;
          }
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
          this.lock = true;
        });
      } else {
        this.lock = true;
        return;
      }
  },
  searchList(){
    this.workPage = 1
    getWorkList({poll_id:this.poll_id,cate_id:this.child_id,search:this.search,page:1}).then((res)=>{
      this.workList = res.data.data
    })
  },
  radioClick(id){
    this.child_id = id
    getWorkList({poll_id:this.poll_id,cate_id:this.child_id,search:'',page:1}).then((res)=>{
      this.workList = res.data.data
    })
  },
  click(e){
    this.listInfo = e
    this.child_id = e.cate_id
    getWorkList({poll_id:this.poll_id,cate_id:e.cate_id,search:'',page:1}).then((res)=>{
      this.workList = res.data.data
    })
  },
  toinfo(id){
    uni.navigateTo({ url: '/pages_index/vote/info?work_id='+id });
  },
  back() {
    uni.switchTab({ url: '/pages/index/index' });
  },
 }
}
</script>

<style scoped lang="scss">
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
.header{
    width: 100%;
    height:400rpx
}
.content{
  padding: 8rpx 32rpx;
  .num{
    background: #fff;
    display: flex;
    padding: 24rpx 0 20rpx;
    border-radius: 20rpx;
    .numBox{
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 56rpx;
      font-weight: 700;
    }
  }
  .info{
    margin-top: 24rpx;
    background: #fff;
    padding: 32rpx 32rpx 20rpx;
    border-radius: 20rpx;
    font-size: 28rpx;
  }
  .list{
    margin-top: 24rpx;
    background: #fff;
    padding: 20rpx 32rpx;
    border-radius: 20rpx;
    .search {
			margin: 20rpx 0;
			height: 56rpx;
			display: flex;
			align-items: center;

			.searchInp {
				padding-left: 20rpx;
				display: flex;
				align-items: center;
				color: rgba(0, 0, 0, 0.6);
				width: 550rpx;
				text {
					margin-left: 20rpx;
					font-size: 24rpx;
				}
			}

			.searchBtn {
				display: flex;
				align-items: center;
				height: 48rpx;
				width: 100rpx;
				border-radius: 10rpx;
				padding: 8rpx 20rpx;
				font-size: 28rpx;
			}
		}
    .tag{
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .tagBox{
        margin: 10rpx 8rpx ;
      }
    }
    .exInfo{
      padding:32rpx 0;
      .exBox{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 24rpx;
        position: relative;
        .showPic{
          width:164rpx;
          height:164rpx;
          background: #666;
          border-radius: 10rpx;
          margin: 0 12rpx;
        }
        .voteNum{
          position: absolute;
          right:0;
        }
      }
    }
    .seriesList {
      .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 22rpx;
        padding: 20rpx 0;
        
        .grid-item {
          background: #fff;
          border-radius: 10rpx;
          position: relative;
          .gridImg{
            width: 300rpx;
            height: 300rpx;
          }
          .total_vote{
            width: 140rpx;
            height: 32rpx;
            color: #fff;
            background: #E99D42;
            font-size: 24rpx;
            text-align: center;
            border-radius: 0 32rpx 32rpx 0;
            position: absolute;
            top:138rpx;
          }
          .btns{
            display: flex;
            justify-content: space-evenly;
            .btn{
              color: #fff;
              font-size: 24rpx;
              width: 120rpx;
              height: 46rpx;
              border-radius: 8rpx;
              line-height: 46rpx;
              text-align: center;
            }
          }
        }
      }
    }
  }

}
::v-deep .u-tag {
  border-radius: 50rpx !important;
}
::v-deep .u-tag--warning--plain{
  background: #CECECE !important;
}
::v-deep .u-tag__text--warning--plain{
  color:#666!important;
  
}
</style>
