<template>
  <div id="questionAndAns">
    <el-table :data="disposeList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="180">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="技工收益">
        <template slot-scope="scope">
          <span>{{scope.row.techEarning}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="门店收益">
        <template slot-scope="scope">
          <span>{{scope.row.stationEarning}}元</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row,'checked')" type="text" size="small">更新配置</el-button>
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
      disposeList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.phoneForm.access_token = this.access_token;
    this.getStoreProfit();
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
    edit(row) {
      this.$router.push({
        name: `editProfit`,
        query: { profitInfo: JSON.stringify(row) }
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