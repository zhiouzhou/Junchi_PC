<template>
  <div>
    <el-form
      :inline="true"
      :model="leaveInfo"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="leaveInfo"
    >
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
      <el-button type="primary" @click="getTechleaveList" size="medium">查询</el-button>
    </el-form>
    <el-table :data="leaveList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="申请人"></el-table-column>
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column label="审核类型">
        <template slot-scope="scope">
          <span>{{scope.row.authType===4?'技术人员请假':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.authStatus===0?'待审核':scope.row.authStatus===1?'审核中':scope.row.authStatus===2?'撤销申请':scope.row.authStatus===3?'未批准':scope.row.authStatus===4?'批准':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否已审批">
        <template slot-scope="scope">
          <span>{{scope.row.curStatus===0?'待审批':scope.row.curStatus===1?'审批完成':''}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="gotoAudit(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.curStatus==0"
          >去审核</el-button>
          <!-- <el-button @click="handleClick(scope.row,'checked')" type="text" size="small">详情</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="leaveInfo.size"
      :current-page="leaveInfo.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/approvalManageApi";
export default {
  name: "storeAudit",
  data() {
    return {
      leaveInfo: {
        page: 1,
        size: 8,
        authTypes: [4],
        // authStatus:0
        access_token: ``
      },
      leaveList: [],
      total: 0,
      timeArr:[],
    };
  },
  activated() {
    this.leaveInfo.access_token = this.access_token;
    this.getTechleaveList();
  },
  methods: {
    selectTime(arr) {
      console.log(arr);
      if (arr == null) {
        this.timeArr = [];
        this.leaveInfo.startTime = ``;
        this.leaveInfo.endTime = ``;
      } else {
        this.leaveInfo.startTime = arr[0];
        this.leaveInfo.endTime = arr[1];
      }
    },
    getTechleaveList() {
      // let params = this.leaveInfo;
      let params = { authTypes: this.leaveInfo.authTypes,startTime:this.leaveInfo.startTime,endTime:this.leaveInfo.endTime };
      let value = {
        access_token: this.access_token,
        page: this.leaveInfo.page,
        size: this.leaveInfo.size
      };
      let that = this;
      http.getApplyList(params, value).then(data => {
        console.log(data.data.desc);
        if (data.data.code == 0) {
          this.leaveList = data.data.data;
          this.total = data.data.total;
        } else {
          that.$message(data.data.desc);
        }
      });
    },
    gotoAudit(row) {
      let authContent = row.authContent;
      let applyId = row.id;
      console.log(authContent);
      this.$router.push({
        name: `leaveInfo`,
        query: { authContent, applyId, pageType: "leave" }
      });
    },
    indexMethods(index) {
      return (this.leaveInfo.page - 1) * this.leaveInfo.size + index + 1;
    },
    handlePageNumChange(num) {
      this.leaveInfo.page = num;
      this.getTechleaveList();
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  }
};
</script>
<style lang="stylus" scoped>
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>    