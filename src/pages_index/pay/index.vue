<template>
  <view class="page">
    <u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
        <view class="navTitle" slot="left">
            <u-icon name="arrow-left" color="#FFF"></u-icon>
            <text style="margin-left: 20rpx">确认订单</text>
        </view>
	</u-navbar>
    <view class="content">
        <!-- 票务信息 -->
        <view class="title">
            <view class="colorBox" :style="`background:`+themeColors"></view>
            <view class="titleStr">票务信息</view>
        </view>
        <view class="ticketInfo">
            <p class="test">
                {{ info.name}}门票  
            </p>
            <p class="money">
                ¥{{info.price}}
            </p>
            <view class="discounts" v-if="showInfo">
                <view class="left" :style="`background:`+themeColors">
                    <image
                        class="icon"
                        src="../static/Vector.png"
                        mode="scaleToFill"
                    />
                </view>
                <view class="right" :style="`background:`+themeColors+`33;color:`+themeColors"   @click="showPop = true">
                    <text>{{textd_code}}</text> 
                    <u-icon name="arrow-right" :color="themeColors"></u-icon>
                </view>
            </view>
            <u-modal 
                :show="showPop" 
                title="请输入优惠码"
                confirmColor="#566788"
                @cancel="showPop=false" 
                @confirm="confirm"
                :closeOnClickOverlay="true" 
                :showCancelButton="true">
                <view>
                    <form>
                        <from-item>
                            <input
                                style="background-color:#EDEDED;border-radius: 10rpx;height:80rpx;margin-top: 56rpx;padding: 5rpx 20rpx"
                                placeholder="请输入券码"
                                v-model="discount_code"
                            />
                            <span v-if="showRule" style="color:red;font-size: 28rpx;margin-top: 10rpx;">无效优惠码</span>
                        </from-item>
                    </form>
                    
                </view>
	        </u-modal>
        </view>
        <!-- 展会信息 -->
        <view class="title" style="margin:40rpx 0" v-if="showInfo">
            <view class="colorBox" :style="`background:`+themeColors"></view>
            <view class="titleStr">展会信息</view>
        </view>
        <view class="ticketInfo" v-if="showInfo">
            <p class="test">
                {{info.name}}
            </p>
            <view class="time">
                <u-icon :name="timeIcon" size="26"></u-icon>
                <span>{{info.start_time}}-{{info.end_time}}</span>
            </view>
            <view class="time">
                <u-icon name="map" size="26"></u-icon>
                <span>{{info.lab_name}}</span>
            </view>
        </view>
        <!-- 订单信息 -->
        <view class="title" style="margin:40rpx 0" v-if="!showInfo">
            <view class="colorBox" :style="`background:`+themeColors"></view>
            <view class="titleStr">订单信息</view>
        </view>
        <view class="ticketInfo"  v-if="!showInfo"> 
            <view class="cell" v-for="(item, index) in showList" :key="index">
				<text class="cellTitle">{{ item.name }}</text>
				<text class="cellCon">{{ item.value }}</text>
			</view>
        </view>
        <view  class="checkBtn" :style="`background:`+themeColors" @click="toCenter"   v-if="!showInfo"> 
            查看门票
        </view>
    </view>
    <view class="footer" v-if="showInfo">
        <view class="left">
            <view style="margin-bottom:10rpx"><text>实付款：</text> <text style="color:#FF0000">¥{{info.price-dmoney}}</text></view>
            <view style="font-size: 28rpx;color: #7F7F7F;"><text>优惠-</text> <text>¥{{dmoney}}</text></view>
        </view>
        <view class="right">
            <view class="subBtn" :style="`background:`+themeColors" @click="topay">
                确认支付
            </view>
        </view>
    </view>
    
  </view>
</template>

