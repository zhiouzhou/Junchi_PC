<template>
  <div class="approvalDetail">
    <div class="typeName">审核类型：{{typeName}}</div>
    <el-steps
      align-center
      process-status="wait"
      style="margin-top:40px"
      v-if="stepList||stepList.length!=0"
    >
      <el-step
        v-for="(item,index) in stepList"
        :key="index"
        :status="active==index?'finish':'wait'"
        :title="item.roleName"
        @click.native="deleteRole(item.roleId,item.typeId,index)"
      ></el-step>
    </el-steps>
    <div class="scope-btn">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="dialogVisible = true"
      >点击添加审核阶段</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="deleteAuditRole"
      >点击删除选中阶段之后的内容</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :modal-append-to-body="false"
    >
      <el-form :model="departForm">
        <el-form-item label="选择部门">
          <el-select v-model="departForm.code" @change="selectDepartment">
            <el-option
              v-for="item in departOptions"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select
            v-model="roleForm.roleId"
            @change="selectRole"
            :disabled="departForm.code?false:true"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/approvalManageApi";
export default {
  data() {
    return {
      active: null,
      stepList: [],
      typeName: ``,
      dialogVisible: false,
      roleForm: {
        roleId: ``, //角色标识
        roleName: ``, //角色名
        typeId: ``, //审核类型id
        access_token:``
      },
      departForm: { code: ``, name: `` },
      departOptions: [
        {
          code: `operation`,
          name: `运营部`
        }
      ],
      roleOptions: [],
      approvalInfo: {},
      selectRoleId: ``,
      selectTypeId: ``
    };
  },
  activated() {
    let typeName = this.$route.query.typeName;
    let typeId = this.$route.query.typeId;
    this.typeName = typeName;
    this.roleForm.typeId = typeId;
    this.roleForm.access_token = this.access_token;
    // this.getDepartList();
    this.getApprovalDetail(typeId);
  },
  methods: {
    handleClose(done) {
      done();
    },
    cancel() {
      this.roleForm = {
        roleId: ``, //角色标识
        roleName: ``, //角色名
        typeId: `` //审核类型id
      };
      (this.departForm = { code: ``, name: `` }), (this.dialogVisible = false);
    },
    addRole() {
      let params = this.roleForm;
      http.addAuditRole(params).then(data => {
        if (data.data.code == 0) {
          this.$message(`添加成功`);
          this.dialogVisible = false;
          console.log(params);
          this.stepList.push(params);
          console.log(this.stepList);
          this.roleForm = {
            roleId: ``, //角色标识
            roleName: ``, //角色名
            typeId: this.$route.query.typeId, //审核类型id
            access_token:this.access_token
          };
          this.departForm = { code: ``, name: `` };
        } else {
          this.$message(data.data.desc);
        }
      });
    },
    getApprovalDetail(typeId) {
      let params = { typeId, access_token: this.access_token };
      http.getAuditDetail({ params }).then(data => {
        console.log(data.data);
        if (data.data.code == 0) {
          let arr = data.data.data.typeRoleDTOS.filter(item => {
            return (item.status = "wait");
          });
          this.stepList = arr;
        }
      });
    },
    getDepartList() {
      let params = { access_token: this.access_token };
      // http.getDepartList({ params }).then(data => {
      //   this.departOptions = data.data.data;
      // });
    },
    selectDepartment(code) {
      // this.departForm.code = code
      let params = { access_token: this.access_token, groupCode: code };
      http.getRoleList({ params }).then(data => {
        this.roleOptions = data.data.data;
      });
    },
    selectRole(code) {
      console.log(code);
      let obj = {};
      obj = this.roleOptions.find(item => {
        return item.code == code;
      });
      this.roleForm.roleId = obj.code;
      this.roleForm.roleName = obj.name;
    },
    deleteRole(roleId, typeId, index) {
      // let params = {roleId,typeId}
      // http.deleteAuditRole({params}).then(data=>{
      //     if(data.data.code==0){
      //         this.$message(`删除成功`)
      //     }
      // })
      this.selectRoleId = roleId;
      this.selectTypeId = typeId;
      this.active = this.active == null ? index : null;
    },
    //删除选中阶段
    deleteAuditRole() {
      let params = {
        roleId: this.selectRoleId,
        typeId: this.selectTypeId,
        access_token: this.access_token
      };

      console.log(params);
      if (!this.selectRoleId || !this.selectTypeId || this.active == null) {
        this.$message(`请选择需要删除的角色`);
        return false;
      }
      http.deleteAuditRole({ params }).then(data => {
        if (data.data.code == 0) {
          this.$message(`删除成功`);
          this.active = null;
          this.getApprovalDetail(this.roleForm.typeId);
        }
      });
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  }
};
</script>
<style lang="stylus" scoped>
.scope-btn >.el-button {
  margin: 20px 40px;
  display: block;
}
</style>