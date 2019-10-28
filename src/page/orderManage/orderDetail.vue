<template>
  <div id="productDetail">
    <div class="productDetail">
      <div class="product_detail">
        <h3>订单信息</h3>
        <div class="product-info-content">
          <span>下单时间：</span>
          <span>{{productInfo.gmtCreate}}</span>
        </div>
        <div class="product-info-content">
          <span>订单编号：</span>
          <span>{{productInfo.orderNo}}</span>
        </div>
        <div class="product-info-content">
          <span>订单状态</span>
          <span>{{productInfo.status=='NO_PAY'?'待付款':productInfo.status=='NO_RESERVE'?'待指派':productInfo.status=='USER_RESERVE'?'已指派':productInfo.status=='NO_INSTALL'?'待安装':productInfo.status=='NO_COMMENT'?'待评论':productInfo.status=='FINISH'?'已完成':productInfo.status=='CANCEL'?'已取消':productInfo.status == 'TIMEOUT'?'交易已关闭':productInfo.status=='REFUNDED'?'已退款':productInfo.status=='REFUNDING'?'退款中':''}}</span>
        </div>
        <div class="product-info-content">
          <span>发票状态</span>
          <span>{{productInfo.invoiceStatus=='NO'?'未开票':productInfo.invoiceStatus=='ING'?'处理中':productInfo.invoiceStatus=='YES'?'已开票':''}}</span>
        </div>
        <div class="product-info-content" v-if="productInfo.goods">
          <span>商品名称：</span>
          <span>{{productInfo.goods[0].goodsName}}</span>
        </div>
        <div class="product-info-content" v-if="productInfo.goods">
          <span>商品型号：</span>
          <span>{{productInfo.goods[0].goodsModel}}</span>
        </div>
        <div class="product-info-content" v-if="productInfo.goods">
          <span>商品图：</span>
          <img :src="productInfo.goods[0].goodsImg" class="product-img" />
        </div>
        <div class="product-info-content" v-if="productInfo.goods">
          <span>商品原价：</span>
          <span>{{productInfo.goods[0].originPrice}}</span>
        </div>
        <div class="product-info-content" v-if="productInfo.goods">
          <span>商品现价：</span>
          <span>{{productInfo.goods[0].goodsPrice}}</span>
        </div>
        <h3>用户信息</h3>
        <div class="product-info-content">
          <span>用户昵称：</span>
          <span>{{userInfo.nickname}}</span>
        </div>
        <div class="product-info-content">
          <span>联系方法：</span>
          <span>{{userInfo.mobile}}</span>
        </div>
        <!-- 预约门店信息 -->
        <div v-if="storeStatus">
          <h3>预约门店信息</h3>
          <div class="product-info-content">
            <span>预约时间：</span>
            <span>{{storeInfo.bookTime}}</span>
          </div>
          <div class="product-info-content">
            <span>门店标识：</span>
            <span>{{storeInfo.stationId}}</span>
          </div>
          <div class="product-info-content">
            <span>门店名称：</span>
            <span>{{storeInfo.stationName}}</span>
          </div>
        </div>
        <!-- 安装任务 -->
        <div v-if="installStatus">
          <h3>安装任务信息</h3>
          <div class="product-info-content">
            <span>技术员到位时间：</span>
            <span>{{installInfo.confirmTime}}</span>
          </div>
          <div class="product-info-content">
            <span>安装完成时间：</span>
            <span>{{installInfo.completeTime}}</span>
          </div>
          <div class="product-info-content">
            <span>任务标识：</span>
            <span>{{installInfo.taskId}}</span>
          </div>
          <div class="product-info-content">
            <span>安装店标识：</span>
            <span>{{installInfo.stationId}}</span>
          </div>
          <div class="product-info-content">
            <span>抢单技术员：</span>
            <span>{{installInfo.grabTech}}</span>
          </div>
          <div class="product-info-content">
            <span>接单人数类型：</span>
            <span>{{installInfo.cooperStatus==0?'单人':'协作'}}</span>
          </div>
          <div class="product-info-content">
            <span>已确认人数：</span>
            <span>{{installInfo.confirmedNum}}</span>
          </div>
          <div class="product-info-content">
            <span>接单类型：</span>
            <span>{{installInfo.takeType==0?'抢单':'指派'}}</span>
          </div>
          <div class="product-info-content">
            <span>接单状态：</span>
            <span>{{installInfo.taskStatus==1?'门店确认接单':installInfo.taskStatus==2?'发布待抢单':installInfo.taskStatus==3?'已被抢待确认':installInfo.taskStatus==4?'被抢已确认':installInfo.taskStatus==5?'指派订单':installInfo.taskStatus==7?'任务完成结束':''}}</span>
          </div>
          <div class="product-info-content">
            <span>车架号图片：</span>
            <img :src="installInfo.driverLicense" alt style="width:200px;" />
          </div>
          <div
            class="product-info-content"
            style="margin-top:20px;"
            v-if="installInfo.pictures&&installInfo.pictures.length!=0"
          >
            <span>安装图片：</span>
            <img
              v-for="item in installInfo.pictures"
              :src="item.picturePath"
              alt
              :key="item.id"
              style="width:200px;margin-right:20px;"
            />
          </div>
          <div
            class="product-info-content"
            v-if="installInfo.technicians&&installInfo.technicians.length!=0"
          >
            <span>协作技术员：</span>
            <div
              v-for="item in installInfo.technicians"
              :key="item.id"
              style="display:flex;flex-direction:column;margin-right:34px;"
            >
              <span>安装人员id：{{item.techId}}</span>
              <span>安装人员名称：{{item.techName}}</span>
              <span>是否确认：{{item.confirmStatus==0?'未确认':'确认'}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 管理佣金 -->
      <div class="commission">
        <div class="management">
          <h4>管理佣金</h4>
          <p>
            <span>昵称：{{management?management.nickname:'暂无'}}</span>
            <span>会员号：{{management?management.memberId:'暂无'}}</span>
          </p>
          <el-table
            :data="management?management.tradeDetails:[]"
            border
            style="width: 100%;margin-top:14px;"
          >
            <el-table-column prop="tradeType" label="收益类型"></el-table-column>
            <el-table-column prop="tradeInOut" label="增加/减少"></el-table-column>
            <el-table-column label="佣金类型">
              <template slot-scope="scope">
                <span>{{scope.row.tradeDesc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="数额">
              <template slot-scope="scope">
                <span>{{splitNum(scope.row.amount)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="时间" width="160"></el-table-column>
          </el-table>
        </div>
        <!-- 销售佣金 -->
        <div class="management">
          <h4>销售佣金</h4>
          <p>
            <span>昵称：{{saleInfo?saleInfo.nickname:'暂无'}}</span>
            <span>会员号：{{saleInfo?saleInfo.memberId:'暂无'}}</span>
          </p>
          <el-table
            :data="saleInfo?saleInfo.tradeDetails:[]"
            border
            style="width: 100%;margin-top:14px;"
          >
            <el-table-column prop="tradeType" label="收益类型"></el-table-column>
            <el-table-column prop="tradeInOut" label="增加/减少"></el-table-column>
            <el-table-column label="佣金类型">
              <template slot-scope="scope">
                <span>{{scope.row.tradeDesc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="数额">
              <template slot-scope="scope">
                <span>{{splitNum(scope.row.amount)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="时间" width="160"></el-table-column>
          </el-table>
        </div>
        <div class="management">
          <h4>门店收益</h4>
          <p>
            <span>门店名称：{{stationEarning?stationEarning.stationName:'暂无'}}</span>
            <!-- <span>门店ID{{stationEarning?stationEarning.stationId:'暂无'}}</span> -->
          </p>
          <el-table
            :data="stationEarning?stationEarning.records:[]"
            border
            style="width: 100%;margin-top:14px;"
          >
            <el-table-column label="收益类型">
              <template slot-scope="scope">
                <span>{{scope.row.earnType==0?'预收益':scope.row.earnType==1?'收益':scope.row.earnType==3?'退款':scope.row.earnType==4?'支出':scope.row.earnType==5?'提现':''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tradeInOut" label="增加/减少">
              <template slot-scope="scope">
                <span>{{scope.row.inOut==0?'增加':'减少'}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="佣金类型">
              <template slot-scope="scope">
                <span>{{scope.row.earnStatus==0?'正常':scope.row.earnStatus==1?'取消':scope.row.earnStatus==2?'转成收益':scope.row.earnStatus==3?'失败':scope.row.earnStatus==4?'系统处理中':''}}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="statusDesc" label="状态"></el-table-column>
            <el-table-column label="数额">
              <template slot-scope="scope">
                <span>{{splitNum(scope.row.earning)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="160"></el-table-column>
          </el-table>
        </div>
        <div>
          <h4>技术员收益</h4>
          <el-table :data="techEarnings" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="techName" label="技术员名称" width="110"></el-table-column>
            <el-table-column label="收益数据">
              <template slot-scope="scope">
                <el-table :data="scope.row.records?scope.row.records:[]">
                  <el-table-column label="收益类型">
                    <template slot-scope="scope1">
                      <span>{{scope1.row.earnType==0?'预收益':scope1.row.earnType==1?'收益':scope1.row.earnType==3?'退款':scope1.row.earnType==4?'支出':scope1.row.earnType==5?'提现':''}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="tradeInOut" label="增加/减少">
                    <template slot-scope="scope">
                      <span>{{scope.row.inOut==0?'增加':'减少'}}</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="佣金类型">
                    <template slot-scope="scope">
                      <span>{{scope.row.earnStatus==0?'正常':scope.row.earnStatus==1?'取消':scope.row.earnStatus==2?'转成收益':scope.row.earnStatus==3?'失败':scope.row.earnStatus==4?'系统处理中':''}}</span>
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="statusDesc" label="状态"></el-table-column>
                  <el-table-column label="数额">
                    <template slot-scope="scope">
                      <span>{{splitNum(scope.row.earning)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="时间" width="160"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div style="text-align: center;margin-top: 12px;">
      <el-button
        type="primary"
        :disabled="productInfo.sharedProfit"
        @click="makeMoney"
        size="medium"
        v-if="productInfo.status=='NO_COMMENT'||productInfo.status=='FINISH'"
      >{{productInfo.sharedProfit==false?'打款':'已打款'}}</el-button>
      <el-button
        type="primary"
        @click="getStoreInfo"
        size="medium"
        v-if="productInfo.status=='NO_COMMENT'||productInfo.status=='FINISH'||productInfo.status=='USER_RESERVE'||productInfo.status=='NO_INSTALL'"
      >查询门店信息</el-button>
      <el-button
        type="primary"
        @click="getInstallInfo"
        size="medium"
        v-if="productInfo.status=='NO_COMMENT'||productInfo.status=='FINISH'||productInfo.status=='NO_INSTALL'"
      >查询安装信息</el-button>
      <el-button
        type="primary"
        @click="assignStore"
        size="medium"
        v-if="productInfo.status=='NO_RESERVE'"
      >指派门店</el-button>
      <el-button type="primary" @click="$router.go(-1)" size="medium">返回</el-button>
    </div>
  </div>
</template>
<script>
import http from "http/orderManageApi";
import https from "http/loginApi";
import { mapState } from "vuex";
export default {
  name: `productDetail`,
  data() {
    return {
      productInfo: {},
      memberId: ``,
      userInfo: {},
      storeInfo: {},
      installInfo: {},
      storeStatus: false,
      installStatus: false,
      saleInfo: {},
      management: {},
      stationEarning: {}, //门店收益
      techEarnings: [] //技术员收益
    };
  },
  activated() {
    this.productInfo = JSON.parse(this.$route.query.productInfo);
    this.memberId = JSON.parse(this.$route.query.productInfo).memberId;
    this.getUserInfo();
    this.storeStatus = false;
    this.installStatus = false;
    this.getCommission();
    this.getIncomeRecord();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    getUserInfo() {
      let params = { memberId: this.memberId, access_token: this.access_token };
      https.getUserInfo({ params }).then(data => {
        console.log(data.data);
        this.userInfo = data.data.data;
      });
    },
    // 转换价格
    splitNum(num) {
      if (typeof num !== "number" || isNaN(num)) return null;
      return num / 100.0;
    },
    makeMoney() {
      let params = {
        access_token: this.access_token,
        orderNo: this.productInfo.orderNo
      };
      let that = this;
      this.$confirm("此操作将对该订单打款, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.makeMoney(params).then(data => {
            console.log(data.data);
            if (data.data.code == 0) {
              that.$message(`打款成功`);
              that.$router.go(-1);
            }
          });
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getStoreInfo() {
      let params = {
        access_token: this.access_token,
        orderNo: this.productInfo.orderNo
      };
      http.getStoreInfo({ params }).then(data => {
        console.log(data.data.data);
        if (data.data.code == 0) {
          this.storeInfo = data.data.data;
          this.storeStatus = true;
        } else {
          this.$message(data.data.desc);
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {},
    getInstallInfo() {
      let params = {
        access_token: this.access_token,
        orderNo: this.productInfo.orderNo
      };
      http.getInstallInfo({ params }).then(data => {
        console.log(data.data);
        if (data.data.code == 0) {
          this.installInfo = data.data.data;
          this.installStatus = true;
        } else {
          this.$message(data.data.desc);
        }
      });
    },
    assignStore() {
      let userInfo = this.productInfo.orderUserInfo;
      let orderInfo = this.productInfo;
      this.$router.push({
        name: `assignStore`,
        query: {
          userInfo: JSON.stringify(userInfo),
          orderInfo: JSON.stringify(orderInfo)
        }
      });
    },
    //获取佣金记录
    getCommission() {
      let params = {
        orderNo: this.productInfo.orderNo,
        access_token: this.access_token
      };
      http.getCommission({ params }).then(data => {
        console.log(data.data);
        this.management = data.data.data.management;
        this.saleInfo = data.data.data.sale;
      });
    },
    //获取收益记录
    getIncomeRecord() {
      let params = {
        orderNo: this.productInfo.orderNo,
        access_token: this.access_token
      };
      http.getIncomeRecord({ params }).then(data => {
        console.log(data);
        if (data.data.code == 0) {
          this.stationEarning = data.data.data.stationEarning;
          this.techEarnings = data.data.data.techEarnings;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.productDetail {
  display: flex;
  // align-items: center;
}

.product_detail {
  width: 50%;
}

.commission {
  flex: 1;
}

.product-info-content {
  line-height: 36px;
  display: flex;
  align-items: center;
}

.management {
  p {
    span {
      margin-right: 60px;
    }
  }
}

.product-info-content>span {
  display: block;
  margin-right: 14px;
}

.product-info-content>span:nth-child(1) {
  min-width: 120px;
}

.productImg {
  width: 178px;
  height: 178px;
  margin-right: 12px;
}
</style>