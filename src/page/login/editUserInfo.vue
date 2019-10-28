<template>
  <div id="addPersonnel">
    <el-form
      class="content"
      :model="personnelForm"
      ref="personnelForm"
      label-width="100px"
      label-suffix="："
      size="medium"
    >
      <el-form-item label="昵称" v-if="pageType=='nickName'">
        <el-input v-model.trim="personnelForm.nickname" placeholder="请输入您的新昵称"></el-input>
      </el-form-item>
      <el-form-item label="新手机号" v-if="pageType=='mobile'">
        <el-input
          v-model.trim="personnelForm.mobile"
          placeholder="请输入新手机号码"
          style="margin-right:24px;"
        ></el-input>
        <el-button
          type="primary"
          round
          size="mini"
          @click="getCode"
          :disabled="personnelForm.mobile?false:true"
        >获取手机验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码" v-if="pageType=='mobile'">
        <el-input v-model.trim="personnelForm.smsCode" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" v-if="pageType=='email'">
        <el-input
          v-model.trim="personnelForm.email"
          placeholder="请输入新邮箱"
          style="margin-right:24px;"
        ></el-input>
        <el-button
          type="primary"
          round
          size="mini"
          @click="getEmailCode"
          :disabled="personnelForm.email?false:true"
        >获取邮箱验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码" v-if="pageType=='email'">
        <el-input v-model.trim="personnelForm.emailCode" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <!-- 设置登录密码 -->
      <el-form-item label="登录密码" v-if="pageType=='password'&&!userInfo.hasPassword">
        <el-input v-model.trim="personnelForm.newPass" type="password" placeholder="请输入您的登录密码"></el-input>
      </el-form-item>
      <el-form-item label="旧密码" v-if="pageType=='password'&&userInfo.hasPassword">
        <el-input v-model.trim="personnelForm.oldPass" type="password" placeholder="请输入您的旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" v-if="pageType=='password'&&userInfo.hasPassword">
        <el-input v-model.trim="personnelForm.newPass" type="password" placeholder="请输入您的新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <!-- <el-button @click="resetForm('personnelForm')">重置</el-button> -->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/loginApi";
import { mapState,mapMutations } from "vuex";
export default {
  data() {
    return {
      personnelForm: {
        access_token: ``,
        memberId: ``
      },
      pageType: ``
    };
  },
  activated() {
    this.personnelForm.access_token = this.access_token;
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
    this.personnelForm.memberId = this.userInfo.memberId;
  },
  methods: {
    getCode() {
      let mobile = this.personnelForm.mobile;
      http.getCode({ params: { mobile } }).then(data => {
        if (data.data.code == 0) {
          this.$message(`已发送验证码`);
          this.personnelForm.codeId = data.data.data.codeId;
        } else {
          this.$message(`发送失败，请稍后再试！`);
        }
      });
    },
    getEmailCode() {
      let email = this.personnelForm.email;
      http.getEmailCode({ params: { email } }).then(data => {
        if (data.data.code == 0) {
          this.$message(`已发送验证码`);
          this.personnelForm.codeId = data.data.data.codeId;
        } else {
          this.$message(`发送失败，请稍后再试！`);
        }
      });
    },
    submitForm() {
      let { personnelForm } = this;
      let that = this;
      let userInfo = this.userInfo
      if (this.pageType == "nickName") {
        http.editNickName(personnelForm).then(data => {
          if (data.data.code == 0) {
            this.$message(data.data.desc);
            userInfo.nickname = personnelForm.nickname
            this.setUserInfo({userInfo:JSON.stringify(userInfo)})
            this.$router.go(-1);
          } else {
            this.$message(data.data.desc);
          }
        });
      } else if (this.pageType == "mobile") {
        http.editMobile(personnelForm).then(data => {
          console.log(data);
          if (data.data.code == 0) {
            this.$message(data.data.desc);
             userInfo.nickname = personnelForm.mobile
            this.setUserInfo({userInfo:JSON.stringify(userInfo)})
            this.$router.go(-1);
          } else {
            this.$message(data.data.desc);
          }
        });
      } else if (this.pageType == "email") {
        http.editEmail(personnelForm).then(data => {
          if (data.data.code == 0) {
            this.$message(data.data.desc);
             userInfo.nickname = personnelForm.email
            this.setUserInfo({userInfo:JSON.stringify(userInfo)})
            this.$router.go(-1);
          } else {
            this.$message(data.data.desc);
          }
        });
      } else if (this.pageType == "password") {
        http.editPassword(personnelForm).then(data => {
          if (data.data.code == 0) {
            this.$message(data.data.desc);
            this.$router.go(-1);
          } else {
            this.$message(data.data.desc);
          }
        });
      }
    },
    ...mapMutations(`user`,[`setUserInfo`])
  },
  computed: {
    rules() {
      return {
        cardId: [
          { required: true, message: "请输入身份证号", trigger: "blur" }
        ],
        techName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        techPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        techAddress: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ],
        certificateNo: [
          { required: true, message: "请输入证书编号", trigger: "blur" }
        ]
      };
    },
    ...mapState(`user`, [`access_token`, `userInfo`])
  }
};
</script>
<style lang="stylus">
#addPersonnel {
  .el-form {
    margin-top: 40px;
    width: 50%;
  }

  .el-select {
    width: 100%;
  }

  .el-cascader {
    width: 100%;
  }

  .el-form-item__content {
    display: flex !important;
    align-items: center !important;
  }
}
</style>