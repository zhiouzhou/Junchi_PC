<template>
  <div id="storeManage">
    <el-form
      :inline="true"
      :model="storeInfo"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="storeInfo"
    >
      <el-form-item label="安装店名称">
        <el-input v-model="storeInfo.stationName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="安装点位置">
                <el-input v-model="storeInfo.stationLocation" placeholder="请输入" clearable></el-input>
      </el-form-item>-->
      <el-form-item label="店主身份证号">
        <el-input v-model="storeInfo.cardId" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="合同编号">
        <el-input v-model="storeInfo.contractNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getStoreList" size="medium">查询</el-button>
      <!-- <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button> -->
    </div>
    <el-button size="medium" style="margin-top:14px;" type="primary" @click="addStore">新增门店</el-button>
    <!-- 表格 -->
    <el-table :data="storeList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="72">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stationName" label="安装店名称"></el-table-column>
      <el-table-column prop="stationLocation" label="安装店地址"></el-table-column>
      <el-table-column prop="stationLon" label="安装店经度"></el-table-column>
      <el-table-column prop="stationLat" label="安装店纬度"></el-table-column>
      <el-table-column prop="hostName" label="店主名称"></el-table-column>
      <el-table-column prop="contactWay" label="店主联系方式"></el-table-column>
      <el-table-column prop="cardId" label="店主身份证号"></el-table-column>
      <el-table-column prop="contractNo" label="证书编号"></el-table-column>
      <el-table-column prop="startTime" label="开始营业时间"></el-table-column>
      <el-table-column prop="endTime" label="结束营业时间"></el-table-column>
      <el-table-column label="信誉分">
        <template slot-scope="scope">
          <span style="display:block;">{{scope.row.creditScore}}</span>
          <el-button @click="scoreDetail(scope.row,'checked')" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="editStore(scope.row,'checked')" type="text" size="small">编辑</el-button>
          <el-button @click="deleteStore(scope.row,'checked')" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <pagination :page-size="storeInfo.size" :current-page="storeInfo.page"
                :total-count="total"
        @pageNumChange="handlePageNumChange">
    </pagination>-->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="storeInfo.size"
      :current-page="storeInfo.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/storeApi";
import { mapState } from "vuex";
// import pagination from 'common/pagination.vue'
export default {
  data() {
    return {
      storeInfo: {
        stationName: null, //安装点名称
        stationLocation: null, //安装点位置
        cardId: null, //身份证号
        contractNo: null, //合同编号
        startTime: null, //开始时间
        endTime: null, //结束时间
        stationStatus: null, //门店状态
        authStatus: null, //是否认证
        page: 1,
        size: 8,
        access_token: ``
      },
      total: 0, //总页数
      storeList: [],
      sexOptions: [
        {
          value: 0,
          sex: "男"
        },
        {
          value: 1,
          sex: "女"
        }
      ],
      storeOptions: []
    };
  },
  //  components: {
  //     pagination
  //  },
  activated() {
    this.storeInfo.access_token = this.access_token;
    this.getStoreList();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    getStoreList() {
      let params = this.storeInfo;
      http.getStoreList(params).then(data => {
        console.log(data.data);
        this.storeList = data.data.data;
        this.total = data.data.total;
      });
    },
    // 分页操作
    handlePageNumChange(num) {
      this.storeInfo.page = num;
      this.getStoreList();
    },
    resetForm() {},
    handleClick(row) {},
    //新增技术人员
    addStore() {
      this.$router.push({ name: `addStore`, query: { pageType: "add" } });
    },
    indexMethods(index) {
      return (this.storeInfo.page - 1) * this.storeInfo.size + index + 1;
    },
    deleteStore(row) {
      let that = this;
      let params = { access_token: this.access_token, id: row.id };
      this.$confirm("此操作将删除该门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteStore({ params }).then(data => {
            console.log(data.data.code);
            if (data.data.code == 0) {
              that.$message(data.data.desc);
              that.storeList = this.storeList.filter(item => {
                return item.id != row.id;
              });
              that.getStoreList();
            } else {
              this.$message(data.data.desc);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editStore(row) {
      // let storeInfo = {
      //   stationName: row.stationName, //安装店名称
      //   stationLocation: row.stationLocation, //安装点位置
      //   stationLat: row.stationLat, //安装纬度
      //   stationLon: row.stationLon, //安装经度
      //   cardId: row.cardId, //身份证号
      //   contractNo: row.contractNo, //合同编号
      //   startTime: row.startTime, //开始时间
      //   endTime: row.endTime, //结束时间
      //   access_token: this.access_token,
      //   contactWay: row.contactWay, //联系方式
      //   hostName: row.hostName, //安装店主名
      //   stationStatus:row.stationStatus
      // }

      this.$router.push({
        name: `addStore`,
        query: { storeInfo: JSON.stringify(row), pageType: "edit" }
      });
    },
    scoreDetail(row){
      this.$router.push({
        name: `scoreDetail`,
        query: {stationIds:row.stationId}
      });
    },
  }
};
</script>
<style lang="stylus" scoped>
#storeManage {
  .el-form {
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input {
    width: 250px;
  }

  .el-select {
    width: 250px;
  }

  .query-btn {
    text-align: center;
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .current_page_classname /deep/ .el-table__row {
    td:not(.is-hidden):last-child {
      right: -1px;
    }
  }
}
</style>