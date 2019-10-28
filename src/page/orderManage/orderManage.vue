<template>
  <div id="productManage">
    <!-- <el-button size="medium" style="margin-top:14px;" type="primary" @click="addStore">商品录入</el-button> -->
    <el-form
      :inline="true"
      :model="productForm"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="productForm"
    >
      <el-form-item label="订单状态">
        <el-select v-model="productForm.status" clearable>
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否打款">
        <el-select v-model="productForm.sharedProfit" clearable>
          <el-option
            v-for="item in shareOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="getProductList" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="productList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58" fixed="left">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="下单时间" width="140"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号" width="140"></el-table-column>
      <el-table-column label="订单状态" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.status=='NO_PAY'?'待付款':scope.row.status=='NO_RESERVE'?'待指派':scope.row.status=='USER_RESERVE'?'已指派':scope.row.status=='NO_INSTALL'?'待安装':scope.row.status=='NO_COMMENT'?'待评论':scope.row.status=='FINISH'?'已完成':scope.row.status=='CANCEL'?'已取消':scope.row.status == 'TIMEOUT'?'交易已关闭':scope.row.status=='REFUNDED'?'已退款':scope.row.status=='REFUNDING'?'退款中':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否打款" width="140">
        <template slot-scope="scope">
          <span>{{(scope.row.status=='FINISH'||scope.row.status=='NO_COMMENT')&&scope.row.sharedProfit==true?'已打款':(scope.row.status=='FINISH'||scope.row.status=='NO_COMMENT')&&scope.row.sharedProfit==false?'未打款':'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票状态" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceStatus=='NO'?'未开票':scope.row.invoiceStatus=='ING'?'处理中':scope.row.invoiceStatus=='YES'?'已开':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.goods[0].goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品型号" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.goods[0].goodsModel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图" width="140">
        <template slot-scope="scope">
          <img :src="scope.row.goods[0].goodsImg" class="product-img" />
        </template>
      </el-table-column>

      <el-table-column label="商品原价" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.goods[0].originPrice}}元</span>
        </template>
        
      </el-table-column>
      <el-table-column label="商品现价" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.goods[0].goodsPrice}}元</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderUserInfo.name" label="用户昵称" width="140"></el-table-column>
      <el-table-column prop="orderUserInfo.mobile" label="联系方法" width="140"></el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row,'checked')" type="text" size="small">详情</el-button>
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
import http from "http/orderManageApi";
import { mapState } from "vuex";
export default {
  name: "productManage",
  data() {
    return {
      productList: [],
      timeArr: [],
      productForm: {
        page: 1,
        size: 10,
        access_token: ``,
        status: ``,
        sharedProfit: ``,
        startTime: ``,
        endTime: ``
      },
      statusOption: [
        {
          value: "NO_PAY",
          label: "待支付"
        },
        {
          value: "NO_RESERVE",
          label: "待指派"
        },
        {
          value: "NO_INSTALL",
          label: "待安装"
        },
        {
          value: "NO_COMMENT",
          label: "待评论"
        },
        {
          value: "FINISH",
          label: "已完成"
        },
        {
          value: "CANCEL",
          label: "已取消"
        },
        {
          value: "TIMEOUT",
          label: "支付超时"
        },
        {
          value: "REFUNDING",
          label: "退款中"
        },
        {
          value: "REFUNDED",
          label: "已退款"
        },
        {
          value: "USER_RESERVE",
          label: "已指派"
        }
      ],
      shareOptions: [
        {
          value: false,
          label: `否`
        },
        {
          value: true,
          label: `是`
        }
      ],
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
    selectTime(arr) {
      if (arr == null) {
        this.timeArr = [];
        this.productForm.startTime = ``;
        this.productForm.endTime = ``;
      } else {
        this.productForm.startTime = arr[0];
        this.productForm.endTime = arr[1];
      }
    },
    addStore() {
      
      this.$router.push({ name: `addProduct`, query: { pageType: "add" } });
    },
    editProduct(row) {
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
      http.getOrderList({ params }).then(data => {
        console.log(data.data.data);
        let arr = data.data.data;
        arr.forEach(item => {
          item.goods[0].originPrice = this.splitNum(item.goods[0].originPrice);
          item.goods[0].goodsPrice = this.splitNum(item.goods[0].goodsPrice);
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
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteProduct({ params }).then(data => {
            console.log(data);
            if (data.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
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
    // 去详情
    handleClick(row) {
      let productInfo = JSON.stringify(row);
      this.$router.push({ name: `orderDetail`, query: { productInfo } });
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