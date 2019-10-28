<template>
  <div id="tree">
    <div id="myCharts" :style="{width:'1000px',height:widowHeight}"></div>
  </div>
</template>
<script>
import http from "http/trendApi";
import personnelPic from "../../assets/images/ic-touxiang@2x.png";
import { mapState } from "vuex";
export default {
  data() {
    return {
      memberId: ``,
      transmissionArr: [],
      personnelPic,
      roamStatus: false,
      widowHeight: ""
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    // this.initCharts();
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    let memberId = this.$route.query.memberId;
    console.log(memberId);
    this.memberId = memberId;
    this.getUserChain();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      this.widowHeight = window.innerHeight - 60 + "px";
    },
    getUserChain() {
      let params = { access_token: this.access_token, memberId: this.memberId };
      let transmissionArr = [];
      let children = [];
      let that = this;
      http.getUserChain({ params }).then(data => {
        console.log(data.data.data);
        let superior = data.data.data.superior;
        if (superior) {
          let firstObj = {
            name: "会员号：" + superior.memberId,
            symbol: superior.headPic
              ? "image://" + superior.headPic
              : "image://" + that.personnelPic
          };
          let userObj = {
            name: "(当前用户)"+"会员号：" + data.data.data.memberId,
            symbol: data.data.data.headPic
              ? "image://" + data.data.data.headPic
              : "image://" + that.personnelPic
          };
          let secondChildren = [];
          let superiorObj = {}; //下级
          let thirdChildren = [];
          let thirdObj = {};
          if (
            data.data.data.subordinates &&
            data.data.data.subordinates.length != 0
          ) {
            data.data.data.subordinates.forEach(item => {
              if (item.subordinates && item.subordinates.length != 0) {
                item.subordinates.forEach(items => {
                  thirdChildren.push({
                    name: "会员号：" + items.memberId,
                    symbol: items.headPic
                      ? "image://" + items.headPic
                      : "image://" + that.personnelPic
                  });
                });
                secondChildren.push({
                  name: "会员号：" + item.memberId,
                  symbol: item.headPic
                    ? "image://" + item.headPic
                    : "image://" + that.personnelPic,
                  children: thirdChildren
                });
              } else {
                secondChildren.push(
                  {
                    name: "会员号：" + item.memberId,
                    symbol: item.headPic
                      ? "image://" + item.headPic
                      : "image://" + that.personnelPic
                  }
                );
              }
            });
            // secondChildren.push(superiorObj);
            userObj.children = secondChildren;
          }
          let children = [];
          children.push(userObj);
          firstObj.children = children;
          transmissionArr.push(firstObj);

          console.log(transmissionArr);
          this.transmissionArr = transmissionArr;
        } else {
          let userObj = {
            name: "(当前用户)"+"会员号：" + data.data.data.memberId,
            symbol: data.data.data.headPic
              ? "image://" + data.data.data.headPic
              : "image://" + that.personnelPic
          };
          let secondChildren = [];
          let superiorObj = {}; //下级
          let thirdChildren = [];
          let thirdObj = {};
          if (
            data.data.data.subordinates &&
            data.data.data.subordinates.length != 0
          ) {
            data.data.data.subordinates.forEach(item => {
              if (item.subordinates && item.subordinates.length != 0) {
                item.subordinates.forEach(items => {
                  thirdChildren.push({
                    name: "会员号：" + items.memberId,
                    symbol: items.headPic
                      ? "image://" + items.headPic
                      : "image://" + that.personnelPic
                  });
                });
                secondChildren.push({
                  name: "会员号：" + item.memberId,
                  symbol: item.headPic
                    ? "image://" + item.headPic
                    : "image://" + that.personnelPic,
                  children: thirdChildren
                });
              } else {
                secondChildren.push({
                  name: "会员号：" + item.memberId,
                  symbol: item.headPic
                    ? "image://" + item.headPic
                    : "image://" + that.personnelPic
                });
              }

              // superiorObj.children = thirdChildren;
            });
            userObj.children = secondChildren;
          }
          transmissionArr.push(userObj);
          console.log(transmissionArr);
          this.transmissionArr = transmissionArr;
        }
        this.initCharts();
      });
    },
    initCharts() {
      let myCharts = this.$echarts.init(document.getElementById("myCharts"));
      let locatin = { x: "center", y: "center" };
      window.addEventListener("resize", () => {
        myCharts.resize();
      });
      let that = this;
      myCharts.clear();
      myCharts.setOption({
        title: {
          text: "上下级关系",
          subtext: "关系展示图"
        },
        tooltip: {
          //提示框，鼠标悬浮交互时的信息提示
          trigger: "item",
          formatter: "{b}"
        },
        toolbox: {
          //工具箱，每个图表最多仅有一个工具箱
          show: true,
          feature: {
            // mark: { show: true },
            dataView: { show: false, readOnly: false },
            restore: { show: true },
          }
        },
        series: [
          {
            name: "树图",
            type: "tree",
            initialTreeDepth: 4,
            rootLocation: locatin,
            layerPadding: 30, //连接线长度
            nodePadding: 8, //节点间距
            orient: "vertical",
            symbol: "circle",
            roam: !this.roamStatus,
            symbolSize: [40, 40],
            itemStyle: {
              normal: {
                color: "#CF6AD5",
                label: {
                  show: true,
                  position: "bottom",
                  textStyle: {
                    color: "#000",
                    fontSize: 12
                  }
                },
                lineStyle: {
                  color: "#aaa",
                  width: 1,
                  type: "solid" // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                }
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            data: this.transmissionArr
          }
        ]
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>