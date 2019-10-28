<template>
  <div id="scoreDetail">
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
          <span style="color:#e00000">{{scope.row.bookStatus==0?'待确认':scope.row.bookStatus==1?'已确认':scope.row.bookStatus==2?'门店未接单，请重新预约或更换门店':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="行驶证">
        <template slot-scope="scope">
          <img :src="scope.row.driverLicense" alt class="driverImg" />
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="goodModel" label="商品型号"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="stationName" label="门店名称"></el-table-column>
      <el-table-column prop="stationId" label="门店标识"></el-table-column>
      <el-table-column prop="userName" label="用户名称"></el-table-column>
      <el-table-column prop="userPhone" label="联系电话"></el-table-column>
      <el-table-column  label="扣分">
          <template>
              <span style="color:#e00000">
                  -5
              </span>
          </template>
      </el-table-column>
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
      storeServationList: [],
      reservationForm: {
        stationIds: [],
        statuss: [2],
        page: 1,
        size: 10,
        access_token: ``
      },
      total: 0
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.reservationForm.access_token = this.access_token;
    this.reservationForm.stationIds = [this.$route.query.stationIds];
    // this.getStoreList();
    this.getStoreServationList();
  },
  methods: {
    //获取门店预约列表
    getStoreServationList() {
      let params = {
        stationIds: this.reservationForm.stationIds,
        statuss: this.reservationForm.statuss
      };
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