<template>
  <view class="page">
     <u-navbar
         :fixed="true"
         
         :bgColor="themeColors"
         @leftClick="back"
       >
         <view class="navTitle" slot="left">
           <u-icon name="arrow-left" color="#FFF"></u-icon>
           <text style="margin-left: 20rpx">参观领票</text>
         </view>
     </u-navbar>
     <view>
       <image class="headerImg" :src="imgSrc" mode="scaleToFill" />
     </view>
     <view class="hint" :style="`background: linear-gradient(to bottom, #FFF, `+themeColors +`);`">
         <text :style="'color:'+color_d">{{ list.exhibit.notice }}</text>
     </view>
     <view class="content">
         <view class="list" v-for="item,index in list.tickets" :key="index"  @tap="toTicket(item.id)">
             <image
               class="image"
               :src="item.img"
               mode="aspectFit"
             />
             <view class="btn" @tap.stop="toInfo(index)">
               门票详情
             </view>
         </view>
         <button class="contactbtn" open-type="contact" >
           <image
                 class="image"
                 style=" margin: 0 auto; "
                 src="https://qdhaiming.oss-cn-qingdao.aliyuncs.com/XCX/HMpet/TicketAll.png"
                 mode="aspectFit"
               />
         </button>
     </view>
  </view>
 </template>
 
 <script>
 import{getTicketList}from'@/api/register'
 export default {
     data() {
     return {
           themeColors: uni.getStorageSync('color'),
           imgSrc: uni.getStorageSync("ceilingImg"),
           color_d:uni.getStorageSync('color_d'),
           list:[]
     }
     },
     onLoad(){
       getTicketList({exhibit_id:uni.getStorageSync('exhibit_id')}).then(res=>{
         this.list = res.data
       })
     },
  
     methods:{
       toCustomerServicePages: function () {   
         try {
           wx.openCustomerServiceChat({
             extInfo: {
             url: "https://work.weixin.qq.com/kfid/kfc7f4aed61e78ddd5d" //客服ID
             },
             corpId: 'ww1d5a578da59f9d36', //企业微信ID
             success(res) {}
           })
           } catch (error) {
           showToast("请更新至微信最新版本")
           }
         },
       toTicket(id){
         uni.navigateTo({
           url: '/pages_index/register/index?id='+ id
         })
       },
       toInfo(index){
         uni.navigateTo({
           url: '/pages_index/admission/info?index='+index
         })
       },
       back(){
         uni.navigateBack({
           delta: 1
         })
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
   position: relative;
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
   }
   .hint{
     width: 686rpx;
     height: 60rpx;
     margin: 0 auto;
     position: relative;
     line-height: 60rpx;
     text-align: center;
     font-size: 28rpx;
     top: -40rpx;
     border-radius: 10rpx;
   }
   .content{
     position: relative;
     .list{
       display: flex;
       align-items: center;
       flex-direction: column;
       position: relative;
       .image{
         width: 660rpx;
         height: 220rpx;
         margin: 26rpx auto 0;
       }
       .btn{
         text-align: center;
         line-height: 32rpx;
         height: 32rpx;
         font-size: 20rpx;
         position: absolute;
         bottom: 30rpx;
         right: 220rpx;
         border: 1rpx solid #8B9492;
         padding: 0 8rpx;
         border-radius: 5rpx;
       }
     }
   }
   .contactbtn{
     background: transparent;
     padding: 0;
     margin: 26rpx auto 0;
 
     .image{
         width: 660rpx;
         height: 220rpx;
       }
   }
   button::after {
     border: none;
   }
 </style>
 