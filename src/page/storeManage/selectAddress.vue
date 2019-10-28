<template>
  <div>
    <el-form
      class="content"
      :model="addressInfo"
      label-width="120px"
      label-suffix="："
      size="medium"
    >
      <el-form-item label="地址">
        <el-input v-model.trim="addressInfo.address" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model.trim="addressInfo.lng" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model.trim="addressInfo.lat" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="城市">
        <div style="display:flex;align-items:center">
          <el-input v-model.trim="region" placeholder="请输入查找的城市" style="width:20%"></el-input>
          <el-input v-model.trim="keyWord" placeholder="请输入关键词" style="width:20%;margin-left:20px"></el-input>
          <el-button style="margin-left:20px;" @click="searchKeyword" class="searchBtn">搜索</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-button
      style="margin-left:40px;margin-bottom:20px;"
      @click="ensure"
      type="primary"
      class="searchBtn"
    >确认选择</el-button>

    <div id="myMap"></div>
  </div>
</template>
<script>
import http from "http/qqMap";
// var searchService = function() {};
//   markers = [];
export default {
  data() {
    return {
      addressInfo: {
        address: ``,
        lat: ``,
        lng: ``
      },
      searchService: [],
      marker: [],
      lat: ``,
      lng: ``,
      keyWord: ``,
      region: ``,
      pageType: ``
    };
  },
  activated() {
    this.mapTX();
    this.pageType = this.$route.query.pageType;
    // this.searchAddress();
    // this.searchKeyword();
  },
  methods: {
    mapTX() {
      var geolocation = new qq.maps.Geolocation(
        "BODBZ-Y6DC2-74NUO-CJJL6-VZ2N6-7MF6F",
        "myApp"
      );
      var options = { timeout: 1000 };
      geolocation.getLocation(this.showPosition, this.showErr, options);
    },
    showPosition(position) {
      console.log(position);
      this.lat = position.lat;
      this.lng = position.lng;
      let that = this;
      //   this.$nextTick(() => {
      that.getPositionAddress();
      //   });
    },
    showErr() {
      // console.log(e)
      console.log(`asdsfsfsd`);
      this.lat = 39.908823;
      this.lng = 116.39747;
      this.getPositionAddress();
    },
    getPositionAddress() {
      let that = this;
      var map = new qq.maps.Map(document.getElementById("myMap"), {
        //这里经纬度代理表进入地图显示的中心区域
        center: new qq.maps.LatLng(this.lat, this.lng),
        zoom: 13
      });
      //绑定单击事件添加参数
      var listener = qq.maps.event.addListener(map, "click", function(event) {
        console.log(event);
        let lat = event.latLng.getLat();
        let lng = event.latLng.getLng();
        let data = {
          location: lat + "," + lng,
          key: `BODBZ-Y6DC2-74NUO-CJJL6-VZ2N6-7MF6F`,
          get_poi: 0
        };
        data.output = "jsonp";
        $.ajax({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?`,
          type: "get",
          dataType: "jsonp",
          data: data,
          jsonp: "callback",
          jsonpCallback: "QQmap",
          success: function(json) {
            console.log(json.result);
            that.addressInfo.address = json.result.address;
            that.addressInfo.lat = json.result.location.lat;
            that.addressInfo.lng = json.result.location.lng;
          }
        });
      });
      window.removeEvent = function() {
        qq.maps.event.removeListener(listener);
      };
    },
    // 搜索地址
    searchAddress(keyword, region) {
      if (!this.region) {
        this.$message(`请输入城市`);
        return;
      }
      if (!this.keyWord) {
        this.$message(`请输入搜索的关键字`);
        return;
      }

      let that = this;
      var map = new qq.maps.Map(document.getElementById("myMap"), {
        center: new qq.maps.LatLng(that.lat, that.lng),
        zoom: 13
      });
      var markers = [];
      var latlngBounds = new qq.maps.LatLngBounds();
      var searchService = new qq.maps.SearchService({
        // location: `全国`,
        // location: "全国",
        // autoExtend: true,
        // pageIndex: 1,
        // //设置每页的结果数为5
        // pageCapacity: 5,
        complete: function(res) {
          console.log(res);
          var pois = res.detail.pois;
          console.log(pois);
          var infoWin = new qq.maps.InfoWindow({
            map: map
          });
          for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i];
            //扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng);
            console.log(that.clearOverlays);
            var marker = new qq.maps.Marker({
              map: map,
              position: poi.latLng
            });
            markers.push(marker);
            marker.setTitle(i + 1);
            // markers.push(marker);
            map.fitBounds(latlngBounds);
            marker.libraryName = pois[i].name;
            qq.maps.event.addListener(marker, "click", function(event) {
              console.log(event);
              infoWin.open();
              infoWin.setContent(
                '<div style="text-align:center;white-space:' +
                  'nowrap;margin:10px;"> ' +
                  this.libraryName +
                  " </div>"
              );
              // console.log(`lat`,pois[i].latLng.lat)
              //提示窗位置
              infoWin.setPosition(
                new qq.maps.LatLng(event.latLng.lat, event.latLng.lng)
              );
              console.log(event);
              let lat = event.latLng.lat;
              let lng = event.latLng.lng;
              // console.log(lat,lng)
              let data = {
                location: lat + "," + lng,
                key: `BODBZ-Y6DC2-74NUO-CJJL6-VZ2N6-7MF6F`,
                get_poi: 0
              };
              data.output = "jsonp";
              $.ajax({
                url: `https://apis.map.qq.com/ws/geocoder/v1/?`,
                type: "get",
                dataType: "jsonp",
                data: data,
                jsonp: "callback",
                jsonpCallback: "QQmap",
                success: function(json) {
                  console.log(json.result);
                  that.addressInfo.address = json.result.address;
                  that.addressInfo.lat = json.result.location.lat;
                  that.addressInfo.lng = json.result.location.lng;
                }
              });
            });
          }
        },
        error: function() {
          alert("出错了。");
        }
      });
      that.clearOverlays(markers);
      searchService.setLocation(region);
      searchService.search(keyword);
    },
    // 根据关键字搜索范围
    searchKeyword() {
      let keyword = this.keyWord;
      let region = this.region;
      this.searchAddress(keyword, region);
    },
    //清除地图上的marker
    clearOverlays(overlays) {
      var overlay;
      while ((overlay = overlays.pop())) {
        overlay.setMap(null);
      }
    },
    // 返回上一页
    ensure() {
      let addressInfo = this.addressInfo;
      if (!addressInfo.address || !addressInfo.lat || !addressInfo.lng) {
        this.$message(`请选择经纬度`);
        return;
      }
      this.$router.push({
        name: `addStore`,
        query: {
          addressInfo: JSON.stringify(addressInfo),
          pageType: this.pageType
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
#myMap {
  min-width: 800px;
  min-height: 767px;
  width: 50%;
}

.el-input {
  width: 50%;
}
</style>
