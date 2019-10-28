<template>
  <div id="questionAndAns">
    <h3>佣金配置</h3>
    <el-table :data="disposeList" border style="width: 100%;margin-top:24px;">
      <el-table-column label="技工佣金">
        <template slot-scope="scope">
          <span>{{scope.row.techEarning}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="门店佣金">
        <template slot-scope="scope">
          <span>{{scope.row.stationEarning}}元</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row,'store')" type="text" size="small">更新配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="profitList" border style="width: 100%;margin-top:24px;">
      <el-table-column label="销售佣金">
        <template slot-scope="scope">
          <span>{{scope.row.upper1Level}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="管理佣金">
        <template slot-scope="scope">
          <span>{{scope.row.upper2Level}}元</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row,'commision')" type="text" size="small">更新配置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import http from "http/disposeApi";
import { mapState } from "vuex";
export default {
  name: `profitDispose`,
  data() {
    return {
      phoneForm: {
        access_token: ``
      },
      total: 0,
      disposeList: [],
      profitList:[],
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.phoneForm.access_token = this.access_token;
    this.getStoreProfit();
    this.getProfit()
  },
  methods: {
    indexMethods(index) {
      return index + 1;
      //   return (this.phoneForm.page - 1) * this.phoneForm.size + index + 1;
    },
    getStoreProfit() {
      let params = this.phoneForm;
      http.getStoreProfit({ params }).then(data => {
        if (data.data.code == 0) {
          data.data.data.techEarning = this.splitNum(
            data.data.data.techEarning
          );
          data.data.data.stationEarning = this.splitNum(
            data.data.data.stationEarning
          );
          this.disposeList = [data.data.data];
          //   this.total = data.data.total;
        }
      });
    },
    getProfit() {
      let params = this.phoneForm;
      http.getCommision({ params }).then(data => {
        if (data.data.code == 0) {
          data.data.data.upper1Level = this.splitNum(
            data.data.data.upper1Level
          );
          data.data.data.upper2Level = this.splitNum(
            data.data.data.upper2Level
          );
          this.profitList = [data.data.data];
          //   this.total = data.data.total;
        }
      });
    },
    edit(row,type) {
      this.$router.push({
        name: `editProfit`,
        query: { profitInfo: JSON.stringify(row),pageType:type }
      });
    },
    // 转换价格
    splitNum(num) {
      if (typeof num !== "number" || isNaN(num)) return null;
      return num / 100.0;
    }
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