<script>
import {getOpenid,ticket,getTicketOrderInfo,verifyDisCode} from '@/api/pay.js';
import {getMyTicket} from "@/api/register";
import {getInfo} from "@/api/list.js";
import log from '@/log.js';
import config from "@/utils/config";
export default {
    data() {
			return {
                themeColors: uni.getStorageSync("color"),
                timeIcon: require("../../static/time.svg"),
                showList:[],
                open_id:'',
                info:{},
                showInfo:false,
                showPop:false,
                showRule:false,
                haveDiscount:false,
                discount_code:'',
                textd_code:'使用优惠码',
                dmoney :0,
                orderInfo:'',
                ticketInfo:{},
               
            }
        },
        onShow() {
            getTicketOrderInfo({exhibit_id:uni.getStorageSync("exhibit_id")}).then((res)=>{
                this.ticketInfo = res.data
                if(this.ticketInfo.status ==1){
                    this.showList=[
                    {name: '支付状态',value: '已支付'},
                    {name: '实付款',value: this.ticketInfo.price},
                    {name: '支付方式',value: '微信支付'},
                    {name: '优惠码',value: this.ticketInfo.discount_code||''},
                    {name: '订单编号',value: this.ticketInfo.out_order_no},
                    {name: '创建时间',value: this.ticketInfo.created_at},
                    {name: '支付时间',value: this.ticketInfo.updated_at},
                    ]
                    this.showInfo = false
                }else{
                    this.showInfo = true
                }
                
            })
        },
        onLoad() {
            uni.showLoading({
					title: "加载中",
				});
            getInfo({
				exhibit_id: uni.getStorageSync("exhibit_id"),
			}).then((res) => {
					this.info = res.data
					uni.hideLoading();
			});
        },  
        methods:{
            back() {
                uni.navigateBack();
             },
             confirm(){
                verifyDisCode({discount_code:this.discount_code,exhibit_id: uni.getStorageSync("exhibit_id")}).then((res)=>{
                    if(res.code ==1){
                        this.showPop =false
                        this.dmoney  = this.info.price
                        this.textd_code = this.discount_code
                        this.haveDiscount = true
                    }else{
                        this.showRule = true
                    }
                })
             },
             topay() {
                uni.showLoading({
					title: "加载中",
				});
                let that = this;
                uni.login({
                provider: "weixin",
                scopes: "auth_user",
                success: (loginRes) => {
                     uni.getUserInfo({
                        provider: "weixin",
                        success: (infoRes) => {
                            //拉取openid
                             getOpenid({
                                js_code: loginRes.code,
                                iv: infoRes.iv,
                                encrypted_data: infoRes.encryptedData,
                                code: config.project,
                            }).then((res)=>{
                                let obj = {
                                    exhibit_id:that.info.exhibit_id,
                                    trade_type:1,
                                    openid:res.data.openid
                                }
                                //判断优惠券 更改pay_type
                                if(that.haveDiscount){
                                    obj.pay_type = 10
                                    obj.discount_code = that.discount_code
                                }else{
                                    obj.pay_type = 1
                                }
                                //支付
                                ticket(obj).then((res)=>{
                                    that.orderInfo = res.data
                                    //优惠券抵扣
                                    if(that.haveDiscount){
                                        uni.showLoading({
                                            title: "加载中",
                                        });
                                        this.getTicketInfo()
                                        return
                                    }
                                   //微信支付
                                    uni.getProvider({
                                        service:'payment',
                                        success:(loginRes)=>{
                                            uni.requestPayment({
                                            "provider":loginRes.provider[0],
                                            appid:that.orderInfo.appId,
                                            timeStamp:that.orderInfo.timeStamp,
                                            nonceStr:that.orderInfo.nonceStr,
                                            package: that.orderInfo.package,
                                            signType:that.orderInfo.signType,
                                            paySign:that.orderInfo.paySign,
                                            success:()=>{
                                                uni.showLoading({
                                                    title: "加载中",
                                                });
                                                that.getTicketInfo()
                                            },
                                            fail: function (err) {
                                                console.log(that)
                                                uni.hideLoading();
                                                uni.showToast({
                                                    title: '支付失败',
                                                    icon:"none",
                                                })
                                            }
                                            })
                                        }
                                    })
                                    
                                })
                            })
                        }
                        })
                        }
                    })
                

             
             },
             toCenter(){
                uni.switchTab({
                    url: "/pages/center/index",
                });
             },
             //腾讯广告
			tencent(){
                let time  = new Date
                let action_time = time.now();
                log.info(uni.getStorageSync("gdt_vid"))
				uni.request({
					url:"http://tracking.e.qq.com/conv",
					method:'POST',
					header:{'Content-Type' : 'application/json' ,'cache-control': 'no-cache'},
					data:{
						"actions":[{
        							"outer_action_id":"outer_action_identity",// 选填，若上报可能有重复请填写该id，系统会根据该ID进行去重，详见FAQ
       								"action_time":action_time,
        							"user_id":{//user_id，可采集到的设备标示
        								"wechat_unionid":uni.getStorageSync("uniond"),//当为小程序类、公众号和企业微信转化时，此字段与wechat_openid必传其一
        								"wechat_app_id":"wx8582966c73ac7e3b",//用户发生该行为对应的小程序appid，该字段必填，并确保该appid已对该账户进行了授权（请参考帮助中心-转化归因使用指南-微信小程序转化归因操作手册中的appid授权部分）
        							},
       								"action_type":"RESERVATION", // 必填 行为类型
        							"trace": {
        								"click_id":uni.getStorageSync("gdt_vid") // 必填 click_id
        							},

								}]
						},
                        
                    success:(res)=>{
                        log.info('res=>',res)
                    },
                    fail:(err)=>{
                        log.info('err=>',err)
                    }
				})
			},
             getTicketInfo(){
                getTicketOrderInfo({exhibit_id:uni.getStorageSync("exhibit_id")}).then((res)=>{
                if(uni.getStorageSync("gdt_vid")){
                    this.tencent()
                }
                this.ticketInfo = res.data
                this.showList=[
                    {name: '支付状态',value: '已支付'},
                    {name: '实付款',value: this.ticketInfo.price},
                    {name: '支付方式',value: '微信支付'},
                    {name: '优惠码',value: this.ticketInfo.discount_code||''},
                    {name: '订单编号',value: this.ticketInfo.out_order_no},
                    {name: '创建时间',value: this.ticketInfo.created_at},
                    {name: '支付时间',value: this.ticketInfo.updated_at},
                ]
                this.showInfo = false
                uni.hideLoading();
            })
             }
        }
}
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
        line-height: 36rpx;
        text-align: left;
    }
    .content{
        padding:48rpx 32rpx;
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 24rpx;
            .colorBox{
                width: 12rpx;
                height: 32rpx;
                margin-right:24rpx;
            }
            .titleStr{
                font-size: 32rpx;
            }
        }
        .ticketInfo{
            background: #FFF;
            border-radius: 20rpx;
            padding: 24rpx 32rpx;
            .money{
                margin: 22rpx 0 38rpx 0;
                color: rgba(255, 0, 0, 0.85);
                font-size: 28rpx;
            }
            .discounts{
                display: flex;
                align-content: center;
                border-radius: 20rpx;
                overflow: hidden;
                .left{
                    padding: 0 20rpx;
                    height: 64rpx;
                    display: flex;
                    align-items: center;
                    .icon{
                        width: 48rpx;
                        height: 48rpx;
                    }
                }
                .right{
                    width: 80%;
                    font-size: 24rpx;
                    height: 64rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 40rpx;
                   
                }
            }
            .time{
                display: flex;
                color: rgb(153, 153, 153);
                font-size: 24rpx;
                font-weight: 500;
                margin-left: 10rpx;
                margin-top:20rpx ;
            }
            .cell {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(210, 210, 210, 0.25);
                padding: 30rpx 0;

                .cellTitle {
                    font-size: 28rpx;
                    color: #000;
                    width: 260rpx;
                    margin-left: 20rpx;
                }

                .cellCon {
                    font-size: 24rpx;
                    color: rgba(0, 0, 0, 0.45);
                }
	        }
        }
        .checkBtn{
            width: 246rpx;
            height: 70rpx;
            color: #FFF;
            font-size: 28rpx;
            margin: 96rpx auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius:70rpx;
        }
    }
    .footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 132rpx;
        box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
        background: rgb(255, 255, 255);
        padding-top: 12rpx;
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: calc(env(safe-area-inset-bottom));
        .left{
            margin-left:38rpx ;
        }
        .right{
            margin-right: 38rpx;
        }
    }
    .subBtn{
            padding: 24rpx 44rpx;
            color: #FFF;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20rpx;
        }
</style>