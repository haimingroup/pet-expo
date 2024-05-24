<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true"  :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">观众预登记</text>
      </view>
    </u-navbar>
    <view>
      <image class="headerImg" :src="imgSrc" mode="scaleToFill" />
    </view>
    <view class="title"> 立即登记 </view>
    <view class="content">
      <view class="from">
        <u--form
          labelPosition="left"
          :model="from"
          ref="uForm"
          labelWidth="130rpx"
        >
          <u-form-item
            v-for="(item, key) in showList"
            :key="key"
            :label="item.exhibit_field_one.field_label"
            prop="name"
            required
          >
            <!-- 输入框 -->
            <u--input
              v-if="item.exhibit_field_one.type == 1"
              v-model="from[item.exhibit_field_one.field_name]"
              :disabled="
                item.exhibit_field_one.field_name == 'phone' ? true : false
              "
              placeholder="请输入信息"
              border="bottom"
            ></u--input>
            <!-- 单选 -->
            <u-radio-group
              v-if="item.exhibit_field_one.type == 2"
              v-model="from[item.exhibit_field_one.field_name]"
              placement="row"
              iconSize="24"
              labelSize="32"
            >
              <u-radio
                v-for="(lable, rindex) in JSON.parse(
                  item.exhibit_field_one.options
                )"
                :key="rindex"
                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                iconSize="24"
                labelSize="32"
                :name="rindex"
                :label="lable"
                :value="rindex"
              />
            </u-radio-group>
            <!-- 多选 -->
            <u-checkbox-group
              v-if="item.exhibit_field_one.type == 3"
              v-model="from[item.exhibit_field_one.field_name]"
              placement="row"
              @change="checkboxChange"
            >
              <u-checkbox
                :customStyle="{ marginRight: '8px' }"
                v-for="(clable, cindex) in JSON.parse(
                  item.exhibit_field_one.options
                )"
                :key="cindex"
                iconSize="24"
                labelSize="32"
                :label="clable"
                :name="cindex"
              >
              </u-checkbox>
            </u-checkbox-group>

            <!-- 问答 文本域 -->
            <u--textarea
              v-if="item.exhibit_field_one.type == 4"
              v-model="from[item.exhibit_field_one.field_name]"
              placeholder="请输入内容"
              border="bottom"
            ></u--textarea>
          </u-form-item>
          <u-form-item label="所在地" v-if="showArea" prop="phone" required>
            <text @tap="show = true">{{ locationText }}</text>
            <u-picker
              :show="show"
              ref="uPicker"
              visibleItemCount="7"
              closeOnClickOverlay
              :columns="columns"
              keyName="name"
              @confirm="confirm"
              @cancel="show = false"
              @change="changeHandler"
            ></u-picker>
          </u-form-item>
          <u-form-item label="国家" v-if="showcountry" prop="phone" required>
            <text @tap="showC = true">{{ countryText }}</text>
            <u-picker
              :show="showC"
              closeOnClickOverlay
              visibleItemCount="7"
              :columns="country"
              keyName="cn_name"
              @cancel="showC = false"
              @confirm="confirmCoun"
            ></u-picker>
          </u-form-item>
        </u--form>
      </view>
      <view class="subBtn" :style="'background:'+ themeColors" @tap="submit"> 提交 </view>
    </view>
  </view>
</template>
   <script>
