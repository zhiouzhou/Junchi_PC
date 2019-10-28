<template>
  <div class="invoiceAudit">
    <div class="invoice-info">
      <h4>发票信息</h4>
      <div class="invoice-info-content">
        <span>订单编号：</span>
        <span>{{invoiceInfo.orderNo}}</span>
      </div>
      <div class="invoice-info-content">
        <span>订单状态：</span>
        <span>{{orderInfo.status=="FINISH"?'已完成':''}}</span>
      </div>
      <div class="invoice-info-content">
        <span>订单总价</span>
        <span>{{splitNum(orderInfo.price)}}元</span>
      </div>
      <div class="invoice-info-content">
        <span>开票时间：</span>
        <span>{{invoiceInfo.gmtCreate}}</span>
      </div>
      <div class="invoice-info-content">
        <span>开票类型：</span>
        <span>{{invoiceInfo.medium=="PAPER"?'纸质发票':''}}</span>
      </div>
      <div class="invoice-info-content">
        <span>开票状态：</span>
        <span>{{invoiceInfo.status=="NO"?"未开票":invoiceInfo.status=="ING"?"开票中":"已开票"}}</span>
      </div>
      <div class="invoice-info-content">
        <span>抬头类型</span>
        <span>{{invoiceInfo.titleType=="COMPANY"?"企业":invoiceInfo.titleType=="INDIVIDUAL"?"个人":""}}</span>
      </div>
      <div class="invoice-info-content">
        <span>发票抬头：</span>
        <span>{{invoiceInfo.title}}</span>
      </div>
      <div class="invoice-info-content">
        <span>税号：</span>
        <span>{{invoiceInfo.taxNo}}</span>
      </div>
      <div class="invoice-info-content">
        <span>收货人：</span>
        <span>{{invoiceInfo.receiverName}}</span>
      </div>
      <div class="invoice-info-content">
        <span>收货人电话：</span>
        <span>{{invoiceInfo.receiverPhone}}</span>
      </div>
      <div class="invoice-info-content">
        <span>收货人地址：</span>
        <span>{{invoiceInfo.receiverAddress}}</span>
      </div>
    </div>
    <!-- 商品信息 -->
    <h4>商品信息：</h4>
    <div class="invoice-info" v-for="item in orderInfo.goods" :key="item.id">
      <div class="invoice-info-content">
        <span>商品名称：</span>
        <span>{{item.goodsName}}</span>
      </div>
      <div class="invoice-info-content">
        <span>商品数量：</span>
        <span>{{item.count}}</span>
      </div>
      <div class="invoice-info-content">
        <span>商品原价：</span>
        <span>{{splitNum(item.originPrice)}}</span>
      </div>

      <div class="invoice-info-content">
        <span>商品现价：</span>
        <span>{{splitNum(item.goodsPrice)}}元</span>
      </div>
    </div>
    <div style="margin-top:30px;">
      <el-button type="primary" @click="auditBtn" size="medium">确认开票</el-button>
      <el-button type="info" @click="$router.go(-1)" style="margin-left:40px;" size="medium">取消</el-button>
    </div>
    <!-- 开票弹框 -->
    <!-- <el-dialog title="您是否确认开票？" :visible.sync="dialogFormVisible" append-to-body width="30%">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="makeOutInvice()">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/invoiceManageApi";
export default {
  name: "invoiceAudit",
  data() {
    return {
      invoiceInfo: {},
      orderInfo: {},
      dialogFormVisible: false
    };
  },
  activated() {
    // console.log(JSON.parse(this.$route.query.invoiceInfo))
    this.invoiceInfo = JSON.parse(this.$route.query.invoiceInfo);
    this.getOrderInfo();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    getOrderInfo() {
      let params = {
        orderNo: this.invoiceInfo.orderNo,
        access_token: this.access_token
      };
      http.getOrderInfo({ params }).then(data => {
        this.orderInfo = data.data.data;
      });
    },
    // 转换价格
    splitNum(num) {
      if (typeof num !== "number" || isNaN(num)) return null;
      return num / 100.0;
    },
    // 确认开票
    auditBtn() {
      let params = {
        invoiceId: this.invoiceInfo.id,
        access_token: this.access_token,
        content: '商品明细',
        status: "YES"
      };
let that = this
      //   this.dialogFormVisible  = true
      this.$confirm("您是否确认开票？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            http.auditInvoice(params).then(data=>{
            console.log(data.data)
            if(data.data.code==0){
              that.$message(data.data.desc)
              setTimeout(()=>{
                  that.$router.go(-1)
              },2000)
            }else {
              that.$message(data.data.desc)
            }
          }).catch(e=>{
              this.$message(`开票失败，请稍后重试！`)
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
    // makeOutInvice(){
    //      let params = {invoiceId:this.invoiceInfo.id,access_token:this.access_token,content:this.invoiceForm.content,status:"YES"}
    // },
  }
};
</script>
<style lang="stylus" scoped>
.invoice-info-content {
  line-height: 28px;
  display: flex;
  align-items: center;
}

.invoice-info-content>span {
  display: block;
  margin-right: 14px;
}

.invoice-info-content>span:nth-child(1) {
  width: 120px;
}
</style>