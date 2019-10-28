<template>
  <div id="assignStore">
    <h3>用户信息</h3>
    <div class="product-info-content">
      <span>联系人：</span>
      <span>{{userInfo.name}}</span>
    </div>
    <div class="product-info-content">
      <span>联系方法：</span>
      <span>{{userInfo.mobile}}</span>
    </div>
    <div class="product-info-content">
      <span>地址：</span>
      <span>{{userInfo.province}}{{userInfo.city}}{{userInfo.district}}{{userInfo.detailedAddress}}</span>
    </div>
    <div class="product-info-content">
      <span>行驶证：</span>
      <img :src="userInfo.carUrl" alt class="carUrl" />
    </div>
    <!-- <div style="text-align:center;">
      <el-button style="margin-top:20px;" @click="ensure" type="primary">提交</el-button>
    </div>-->
    <div class="address">
      <div id="myMap"></div>
      <div class="storeList">
        <h4 style="text-align:center">门店列表</h4>
        <div class="storeInfo" v-for="item in storeList" :key="item.id" @click="selectStore(item)">
          <div class="info-row">
            <span>{{item.stationName}}</span>
            <span>距离{{item.distance}}m</span>
          </div>
          <span>{{item.stationLocation}}</span>
          <div class="info-row">
            <span>{{item.contactWay}}</span>
            <span>待完成{{item.unfinished}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var geocoder,
  map,
  marker = null;
import http from "http/orderManageApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      userInfo: {},
      orderInfo: {},
      lat: ``,
      lng: ``,
      storeList: [],
      stationId: `` //门店标识
    };
  },
  activated() {
    this.userInfo = JSON.parse(this.$route.query.userInfo);
    this.orderInfo = JSON.parse(this.$route.query.orderInfo);
    this.mapTX();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    mapTX() {
      let that = this;
      //   var geocoder,
      //     map,
      //     marker = null;
      geocoder = new qq.maps.Geocoder();
      let address =
        this.userInfo.province +
        "," +
        this.userInfo.city +
        "," +
        this.userInfo.district +
        "," +
        this.userInfo.detailedAddress;
      geocoder.getLocation(address);
      var geolocation = new qq.maps.Geolocation(
        "BODBZ-Y6DC2-74NUO-CJJL6-VZ2N6-7MF6F",
        "myMap"
      );
      geocoder.setComplete(function(result) {
        console.log(result);
        // this.lat = result.detail.location.lat;
        // this.lng = result.detail.location.lng;
        map = new qq.maps.Map(document.getElementById("myMap"), {
          center: new qq.maps.LatLng(
            result.detail.location.lat,
            result.detail.location.lng
          ),
          zoom: 13
        });
        var myLatlng = new qq.maps.LatLng(
          result.detail.location.lat,
          result.detail.location.lng
        );
        // var marker = new qq.maps.Label({
        //   position: myLatlng,
        //   map: map,
        //   content: "用户当前位置"
        // });
        // var marker = new qq.maps.Marker({
        //   position: myLatlng,
        //   map: map
        // });
        that.getMarker(result.detail.location.lat, result.detail.location.lng);
        qq.maps.event.addListener(map, "dragend", function() {
          console.log("地图中心为：" + map.getCenter());
          let latlngObj = map.getCenter();
          console.log(latlngObj);
          that.getMarker(latlngObj.lat, latlngObj.lng);
        });
        // that.drowMap();
      }); //若服务请求失败，则运行以下函数
      geocoder.setError(function() {
        alert("获取地址失败");
      });
      console.log(geolocation);
    },
    getMarker(lat, lng) {
      let params = { access_token: this.access_token, lat, lon: lng };
      let that = this;
      // var marker = null
      http.getStoreList({ params }).then(data => {
        console.log(data.data.data);
        if (data.data.code == 0) {
          this.storeList = data.data.data;
          data.data.data.forEach(item => {
            var info = new qq.maps.InfoWindow({
              map: map,
              visible: true,
              zIndex: 99
            }); //添加提示窗
            var marker = new qq.maps.Marker({
              position: new qq.maps.LatLng(item.stationLat, item.stationLon),
              map: map,
              animation: qq.maps.MarkerAnimation.DOWN,
              title: item.stationName
              //   icon: new qq.maps.MarkerImage(
              //     "https://open.map.qq.com/doc/img/nilt.png"
              //   )
            });
            marker.stationId = item.stationId;
            marker.stationName = item.stationName;
            qq.maps.event.addListener(marker, "click", function() {
              //获取标记的点击事件
              console.log(this);
              console.log(`aaaa`);
              info.open(); //点击标记打开提示窗
              info.setContent(
                '<div class="mapInfo"><p class="center">' +
                  this.title +
                  "</p></div>"
              ); //***设置提示窗内容（这里用到了marker对象中保存的数据）
              info.setPosition(
                new qq.maps.LatLng(this.position.lat, this.position.lng)
              ); //提示窗位置
              that.selectStore(this)
              that.clearOverlays(marker)
            });
          });
        }
      });
    },
    selectStore(item) {
      console.log(item);
      this.$confirm(`将指派${item.stationName}给用户, 是否继续?`, "提示", {
        confirmButtonText: "是",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.stationId = item.stationId;
          this.ensure();
        })
        .catch(() => {
          console.log(`已取消`);
        });
    },
    ensure() {
      let { userInfo, orderInfo, stationId } = this;
      let access_token = this.access_token;
      let that = this;
      let params = {
        userId: orderInfo.memberId,
        userName: userInfo.name,
        userPhone: userInfo.mobile,
        orderNo: orderInfo.orderNo,
        stationId,
        goodModel: orderInfo.goods[0].goodsModel,
        goodName: orderInfo.goods[0].goodsName,
        driverLicense: userInfo.carUrl
      };
      http
        .assignStore(params, access_token)
        .then(data => {
          console.log(data.data);
          if (data.data.code == 0) {
            that.$message(data.data.desc);
            that.$router.push({
              name: `orderManage`
            });
          }
        })
        .catch(e => {
          this.$message(`指派失败`);
        });
    },
    //清除地图上的marker
    clearOverlays(overlays) {
      var overlay;
      while ((overlay = overlays.pop())) {
        overlay.setMap(null);
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.product-info-content {
  line-height: 36px;
  display: flex;
  align-items: center;
}

.carUrl {
  width: 300px;
  height: 200px;
}

.product-info-content>span {
  display: block;
  margin-right: 14px;
}

.product-info-content>span:nth-child(1) {
  min-width: 120px;
}

#myMap {
  min-width: 70%;
  min-height: 767px;
  width: 50%;
}

.address {
  display: flex;
  background: #ededed;
  margin-top: 20px;
}

.storeList {
  margin: 0 12px;
  flex: 1;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.storeInfo {
  margin: 12px 0;
  background: #fff;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
}

.storeInfo>div {
  padding: 6px 0;
}
</style>
