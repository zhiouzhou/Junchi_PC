<template>
  <div class="main" style="height:400px">
    <el-form
      :inline="true"
      :model="saleForm"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="saleForm"
    >
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="productTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectSaleTime"
          :picker-options="pickerOptions1"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:20px;">
        <el-button type="primary" @click="getSaleList()" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="saleEcharts" style="height:400px;width:800px"></div>
    <!-- 交易趋势 -->
    <el-form
      :inline="true"
      :model="trendForm"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="trendForm"
    >
      <el-form-item label="时间间隔">
        <el-select v-model="trendForm.interval" placeholder="请选择">
          <el-option
            v-for="item in intervalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectTime"
          :picker-options="pickerOptions2"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:20px;">
        <el-button type="primary" @click="getTrend()" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:30px;">
      <div id="dealEcharts" style="height:400px;width:48%;margin-right:40px;"></div>
      <div id="dealEcharts1" style="height:400px;width:48%;"></div>
    </div>
    <!-- 用户角色比例统计 -->
    <el-form
      :inline="true"
      :model="roleForm"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="roleForm"
    >
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="time2"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectUserTime"
          :picker-options="pickerOptions1"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:20px;">
        <el-button type="primary" @click="getRoleList()" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="roleEcharts" style="height:400px;width:800px"></div>
    <!-- 用户增长量统计 -->
    <el-form
      :inline="true"
      :model="growthForm"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="growthForm"
    >
      <el-form-item label="时间间隔">
        <el-select v-model="growthForm.interval" placeholder="请选择">
          <el-option
            v-for="item in intervalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="growthTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectGrowthTime"
          :picker-options="pickerOptions3"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:20px;">
        <el-button type="primary" @click="getGrowthList()" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="growthEcharts" style="height:400px;width:800px"></div>
  </div>
