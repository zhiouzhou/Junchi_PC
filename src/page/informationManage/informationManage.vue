<template>
  <div id="informationManage">
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="addInformation"
    >新增资讯</el-button>
    <el-table :data="informationList" border  style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="infoName" label="轮播资讯名"></el-table-column>
      <el-table-column label="轮播图片">
        <template slot-scope="scope">
          <img :src="scope.row.picPath" class="swiper-img">
        </template>
      </el-table-column>
      <!-- <el-table-column prop="picPath" label="轮播图"></el-table-column> -->
      <el-table-column prop="infoAbbr" label="摘要"></el-table-column>
      <el-table-column prop="infoUrl" label="信息url"></el-table-column>
      <el-table-column label="是否生效">
        <template slot-scope="scope">
          <span>{{scope.row.isShow==0?'不生效':'生效'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="infoDate" label="发布日期"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteInfomation(scope.row,'checked')" type="text" size="small">删除</el-button>
          <el-button @click="editInfomation(scope.row,'checked')" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="informationForm.size"
      :current-page="informationForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/informationManageApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      informationForm: {
        access_token: ``,
        page: 1,
        size: 4
      },
      total: 0,
      informationList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.informationForm.access_token = this.access_token;
    this.getInformationList();
  },
  methods: {
    getInformationList() {
      let params = this.informationForm;
      http.getInformationList({ params }).then(data => {
        console.log(data.data.data);
        data.data.data.forEach(item=>{
          item.picPath = 'http://img01.store.sogou.com/net/a/04/link?appid=100520029&url='+item.picPath
        })
        this.informationList = data.data.data;
        this.total = data.data.total;
      });
    },
    indexMethods(index) {
      return (
        (this.informationForm.page - 1) * this.informationForm.size + index + 1
      );
    },
    handlePageNumChange(num) {
      this.informationForm.page = num;
      this.getInformationList();
    },
    addInformation() {
      this.$router.push({ name: `addInformation` });
    },
    deleteInfomation(row) {
      let params = { access_token: this.access_token, id: row.id };
      this.$confirm("此操作将永久删除该资讯, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http
            .deleteInfomation({ params })
            .then(data => {
              if (data.data.code == 0) {
                this.$message(data.data.desc);
                this.informationList = this.informationList.filter(item => {
                  return item.id != row.id;
                });
                this.getInformationList();
              } else {
                this.$message(`删除失败`);
              }
            })
            .catch(e => {
              this.$message(`删除失败`);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editInfomation(row) {
      let informationForm = JSON.stringify(row);
      this.$router.push({
        name: `addInformation`,
        query: { informationForm, type: `edit` }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.swiper-img {
  /* width 200px;
  height:200px */
  width: 100%;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>