<template>
  <div id="limitManage">
    <!-- <el-table :data="subsList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="58">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="techId" label="会员标识"></el-table-column>
    </el-table>-->
    <h4>权限管理</h4>
    <el-button type="primary" @click="addUser" size="mini" style="margin-bottom:20px;">添加管理员</el-button>
    <el-collapse style="width:80%;">
      <el-collapse-item v-for="(item,index) in subsList" :key="index" :title="item.adminRole.name">
        <div v-for="items in item.admins" :key="items.adminId" class="userContent">
          <div class="userInfo">
            <img :src="items.headPic||personnelPic" alt="用户头像" class="userImg">
            <p style="display:flex;flex-direction:column;">
              <span>{{items.nickname}}</span>
              <span>{{items.memberId}}</span>
            </p>
          </div>
          <div>
            <el-button type="primary" @click="deleteRole(items.memberId)" size="mini">删除</el-button>
            <el-button type="primary" @click="editRole(items.adminId)" size="mini">更改角色</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
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
import personnelPic from "../../assets/images/ic-touxiang@2x.png";
import { mapState } from "vuex";
import http from "http/limitManageApi";
export default {
  data() {
    return {
      subsList: [],
      personnelPic: personnelPic,
      dialogVisible: false,
      roleList: [],
      selectAdminId: ``,
      radio: "1",
      selectCode: ``
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.getSubsList();
    this.getRoleList();
  },
  methods: {
    indexMethods(index) {
      return index + 1;
    },
    getSubsList() {
      let params = { access_token: this.access_token };
      http.getSubsList({ params }).then(data => {
        console.log(data.data.data);
        if (data.data.code == 0) {
          this.subsList = data.data.data;
        }
      });
    },
    getRoleList() {
      let params = { access_token: this.access_token };
      http.getRoleList({ params }).then(data => {
        if (data.data.code == 0) {
          this.roleList = data.data.data;
        }
      });
    },
    editRole(adminId) {
      console.log(adminId);
      this.dialogVisible = true;
      this.selectAdminId = adminId;
    },
    editRoleSure() {
      let params = {
        access_token: this.access_token,
        roleCode: this.selectCode,
        adminId: this.selectAdminId
      };
      http.editRole(params).then(data => {
        if (data.data.code == 0) {
          this.$message(`修改成功`);
          this.dialogVisible = false;
          this.getSubsList();
        } else {
          this.$message(`修改失败，请重试！`);
        }
      });
    },
    onRadioChange(item) {
      console.log(item);
      this.selectCode = item;
    },
    addUser() {
      this.$router.push({ name: "addAdmin" });
    },
    //删除
    deleteRole(memberId) {
      let params = { access_token: this.access_token, memberId: memberId };
      console.log(params)
      let that = this
      this.$confirm("您确定删除该管理员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
            http.deleteRole(params).then(data=>{
                if(data.data.code==0){
                    that.$message(`删除成功`)
                    this.getSubsList()
                }else {
                    that.$message(`删除失败`)
                }
            })
        })
        .catch(() => {

        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.userImg {
  width: 60px;
  height: 60px;
  border-radius: 50px;
  margin-right: 20px;
}

.userContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.userInfo {
  display: flex;
  align-items: center;
}
</style>