import { getFields, addTicket, getAreaJson, getCountry } from "@/api/register";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      imgSrc: uni.getStorageSync("ceilingImg"),
      show: false,
      showC: false,
      showcountry: false,
      showArea: false,
      bgColor:uni.getStorageSync('color'),
      from: {},
      showList: [],
      columns: [],
      country: [],
      countryCode: "",
      pcode: "",
      cityCode: "",
      areaCode: "",
      locationText: "请选择",
      countryText: "请选择",
      areaList: [],
    };
  },
  async onLoad(options) {
    uni.showLoading({
      title: "加载中",
    });
    await getFields({
      exhibit_id: uni.getStorageSync("exhibit_id"),
    }).then((res) => {
      uni.showToast({
        title: "请登记后查看",
        icon: "none",
      });
      this.showList = res.data;
      this.showList.map((item, index) => {
        this.from[item.exhibit_field_one.field_name] = "";
        if (item.exhibit_field_one.field_name == "area_code") {
          this.showArea = true;
          this.showList.splice(index, 1);
        }
        if (item.exhibit_field_one.field_name == "country") {
          this.showcountry = true;
          this.showList.splice(index, 1);
        }
        if (item.exhibit_field_one.field_name == "phone") {
          this.from["phone"] = uni.getStorageSync("phone");
        }
      });
      uni.hideLoading();
    });
    await getCountry().then((res) => {
      this.country = [res.data];
    });
    if (this.showArea) {
      await getAreaJson().then((res) => {
        this.areaList = res.data;
      });
      this.columns[0] = this.areaList.map((e) => {
        return e;
      });
      this.columns[1] = this.areaList[0].child.map((e) => {
        return e;
      });
      this.columns[2] = this.areaList[0].child[0].child.map((e) => {
        return e;
      });
      const picker = this.$refs.uPicker;
      picker.setColumns(this.columns, "this.columns");
    }
  },
  methods: {
    //省市区多列选择器
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values,
        index,
        indexs,
        picker = this.$refs.uPicker,
      } = e;
      // 改变第一项
      if (columnIndex === 0) {
        let items = this.areaList[index].child.map((e) => {
          return e;
        });
        picker.setColumnValues(1, items);
        items = this.areaList[index].child[0].child.map((e) => {
          return e;
        });
        picker.setColumnValues(2, items);
      }
      // 改变第二项
      if (columnIndex === 1) {
        let items = this.areaList[indexs[0]].child[index].child.map((e) => {
          return e;
        });
        picker.setColumnValues(2, items);
      }
    },
    //省市区提交
    confirm(e) {
      this.locationText = "";
      for (let i = 0; i < e.value.length; i++) {
        this.locationText = this.locationText + " " + e.value[i].name;
      }
      this.from["area_code"] = e.value[e.value.length - 1].code;
      this.show = false;
    },
    //国家选择器提交
    confirmCoun(e) {
      console.log(e.value);
      this.countryText = e.value[0].cn_name;
      this.from["country"] = e.value[0].id;
      this.showC = false;
    },
    checkboxChange(e) {},
    back() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    submit() {
      uni.showLoading({
        title: "加载中",
      });
      if (uni.getStorageSync("team_id")) {
        this.from["enroll_team_id"] = uni.getStorageSync("team_id");
      }
      this.from.exhibit_id = uni.getStorageSync("exhibit_id");
      addTicket(this.from).then((res) => {
        if (res.code == 0) {
          uni.hideLoading();
          uni.showToast({
            title:res.msg,
            icon:'none',
          })
          return;
        } else {
          if(res.data.url){
            uni.setStorageSync('webviewUrl', res.data.url)
								uni.navigateTo({
									url: "/pages_index/webview/index"
							})
          }else if(res.data.pay==1){
            uni.navigateTo({url: "/pages_index/pay/index" });
          }
          else{
            uni.removeStorageSync("team_id");
            uni.removeStorageSync('toexinfo')
            uni.hideLoading();
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          }
         
        }
      }).catch();
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

.title {
  margin: 32rpx 0;
  text-align: center;
  font-size: 32rpx;
  width: 750rpx;
}

.headerImg {
  width: 750rpx;
  height: 532rpx;
}

.from {
  margin: 32rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 20rpx;

  .fromTitle {
    font-size: 32rpx;
  }

  .hint {
    color: rgb(153, 153, 153);
    font-size: 20rpx;
  }
}
::v-deep .u-radio-group--row{
  flex-wrap: wrap;
}
::v-deep .u-radio__icon-wrap{
  width: 24rpx!important;
  height: 24rpx!important;
}
.subBtn {
  width: 360rpx;
  text-align: center;
  margin: 40rpx auto;
  padding: 16rpx 0;
  color: rgb(255, 255, 255);
  font-size: 36rpx;
  border-radius: 50px;
}
</style>