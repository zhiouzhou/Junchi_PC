<template>
  <div id="userList">
    <!-- 表格 -->
    <el-form
      :inline="true"
      :model="userForm"
      size="medium"
      label-width="120px"
      label-suffix="："
      class="demo-form-inline"
      ref="userForm"
    >
      <el-form-item label="会员号/手机号">
        <el-input v-model="userForm.account" placeholder="请输入会员号或手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="员工类型">
        <el-select v-model="userForm.innerSales" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.user"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="userList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="54">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="注册时间"></el-table-column>
      <el-table-column prop="stationLocation" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.headPic" alt style="width:100px;height:100px;" />
        </template>
      </el-table-column>
      <el-table-column prop="memberId" label="会员号"></el-table-column>
      <el-table-column prop="nickname" label="用户名"></el-table-column>
      <el-table-column prop="mobile" label="电话号码"></el-table-column>
      <el-table-column label="用户角色">
        <template slot-scope="scope">
          <span
            v-for="(item,index) in scope.row.role"
            :key="index"
            style="display:block;"
          >{{item=='ROLE_user'?'普通用户':item=='ROLE_station'?'门店':item=='ROLE_technician'?'技工':item=='ROLE_admin'?'管理员':''}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="checkSupAndSub(scope.row,'checked')" type="text" size="small">查看上下级</el-button>
          <el-button
            @click="addOrDeleteSale(scope.row,'checked')"
            type="text"
            size="small"
          >{{scope.row.innerSales?'移除内部销售':'添加内部销售'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="userForm.size"
      :current-page="userForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/trendApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      userForm: {
        page: 1,
        size: 10
      },
      userList: [],
      total: 0,
      typeOptions: [
        {
          value: true,
          user: "内部员工"
        },
        {
          value: false,
          user: "非内部员工"
        }
      ]
    };
  },
  //  components: {
  //     pagination
  //  },
  activated() {
    this.userForm.access_token = this.access_token;
    this.getUserList();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    getUserList() {
      let params = this.userForm;
      http.getUserList({ params }).then(data => {
        console.log(data.data);
        if (data.data.code == 0) {
          this.userList = data.data.data;
          this.total = data.data.total;
        }
      });
    },
    // 分页操作
    handlePageNumChange(num) {
      this.userForm.page = num;
      this.getUserList();
    },
    indexMethods(index) {
      return (this.userForm.page - 1) * this.userForm.size + index + 1;
    },
    checkSupAndSub(row) {
      this.$router.push({ name: `tree`, query: { memberId: row.memberId } });
    },
    //移除或者添加销售人员
    addOrDeleteSale(row) {
      let params = { innerSales: row.innerSales ? false : true };
      let memberId = row.memberId;
      let access_token = this.access_token
      this.$confirm(
        `此操作将此用户${
          row.innerSales ? "移除内部员工" : "添加为内部员工"
        },内部销售员工不能提现，是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          http.setSalesStaff(params, memberId, access_token).then(data => {
            console.log(data);
            if (data.data.code == 0) {
              this.$message({
                type: "success",
                message: data.data.desc
              });
            }
            this.getUserList()
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
#userList {
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>