</template>
<script>
import http from "http/trendApi";
import { mapState } from "vuex";
var end = new Date();
var start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
start = getTime(start) + "00:00:00";
end = getTime(end) + "23:59:59";
console.log(start, end);
function getTime(time) {
  var date = new Date(time);
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";

  let newTime = Y + M + D;
  return newTime;
}
export default {
  name: "tradingTrend",
  data() {
    return {
      trendForm: {
        access_token: ``,
        startTime: start,
        endTime: end,
        interval: `1d`
      },
      saleForm: {
        access_token: ``,
        startTime: start,
        endTime: end
      },
      roleForm: {
        access_token: ``,
        startTime: ``,
        endTime: ``
      },
      growthForm: {
        interval: `1d`,
        access_token: ``,
        startTime: start,
        endTime: end
      },
      xAxis: [],
      series: [],
      growthSeries:[],
      legendData: [],
      seriesData: [],
      productTime: [start, end],
      time2: [],
      growthTime:[start, end],
      time: [start, end],
      pickerOptions1: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions3: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      intervalOptions: [
        {
          value: `1d`,
          label: `天`
        },
        {
          value: `1w`,
          label: `周`
        },
        {
          value: `1M`,
          label: `月`
        },
        {
          value: `1q`,
          label: `季度`
        },
        {
          value: `1y`,
          label: `年`
        }
      ]
    };
  },
  activated() {
    this.trendForm.access_token = this.access_token;
    this.saleForm.access_token = this.access_token;
    this.roleForm.access_token = this.access_token;
    this.growthForm.access_token = this.access_token
    this.getTrend();
    this.getSaleList();
    this.getRoleList();
    this.getGrowthList();
    // this.drawLine();
  },
  methods: {
    selectSaleTime(time) {
      this.saleForm.startTime = time[0] + " 00:00:00";
      this.saleForm.endTime = time[1] + " 23:59:59";
    },
    selectTime(time) {
      // console.log(time)
      this.trendForm.startTime = time[0] + " 00:00:00";
      this.trendForm.endTime = time[1] + " 23:59:59";
    },
    selectUserTime(time) {
      this.roleForm.startTime = time[0] + " 00:00:00";
      this.roleForm.endTime = time[1] + " 00:00:00";
    },
    selectGrowthTime(time) {
      console.log(time)
      this.growthForm.startTime = time[0] + " 00:00:00";
      this.growthForm.endTime = time[1] + " 00:00:00";
    },
    getTrend() {
      let params = this.trendForm;
      let that = this;
      let seriesName = [];
      http.getTrendList({ params }).then(data => {
        console.log(data);
        if (data.data.code == 0) {
          that.xAxis = data.data.data.x;
          data.data.data.series.forEach(item => {
            item.type = "line";
            seriesName.push(item.name);
          });
          that.series = data.data.data.series;
          that.seriesName = seriesName;
          this.drawLine();
          this.drawLine1();
        } else {
          this.$message(`获取失败，请稍后再试~`);
        }
      });
    },
    getSaleList() {
      let params = this.saleForm;
      let that = this;
      let legendData = [];
      http.getSaleList({ params }).then(data => {
        console.log(data);
        if (data.data.code == 0) {
          data.data.data.data.forEach(item => {
            item.type = "pie";
            legendData.push(item.name);
          });
          this.legendData = legendData;
          that.seriesData = data.data.data.data;
          this.drawCircle();
        } else {
          this.$message(`获取失败，请稍后再试~`);
        }
      });
    },
    getRoleList() {
      let params = this.roleForm;
      let that = this;
      let legendData = [];
      http.getUserRole({ params }).then(data => {
        console.log(data);
        if (data.data.code == 0) {
          data.data.data.data.forEach(item => {
            item.type = "pie";
            legendData.push(item.name);
          });
          this.legendData = legendData;
          that.seriesData = data.data.data.data;
          this.roleDrawPie();
        } else {
          this.$message(`获取失败，请稍后再试~`);
        }
      });
    },
    getGrowthList() {
      let params = this.growthForm;
      let that = this;
      let seriesName = [];
      http.getGrowth({ params }).then(data => {
        console.log(data);
        if (data.data.code == 0) {
          that.xAxis = data.data.data.x;
          data.data.data.series.forEach(item => {
            item.type = "line";
            seriesName.push(item.name);
          });
          that.growthSeries = data.data.data.series;
          that.growthSeriesName = seriesName;
          that.growthDraw();
        } else {
          this.$message(`获取失败，请稍后再试~`);
        }
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("dealEcharts"));
      let that = this;
      myChart.setOption({
        title: { text: `订单数量` },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          orient: "horizontal", // 'vertical'
          x: "center", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number},
          data: that.seriesName
        },
        toolbox: {
          show: true,
          borderColor: "#eaeaea",
          borderWidth: 0,
          padding: 10,
          itemGap: 12,
          color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              title: {
                line: "类型切换-折线图",
                bar: "类型切换-柱形图"
              },
              type: ["line", "bar"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid:{
          borderColor:'red'
        },
        xAxis: [
          {
            type: "category",
            show: true,
            data: that.xAxis
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            splitLine: {
              lineStyle: {
                color: ["#ccc"],
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: "#ccc"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: that.series[0]
      });
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("dealEcharts1"));
      let that = this;
      myChart.setOption({
        title: { text: `交易额` },
        tooltip: {
          trigger: "axis"
        },
        color: ["#87cefa"],
        legend: {
          orient: "horizontal", // 'vertical'
          x: "center", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number},
          data: that.seriesName
        },
        toolbox: {
          show: true,
          borderColor: "#eaeaea",
          borderWidth: 0,
          padding: 10,
          itemGap: 12,
          color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              title: {
                line: "类型切换-折线图",
                bar: "类型切换-柱形图"
              },
              type: ["line", "bar"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            show: true,
            data: that.xAxis
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            splitLine: {
              lineStyle: {
                color: ["#ccc"],
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: "#ccc"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: that.series[1]
      });
    },
    drawCircle() {
      let myChart = this.$echarts.init(document.getElementById("saleEcharts"));
      let that = this;
      myChart.setOption({
        color: [
          "#30e0e0",
          "#ff69b4",
          "#ba55d3",
          "#cd5c5c",
          "#ffa500",
          "#40e0d0",
          "#1e90ff"
        ],
        title: {
          text: "商品型号销售统计",
          x: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendData
          // selected: data.selected
        },
        series: [
          {
            name: "商品型号",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: this.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    roleDrawPie() {
      let myChart = this.$echarts.init(document.getElementById("roleEcharts"));
      let that = this;
      myChart.setOption({
        color: [
          "#30e0e0",
          "#ff69b4",
          "#ba55d3",
          "#cd5c5c",
          "#ffa500",
          "#40e0d0",
          "#1e90ff"
        ],
        title: {
          text: "用户角色比例统计",
          x: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendData
          // selected: data.selected
        },
        series: [
          {
            name: "用户角色",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: this.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    growthDraw(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("growthEcharts"));
      let that = this;
      myChart.setOption({
        title: { text: `用户增长量统计` },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          orient: "horizontal", // 'vertical'
          x: "center", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number},
          data: that.growthSeriesName
        },
        toolbox: {
          show: true,
          borderColor: "#eaeaea",
          borderWidth: 0,
          padding: 10,
          itemGap: 12,
          color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              title: {
                line: "类型切换-折线图",
                bar: "类型切换-柱形图"
              },
              type: ["line", "bar"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            show: true,
            data: that.xAxis
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            splitLine: {
              lineStyle: {
                color: ["#ccc"],
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: "#ccc"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: that.growthSeries
      });
    },
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  }
};
</script>
<style lang="stylus" scoped>
.query-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>