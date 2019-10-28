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
      <el-form-item label="安装任务标识">
        <el-input v-model="taskInfo.installTask" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户会员号">
        <el-input v-model="taskInfo.userId" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="技术员标识">
        <el-input v-model="taskInfo.techId" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="taskInfo.orderNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-button type="primary" @click="getTaskList" size="medium">查询</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="taskList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskId" label="任务标识"></el-table-column>
      <el-table-column prop="installTask" label="安装任务标识"></el-table-column>
      <el-table-column prop="stationId" label="安装店标识"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="goodModel" label="产品型号"></el-table-column>
      <el-table-column prop="goodName" label="产品名称"></el-table-column>
      <el-table-column prop="userId" label="用户标识"></el-table-column>
      <el-table-column prop="userName" label="用户名称"></el-table-column>
      <el-table-column prop="userPhone" label="联系方式"></el-table-column>
      <el-table-column prop="techId" label="技术员Id"></el-table-column>
      <el-table-column prop="techName" label="指派技术员名"></el-table-column>
      <el-table-column label="驾驶证图片">
        <template slot-scope="scope">
          <img :src="scope.row.driverLicense" class="driverImg" alt>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="任务创建时间"></el-table-column>
      <el-table-column prop="completeTime" label="安装完成时间"></el-table-column>
      <el-table-column label="安装图片">
        <template slot-scope="scope">
          <img
            v-for="(item,index) in scope.row.installPictures"
            class="driverImg"
            :key="index"
            :src="item"
            alt
          >
        </template>
      </el-table-column>
      <el-table-column prop="bookTime" label="维修时间"></el-table-column>
      <el-table-column label="维修图片">
        <template slot-scope="scope">
          <img
            v-for="(item,index) in scope.row.maintenPictures"
            class="driverImg"
            :key="index"
            :src="item"
            alt
          >
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">
          <span>{{scope.row.taskStatus==0?'待指派':scope.row.taskStatus==1?'指派':scope.row.taskStatus==2?'完成':''}}</span>
        </template>
      </el-table-column>
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
        stationId: null,
        page: 1,
        size: 10,
        taskStatus: null, //任务状态，0-待指派，1-指派，2-完成
        installTask: null, //安装任务标识
        userId: null, //用户标识标识
        techId: null, //技术员标识
        orderNo: null, //	订单标识
        cooperStatus: null, //是独立，还是协作，0-独立，>0-协作
        access_token: ``
      },
      taskList: [],
      total: 0,
      storeOptions: [],
      isGrabOptions: [{ value: "0", label: `否` }, { value: "1", label: `是` }],
      statusOptions: [
        { value: "0", label: "待指派" },
        { value: "1", label: "指派" },
        { value: "2", label: "完成" }
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
        size: taskInfo.size,
        isStation: `1`
      };
      let params = {
        stationId: taskInfo.stationId,
        installTask: taskInfo.installTask,
        taskStatus: taskInfo.taskStatus,
        userId: taskInfo.userId,
        techId: taskInfo.techId,
        orderNo: taskInfo.tecorderNohId
      };
      http.getRepairTask(params, value).then(data => {
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

