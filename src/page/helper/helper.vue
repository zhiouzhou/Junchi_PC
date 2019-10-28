<template>
  <div>
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="addHelper"
    >添加推广图片</el-button>
    <el-table :data="helperList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="imageId" label="推广图片标识"></el-table-column>
      <el-table-column prop="contactWay" label="图片路径">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt class="helperImg">
        </template>
      </el-table-column>
      <el-table-column prop="contactWay" label="是否生效">
        <template slot-scope="scope">
          <span>{{scope.row.isShow==0?'不生效':'生效'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteHelper(scope.row,'checked')" type="text" size="small">删除</el-button>
          <el-button @click="edit(scope.row,'checked')" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="helperForm.size"
      :current-page="helperForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/helperApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      helperForm: {
        page: 1,
        size: 10,
        access_token: ``
      },
      total: 0,
      helperList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.helperForm.access_token = this.access_token;
    this.getHelperList();
  },
  methods: {
    getHelperList() {
      http.getHelperList({ params: this.helperForm }).then(data => {
        if (data.data.code == 0) {
          this.helperList = data.data.data;
          this.total = data.data.total;
        }
      });
    },
    addHelper() {
      this.$router.push({ name: `addHelper` });
    },
    handlePageNumChange(num) {
      this.helperForm.page = num;
      this.getHelperList();
    },
    indexMethods(index) {
      return (this.helperForm.page - 1) * this.helperForm.size + index + 1;
    },
    deleteHelper(row) {
      let params = { imageId: row.imageId, access_token: this.access_token };
      let that = this;
      this.$confirm("此操作将删除该推广图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteHelper({ params }).then(data => {
            if (data.data.code == 0) {
              that.$message(data.data.desc);
              that.helperList = this.helperList.filter(item => {
                return item.imageId != row.imageId;
              });
              that.getHelperList();
            } else {
              that.$message(data.data.desc);
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
    edit(row){
        this.$router.push({name:`editHelper`,query:{imageId:row.imageId}})
    },
  }
};
</script>
<style lang="stylus" scoped>
.helperImg {
  width: 100%;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>