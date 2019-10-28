<template>
  <div id="productManage">
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="addSwiper"
    >新增轮播图</el-button>
    <el-table :data="swiperList" border  style="width: 100%;margin-top:14px;">
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
      <el-table-column prop="infoUrl" label="轮播图内容路径"></el-table-column>
      <el-table-column prop="showOrder" label="显示顺序"></el-table-column>
      <el-table-column label="是否显示">
        <template slot-scope="scope">
          <span>{{scope.row.isShow==0?'否':'是'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteSwiper(scope.row,'checked')" type="text" size="small">删除</el-button>
          <!-- <el-button @click="handleClick(scope.row,'checked')" type="text" size="small">详情</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="swiperForm.size"
      :current-page="swiperForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/swiperManageApi";
import { mapState } from "vuex";
export default {
  name: "productManage",
  data() {
    return {
      swiperList: [],
      swiperForm: {
        page: 1,
        size: 10,
        access_token: ``
      },
      total: 0
    };
  },
  activated() {
    this.swiperForm.access_token = this.access_token;
    this.getSwiperList();
  },
  methods: {
    indexMethods(index) {
      return (this.swiperForm.page - 1) * this.swiperForm.size + index + 1;
    },
    //新增轮播图
    addSwiper() {
      this.$router.push({ name: `addSwiper` });
    },
    //获取轮播图列表
    getSwiperList() {
      let params = this.swiperForm;
      http.getSwiperList({ params }).then(data => {
        console.log(data.data);
        this.swiperList = data.data.data;
        this.total = data.data.total;
      });
    },
    handlePageNumChange(num) {
      this.swiperForm.page = num;
      this.getSwiperList();
    },
    //删除轮播图
    deleteSwiper(row) {
      console.log(row);
      let params = { access_token: this.access_token, id: row.id };
      http
        .deleteSwiper({ params })
        .then(data => {
          console.log(data);
          if (data.data.code == 0) {
            this.$message(data.data.desc);
            this.swiperList = this.swiperList.filter(item => {
              return item.id != row.id;
            });
          } else {
            this.$message(`删除失败`);
          }
        })
        .catch(e => {
          this.$message(`删除失败`);
        });
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`])
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