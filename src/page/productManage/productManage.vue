<template>
  <div id="productManage">
    <el-button size="medium" style="margin-top:14px;" type="primary" @click="addStore">商品录入</el-button>
    <el-table :data="productList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" class="product-img" />
        </template>
      </el-table-column>
      <el-table-column prop="model" label="商品型号"></el-table-column>
      <el-table-column label="商品原价">
        <template slot-scope="scope">
          <span>{{scope.row.originPrice}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="商品现价">
        <template slot-scope="scope">
          <span>{{scope.row.currentPrice}}元</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column label="商品状态">
        <template slot-scope="scope">
          <span>{{scope.row.status=='NORMAL'?'正常':scope.row.status=='NO_STOCK'?'无库存':scope.row.status=='REMOVE'?'下架':''}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="editStatus(scope.row,'checked')"
            type="text"
            size="small"
          >{{scope.row.status=='NORMAL'?'下架':scope.row.status=='REMOVE'?'上架':''}}</el-button>

          <el-button @click="editProduct(scope.row,'checked')" type="text" size="small">编辑</el-button>

          <el-button @click="deleteProduct(scope.row,'checked')" type="text" size="small">删除</el-button>

          <el-button @click="handleClick(scope.row,'checked')" type="text" size="small">详情</el-button>
          <el-button @click="movePosition(scope.row,'up')" type="text" size="small">上移</el-button>
          <el-button @click="movePosition(scope.row,'down')" type="text" size="small">下移</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="productForm.size"
      :current-page="productForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/productManageApi";
import { mapState } from "vuex";
export default {
  name: "productManage",
  data() {
    return {
      productList: [],
      productForm: {
        page: 1,
        size: 5,
        access_token: ``
      },
      total: 0
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.productForm.access_token = this.access_token;
    this.getProductList();
  },
  methods: {
    addStore() {
      this.$router.push({ name: `addProduct`, query: { pageType: "add" } });
    },
    editProduct(row) {
      console.log(row);
      let productInfo = JSON.stringify(row);
      this.$router.push({
        name: `addProduct`,
        query: { pageType: "edit", productInfo }
      });
    },
    indexMethods(index) {
      return (this.productForm.page - 1) * this.productForm.size + index + 1;
    },
    getProductList() {
      let params = this.productForm;
      http.getProductList({ params }).then(data => {
        console.log(data.data.data);
        let arr = data.data.data;
        arr.forEach(item => {
          item.originPrice = this.splitNum(item.originPrice);
          item.currentPrice = this.splitNum(item.currentPrice);
          if (item.profit) {
            item.profit.upper1LevelProfit = this.splitNum(
              item.profit.upper1LevelProfit
            );
            item.profit.upper2LevelProfit = this.splitNum(
              item.profit.upper2LevelProfit
            );
            item.profit.stationEarning = this.splitNum(
              item.profit.stationEarning
            );
            item.profit.techEarning = this.splitNum(item.profit.techEarning);
          }
        });
        this.productList = arr;
        this.total = data.data.total;
      });
    },
    // 转换价格
    splitNum(num) {
      if (typeof num !== "number" || isNaN(num)) return null;
      return num / 100.0;
    },
    handlePageNumChange(num) {
      this.productForm.page = num;
      this.getProductList();
    },
    //删除商品
    deleteProduct(row) {
      let params = { no: row.no, access_token: this.access_token };
      let that = this;
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteProduct(params).then(data => {
            console.log(data);
            if (data.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              that.productList = this.productList.filter(item => {
                item.no != row.no;
              });
              that.getProductList();
            } else {
              this.$message({
                type: "success",
                message: data.data.desc
              });
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
    // 修改订单状态
    editStatus(row) {
      let params = {
        status:
          row.status == "NORMAL"
            ? "REMOVE"
            : row.status == "REMOVE"
            ? "NORMAL"
            : "",
        access_token: this.access_token,
        no: row.no
      };
      let that = this;
      this.$confirm(
        `此操作将${
          row.status == "NORMAL" ? "下架" : row.status == "REMOVE" ? "上架" : ""
        }该商品, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          http.editProduct(params).then(data => {
            if (data.data.code == 0) {
              that.$message(data.data.desc);
              that.getProductList();
            } else {
              that.$message(data.data.desc);
            }
          });
        })
        .catch(() => {});
    },
    // 去详情
    handleClick(row) {
      let productInfo = JSON.stringify(row);
      this.$router.push({ name: `productDetail`, query: { productInfo } });
    },
    //上移或下移
    movePosition(row, direction) {
      console.log(row, direction);
      let params = { no: row.no, access_token: this.access_token, direction };
      http.movePosition(params).then(data => {
        if (data.data.code == 0) {
          this.$message(`${direction == "up" ? "上移" : "下移"}成功`);
          this.getProductList();
        } else {
          this.$message(
            `${direction == "up" ? "上移" : "下移"}失败，请稍后再试`
          );
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.product-img {
  width: 100%;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>