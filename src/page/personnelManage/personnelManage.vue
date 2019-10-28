<template>
  <div id="personnelManage">
    <el-form
      :inline="true"
      :model="userInfo"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="userInfo"
    >
      <el-form-item label="身份证号">
        <el-input v-model="userInfo.cardId" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userInfo.techName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="userInfo.sex" clearable>
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.sex"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="userInfo.techPhone" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="门店">
        <el-select v-model="userInfo.stationId" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in storeOptions"
            :key="item.stationId"
            :label="item.stationName"
            :value="item.stationId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="getDealerList" size="medium">查询</el-button>
      <!-- <el-button type="info" @click="resetForm" style="margin-left:40px;" size="medium">重置</el-button> -->
    </div>
    <el-button size="medium" style="margin-top:14px;" type="primary" @click="addUser">新增技术人员</el-button>
    <!-- 表格 -->
    <el-table :data="technicianList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="techId" label="会员标识"></el-table-column>
      <el-table-column prop="cardId" label="身份证号"></el-table-column>
      <el-table-column prop="techName" label="名称"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex==0?'男':'女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="techPhone" label="联系方式"></el-table-column>
      <el-table-column prop="techAddress" label="地址"></el-table-column>
      <el-table-column prop="certificateNo" label="证书编号"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="editPersonnel(scope.row,'checked')" type="text" size="small">编辑</el-button>
          <el-button @click="deletePersonel(scope.row,'checked')" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="userInfo.size"
      :current-page="userInfo.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/personnelApi";
export default {
  data() {
    return {
      userInfo: {
        cardId: null, //身份证号
        techName: null, //姓名
        sex: null, //性别 0为男  1为女
        techPhone: null, //联系方式
        stationId: null, //门店
        page: 1,
        size: 10,
        access_token: `` //TODO 登錄之後才能拿到
      },
      total: 0,
      technicianList: [],
      sexOptions: [
        {
          value: 0,
          sex: "男"
        },
        {
          value: 1,
          sex: "女"
        }
      ],
      storeOptions: []
    };
  },
  activated() {
    this.userInfo.access_token = this.access_token;
    this.getDealerList();
    this.getStoreList();
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    getDealerList() {
      let params = this.userInfo;
      http.getPersonnelList(params).then(data => {
        console.log(data);
        this.technicianList = data.data.data;
        this.total = data.data.total;
      });
    },
    //获取下拉门店列表
    getStoreList() {
      console.log();
      let params = { page: 1, size: 0, access_token: this.access_token };
      http.storeList({ params }).then(data => {
        console.log(data);
        this.storeOptions = data.data.data;
      });
    },
    resetForm() {
      this.userInfo = {
        cardId: null, //身份证号
        techName: null, //姓名
        sex: null, //性别 0为男  1为女
        techPhone: null, //联系方式
        stationId: null, //门店
        page: 1,
        size: 10,
        access_token: this.access_token //TODO 登錄之後才能拿到
      };
    },
    handleClick(row) {},
    //新增技术人员
    addUser() {
      this.$router.push({ name: `addPersonnel`,query:{pageType:`add`} });
    },
    //编辑技术人员
    editPersonnel(row){
      let personnelInfo = {
        cardId: row.cardId, //身份证号
        techName: row.techName, //姓名
        sex: row.sex, //性别
        techPhone: row.techPhone, //电话
        techAddress: row.techAddress, //地址
        certificateNo: row.certificateNo, //证书编号
        techId:row.techId,
        access_token: this.access_token
      }
      this.$router.push({name:`addPersonnel`,query:{personnelInfo:JSON.stringify(personnelInfo),pageType:'edit'}})
    },
    indexMethods(index) {
      return (this.userInfo.page - 1) * this.userInfo.size + index + 1;
    },
    handlePageNumChange(num) {
      this.userInfo.page = num;
      this.getDealerList();
    },
    deletePersonel(row){
      let that = this
      let params = {access_token:this.access_token,id:row.id}
      this.$confirm("此操作将删除该技术人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deletePersonnel({ params })
            .then(data => {
                console.log(data.data.code)
              if (data.data.code == 0) {
                that.$message(data.data.desc);
                that.technicianList = this.technicianList.filter(item => {
                  return item.id != row.id;
                });
                that.getDealerList();
              } else {
                this.$message(data.data.desc);
              }
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
#personnelManage {
  .el-form {
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input {
    width: 250px;
  }

  .el-select {
    width: 250px;
  }

  .query-btn {
    text-align: center;
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }

  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>