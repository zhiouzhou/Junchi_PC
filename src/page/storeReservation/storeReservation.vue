<template>
  <div id="storeReservation">
    <el-form
      :inline="true"
      :model="reservationForm"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="reservationForm"
    >
      <el-form-item label="门店">
        <el-select v-model="reservationForm.stationIds" clearable multiple>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in storeOptions"
            :key="item.stationId"
            :label="item.stationName"
            :value="item.stationId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input v-model="orderNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="预约订单状态">
        <el-select v-model="reservationForm.statuss" clearable multiple>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检索时间">
        <el-date-picker
          v-model="timeArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectTime"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getStoreServationList" size="medium">查询</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="storeServationList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bookTime" label="预约时间"></el-table-column>
      <el-table-column label="预约状态">
        <template slot-scope="scope">
          <span>{{scope.row.bookStatus==0?'待确认':scope.row.bookStatus==1?'已确认':scope.row.bookStatus==2?'门店未接单，请重新预约或更换门店':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="行驶证">
        <template slot-scope="scope">
          <img :src="scope.row.driverLicense" alt class="driverImg">
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="goodModel" label="商品型号"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="stationName" label="门店名称"></el-table-column>
      <el-table-column prop="stationId" label="门店标识"></el-table-column>
      <el-table-column prop="userName" label="用户名称"></el-table-column>
      <el-table-column prop="userPhone" label="联系电话"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="reservationForm.size"
      :current-page="reservationForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/personnelApi";

export default {
  data() {
    return {
      reservationForm: {
        stationIds: [],
        orderNos: [],
        statuss: [],
        page: 1,
        size: 10,
        access_token: ``,
        startTime: ``,
        endTime: ``
      },
      orderNo: ``,
      timeArr: [],
      total: 0,
      storeServationList: [],
      storeOptions: [],
      statusOption: [
        { value: 0, label: `待门店确认` },
        { value: 1, label: `门店已确认` },
        { value: 2, label: `门店未确认超时` }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.reservationForm.access_token = this.access_token;
    this.getStoreList();
    this.getStoreServationList();
  },
  methods: {
    selectTime(arr) {
      console.log(arr);
      if (arr == null) {
        this.timeArr = [];
        this.reservationForm.startTime = ``;
        this.reservationForm.endTime = ``;
      } else {
        this.reservationForm.startTime = arr[0];
        this.reservationForm.endTime = arr[1];
      }
    },
    clear() {
      console.log(`aaa`);
    },
    //获取下拉门店列表
    getStoreList() {
      console.log();
      let params = { page: 1, size: 0, access_token: this.access_token };
      http.storeList({ params }).then(data => {
        console.log(data);
        this.storeOptions = data.data.data;
      });
    },
    //获取门店预约列表
    getStoreServationList() {
      let params = {
        stationIds: this.reservationForm.stationIds,
        orderNos: this.reservationForm.orderNos,
        statuss: this.reservationForm.statuss,
        startTime: this.reservationForm.startTime,
        endTime: this.reservationForm.endTime
      };
      params.orderNos = !this.orderNo ? [] : [this.orderNo];
      let value = {
        page: this.reservationForm.page,
        size: this.reservationForm.size,
        access_token: this.access_token
      };
      http.getStoreServationList(params, value).then(data => {
        console.log(data.data.data);
        if (data.data.code == 0) {
          this.storeServationList = data.data.data;
          this.total = data.data.total;
        }
      });
    },
    indexMethods(index) {
      return (
        (this.reservationForm.page - 1) * this.reservationForm.size + index + 1
      );
    },
    handlePageNumChange(num) {
      this.reservationForm.page = num;
      this.getStoreServationList();
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