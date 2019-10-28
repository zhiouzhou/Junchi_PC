<template>
  <div id="invoiceManage">
    <el-form
      :inline="true"
      :model="invoiceInfo"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="invoiceInfo"
    >
      <el-form-item label="发票状态">
        <el-select v-model="invoiceInfo.status" clearable>
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.status"
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
        <el-button type="primary" @click="getInvoiceList" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="invoiceList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="开票时间"></el-table-column>
      <el-table-column label="开票类型">
        <template slot-scope="scope">
          <span>{{scope.row.medium=="PAPER"?"纸质发票":"电子发票"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票状态">
        <template slot-scope="scope">
          <span>{{scope.row.status=="NO"?"未开票":scope.row.status=="ING"?"开票中":"已开票"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="抬头类型">
        <template slot-scope="scope">
          <span>{{scope.row.titleType=="COMPANY"?"企业":scope.row.titleType=="INDIVIDUAL"?"个人":""}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="发票抬头"></el-table-column>
      <el-table-column prop="taxNo" label="税号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="receiverAddress" label="收货地址"></el-table-column>
      <el-table-column prop="receiverName" label="收货人"></el-table-column>
      <el-table-column prop="receiverPhone" label="电话"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row,'checked')"
            type="text"
            size="small"
            v-if="scope.row.status=='ING'"
          >开票</el-button>
          <span v-if="scope.row.status=='YES'">已开票</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="invoiceInfo.size"
      :current-page="invoiceInfo.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
    <!-- 开票弹框 -->
    <!-- <el-dialog title="开票" :visible.sync="dialogFormVisible" append-to-body width="30%">
      <el-form :model="invoiceForm" :rules="rules" ref="invoiceForm">
        <el-form-item label="发票内容：" label-width="120" prop="content">
          <el-input v-model="invoiceForm.content" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="makeOutInvice('invoiceForm')">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/invoiceManageApi";
export default {
  name: `invoiceManage`,
  data() {
    return {
      invoiceInfo: {
        status: ``,
        page: 1,
        size: 10,
        access_token: ``,
        startTime: ``,
        endTime: ``
      },
      timeArr: [],
      invoiceForm: {
        content: ``
      },
      invoiceId: ``,
      total: 0,
      invoiceList: [],
      statusOption: [
        { value: ``, status: "全部" },
        { value: "ING", status: "待处理" },
        { value: "YES", status: "已开票" }
      ],
      dialogFormVisible: false
    };
  },
  activated() {
    this.invoiceInfo.access_token = this.access_token;
    this.getInvoiceList();
  },
  computed: {
    rules() {
      content: [{ required: true, message: "请输入发票内容", trigger: "blur" }];
    },
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    selectTime(arr) {
      if (arr == null) {
        this.timeArr = [];
        this.invoiceInfo.startTime = ``;
        this.invoiceInfo.endTime = ``;
      } else {
        this.invoiceInfo.startTime = arr[0];
        this.invoiceInfo.endTime = arr[1];
      }
    },
    getInvoiceList() {
      let params = this.invoiceInfo;
      http.getInvoiceList({ params }).then(data => {
        console.log(data.data);
        this.invoiceList = data.data.data;
        this.total = data.data.total;
      });
    },
    handleClick(row) {
      // this.invoiceId = row.id
      // this.dialogFormVisible  = true
      console.log(row);
      let invoiceInfo = JSON.stringify(row);
      console.log(invoiceInfo);
      this.$router.push({ name: "invoiceAudit", query: { invoiceInfo } });
    },
    indexMethods(index) {
      return (this.invoiceInfo.page - 1) * this.invoiceInfo.size + index + 1;
    },
    handlePageNumChange(num) {
      this.invoiceInfo.page = num;
      this.getInvoiceList();
    },
    //确定开票
    makeOutInvice(formName) {
      let that = this;
      let params = {
        invoiceId: this.invoiceId,
        access_token: this.access_token,
        content: this.invoiceForm.content,
        status: "YES"
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          http.auditInvoice(params).then(data => {
            console.log(data.data);
            if (data.data.code == 0) {
              that.$message(data.data.desc);
              that.dialogFormVisible = false;
            } else {
              that.$message(`开票失败`);
              that.dialogFormVisible = false;
            }
          });
        } else {
          that.$message.error(`请填写完整信息`);
          return false;
        }
      });
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

