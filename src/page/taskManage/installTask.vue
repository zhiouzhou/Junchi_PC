<template>
  <div id="installTask">
    <el-form
      :inline="true"
      :model="taskInfo"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="taskInfo"
    >
      <el-form-item label="门店">
        <el-select v-model="taskInfo.stationId" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in storeOptions"
            :key="item.stationId"
            :label="item.stationName"
            :value="item.stationId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否自抢">
        <el-select v-model="taskInfo.isGrab" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in isGrabOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="taskInfo.taskStatus" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接单类型">
        <el-select v-model="taskInfo.takeType" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="完成类型">
        <el-select v-model="taskInfo.cooperStatus" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in cooperStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getTaskList" size="medium">查询</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="taskList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58" fixed>
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bookId" label="预约标识" fixed></el-table-column>
      <el-table-column prop="taskId" label="任务标识"></el-table-column>
      <el-table-column prop="stationId" label="安装店标识"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="goodModel" label="产品型号"></el-table-column>
      <el-table-column prop="goodName" label="产品名称"></el-table-column>
      <el-table-column prop="userId" label="用户标识"></el-table-column>
      <el-table-column prop="userName" label="用户名称"></el-table-column>
      <el-table-column prop="userPhone" label="联系方式"></el-table-column>
      <el-table-column prop="grabTech" label="抢单技术员"></el-table-column>
      <el-table-column label="接单人数类型">
        <template slot-scope="scope">
          <span>{{scope.row.cooperStatus==0?'单人':scope.row.cooperStatus==1?'协作':''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="confirmedNum" label="已确认人数"></el-table-column>
      <el-table-column label="接单类型">
        <template slot-scope="scope">
          <span>{{scope.row.takeType==0?'抢单':scope.row.takeType==1?'指派':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">
          <span>{{scope.row.taskStatus==1?'门店确认接单':scope.row.taskStatus==2?'发布待抢单':scope.row.taskStatus==3?'已被抢待确认':scope.row.taskStatus==4?'被抢已确认':scope.row.taskStatus==5?'指派订单':scope.row.taskStatus==7?'已完成':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证图片">
        <template slot-scope="scope">
          <img :src="scope.row.driverLicense" class="driverImg" alt>
        </template>
      </el-table-column>
      <el-table-column prop="bookTime" label="预约安装时间"></el-table-column>
      <el-table-column prop="confirmTime" label="技术员就位时间"></el-table-column>
      <el-table-column prop="completeTime" label="安装完成时间"></el-table-column>
      <!-- <el-table-column label="安装图片">
        <template slot-scope="scope">
          <img v-for="(item,index) in scope.row.pictures" class="driverImg" :key="index" :src="item.picturePath" alt>
        </template>
      </el-table-column>-->
      <!-- <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="editPersonnel(scope.row,'checked')" type="text" size="small">编辑</el-button>
          <el-button @click="deletePersonel(scope.row,'checked')" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="taskInfo.size"
      :current-page="taskInfo.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/taskApi";
import https from "http/personnelApi";
export default {
  data() {
    return {
      taskInfo: {
        stationId: ``,
        page: 1,
        size: 6,
        isGrab: ``, //是否自抢   0-否  1-是
        taskStatus: ``, //任务状态，1-门店确认接单，2-发布待抢单，3-已被抢待确认，4-被抢已确认，5-指派订单，7-任务完成结束
        takeType: ``, //接单类型，0-抢单，1-指派
        cooperStatus: ``, //是独立，还是协作，0-独立，>0-协作
        access_token: ``
      },
      taskList: [],
      total: 0,
      storeOptions: [],
      isGrabOptions: [{ value: "0", label: `否` }, { value: "1", label: `是` }],
      statusOptions: [
        { value: "1", label: "门店确认接单" },
        { value: "2", label: "发布待抢单" },
        { value: "3", label: "已被抢，待确认" },
        { value: "4", label: "被抢已确认" },
        { value: "5", label: "指派订单" },
        { value: "7", label: "任务完成结束" }
      ],
      typeOptions: [
        { value: "0", label: "抢单" },
        { value: "1", label: "指派" }
      ],
      cooperStatusOptions: [
        { value: "0", label: "独立" },
        { value: "1", label: "协作" }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.taskInfo.access_token = this.access_token;
    this.getStoreList();
    this.getTaskList();
  },
  methods: {
    //获取下拉门店列表
    getStoreList() {
      console.log();
      let params = { page: 1, size: 0, access_token: this.access_token };
      https.storeList({ params }).then(data => {
        console.log(data);
        this.storeOptions = data.data.data;
      });
    },
    getTaskList() {
      let taskInfo = this.taskInfo;
      let value = {
        access_token: this.access_token,
        page: taskInfo.page,
        size: taskInfo.size
      };
      let params = {
        stationId: taskInfo.stationId,
        isGrab: taskInfo.isGrab,
        taskStatus: taskInfo.taskStatus,
        takeType: taskInfo.takeType,
        cooperStatus: taskInfo.cooperStatus
      };
      http.getInstallList(params, value).then(data => {
        console.log(data.data.data);
        if (data.data.code == 0) {
          this.taskList = data.data.data;
          this.total = data.data.total;
        } else {
          this.$message(data.data.desc);
        }
      });
    },
    indexMethods(index) {
      return (this.taskInfo.page - 1) * this.taskInfo.size + index + 1;
    },
    handlePageNumChange(num) {
      this.taskInfo.page = num;
      this.getTaskList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.driverImg {
  width: 100%;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

