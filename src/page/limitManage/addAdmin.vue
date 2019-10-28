<template>
  <div id="addAdmin">
    <div class="search">
      <el-input placeholder="输入会员号/手机号" prefix-icon="el-icon-search" v-model="account"></el-input>
      <el-button type="primary" @click="searchAdmin">搜索</el-button>
    </div>
    <div class="admin" v-if="isEmpty">
      <div class="admin-info">
        <img :src="adminInfo.headPic?adminInfo.headPic:personnelPic" alt class="headPic">
        <div>
          <p>{{adminInfo.nickname}}</p>
          <p>{{adminInfo.memberId}}</p>
        </div>
      </div>
      <el-button type="primary" @click="addRole(adminInfo.memberId)" size="mini">添加角色</el-button>
    </div>
    <!-- 修改角色弹框 -->
    <el-dialog
      title="更改角色"
      :visible.sync="dialogVisible"
      width="40%"
      :append-to-body="true"
    >
      <div class="roleList" v-for="item in roleList" :key="item.id">
        <el-radio v-model="radio" :label="item.code" @change="onRadioChange">{{item.name}}</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/limitManageApi";
import personnelPic from "../../assets/images/ic-touxiang@2x.png";
export default {
  data() {
    return {
      account: ``,
      adminInfo: {},
      personnelPic: personnelPic,
      isEmpty: false,
      roleList: [],
      dialogVisible: false,
      radio: "1",
      selectMemberId:``,
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.getRoleList();
  },
  methods: {
    searchAdmin() {
      if (!this.account) {
        this.$message(`请输入手机号或会员号`);
        return;
      }
      let params = { access_token: this.access_token, account: this.account };
      http.getAdmin({ params }).then(data => {
        if (data.data.code == 0) {
          this.adminInfo = data.data.data;
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      });
    },
    addRole(memberId) {
      console.log(memberId);
      this.selectMemberId = memberId
      this.dialogVisible = true
    },
    getRoleList() {
      let params = { access_token: this.access_token };
      http.getRoleList({ params }).then(data => {
        if (data.data.code == 0) {
          this.roleList = data.data.data;
        }
      });
    },
    editRoleSure() {
      let params = {
        access_token: this.access_token,
        roleCode: this.selectCode,
        memberId: this.selectMemberId
      };
      http.addAdmin(params).then(data => {
        if (data.data.code == 0) {
          this.$message(`新增成功`);
          this.dialogVisible = false;
          this.$router.go(-1)
        } else {
          this.$message(data.data.desc);
        }
      });
    },
    onRadioChange(item) {
      console.log(item);
      this.selectCode = item;
    }
  }
};
</script>
<style lang="stylus" scoped>
#addAdmin {
  .search {
    display: flex;
    align-items: center;
  }

  .el-input {
    width: 50%;
    margin-right: 20px;
  }

  .admin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 58%;
  }

  .admin-info {
    display: flex;
    align-items: center;
  }

  .headPic {
    width: 58px;
    height: 58px;
    border-radius: 50px;
    margin-right: 20px;
  }
}
</style>

