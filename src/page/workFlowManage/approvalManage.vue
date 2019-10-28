<template>
  <div class="approvalManage">
    <el-table :data="approvalList" border  style="width: 100%;margin-top:14px;">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="审核类型名称"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row,'checked')" type="text" size="small">编辑</el-button>
          <el-button @click="detailClick(scope.row,'checked')" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="approvalInfo.size"
      :current-page="approvalInfo.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/approvalManageApi";
import { mapState } from "vuex";
export default {
  name: `approvalManage`,
  data() {
    return {
      approvalInfo: {
        page: 1,
        size: 10
      },
      total:0,
      approvalList: []
    };
  },
  created() {
    this.approvalInfo.access_token = this.access_token;
    this.getApprovalList();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    getApprovalList() {
      let params = this.approvalInfo;
      http.getApprovalList({ params }).then(data => {
        console.log(data.data.data);
        this.approvalList = data.data.data;
        this.total = data.data.total
      });
    },
    detailClick(row) {
      this.$router.push({ name: `approvalDetail`, params: { id: row.id } });
    },
    editClick(row) {
      this.$router.push({
        name: `editApproval`,
        query: { typeName: row.typeName, typeId: row.id }
      });
    },
    indexMethods(index) {
      return (this.approvalInfo.page - 1) * this.approvalInfo.size + index + 1;
    },
    handlePageNumChange(num) {
      this.approvalInfo.page = num;
      this.getApprovalList();
    }
  }
};
</script>
<style lang="stylus" scoped></style>