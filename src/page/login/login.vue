<template>
  <div class="header">
    <div class="container">
      <div style="display:flex;align-items:center;margin-bottom:30px">
        <img :src="logopic" />
        <h3 class="header-title">骏路智驾后台管理系统</h3>
      </div>
      <el-form
        :model="ruleForm2"
        :rules="rules2"
        ref="ruleForm2"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <div class="title">用户登录</div>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm2.checkPass"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from "http/loginApi";
import { mapState, mapMutations, mapActions } from "vuex";
import logopic from "../../assets/images/logo.png";
import bgPic from "../../assets/images/bg.jpg";
export default {
  data() {
    return {
      logopic,
      bgPic,
      logining: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    handleSubmit2(ev) {
      var _this = this;
      // console.log(this.$route.query.redirect.split('?')[0])
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true;
          var loginParams = {
            account: this.ruleForm2.account,
            password: this.ruleForm2.checkPass
          };
          http
            .login(loginParams)
            .then(data => {
              _this.logining = false;
              // console.log(data.data.data);
              // if(data.data.data.role!='ROLE_admin'){

              // }
              console.log(data.data);

              if (data.data.code == 0) {
                let roleArr = data.data.data.role.split(",");
                if (roleArr.indexOf("ROLE_admin") == -1) {
                  this.$message(`您还不是管理员，暂时不能登录！`);
                  return;
                }
                this.setRole(roleArr);
                this.setToken(data.data.data.access_token);
                this.getUserInfo(data.data.data.access_token);
                this.getMenuList(data.data.data.access_token);
                if (
                  roleArr.indexOf("ROLE_af-jl") != -1 ||
                  roleArr.indexOf("ROLE_af-zg") != -1 ||
                  roleArr.indexOf("ROLE_af-zy") != -1
                ) {
                  this.$router.replace({ name: "comAndSug" }); //正常登录流程进入的页面
                } else if (
                  this.$route.query.redirect &&
                  this.$route.query.redirect.split("?")[0] == "/login"
                ) {
                  this.$router.replace({ name: "storeManage" }); //正常登录流程进入的页面
                } else if (this.$route.query.redirect) {
                  console.log(this.$route.query.redirect);
                  this.$router.push({
                    path: decodeURIComponent(this.$route.query.redirect)
                  }); //跳转到原页面
                } else {
                  this.$router.replace({ name: "storeManage" }); //正常登录流程进入的页面
                }
              } else {
                console.log(data.data);
                this.$message(data.data.desc);
                this.$router.redirect({ name: "login" });
              }
            })
            .catch(e => {
              // console.log(e)
              // _this.loading = false;
              // this.$message(`登录失败，请重新登录`);
            });
        } else {
          console.log("error submit!!");
          this.$message(`请输入账号或密码`);
          return false;
        }
      });
    },
    getMenuList(token) {
      let params = { access_token: token };
      http
        .getMenuList({ params })
        .then(data => {
          //拿到菜单的原始数据的时候做一下修改，每个子菜单新增一个路由字段
          let resultMenuList = data.data.data.children;
          this.setRoleInfoList(resultMenuList);
          // this.updateRoleInfoList(resultMenuList)
        })
        .catch(e => {
          console.log(e);
        });
    },
    getUserInfo(token) {
      let params = { access_token: token, memberId: `` };
      http.getUserInfo({ params }).then(data => {
        console.log(data.data.data);
        this.setUserInfo({ userInfo: JSON.stringify(data.data.data) });
        // this.updateUserInfo(data.data.data)
      });
    },
    ...mapMutations(`user`, [
      `setToken`,
      `setUserInfo`,
      `setRoleInfoList`,
      `setRole`
    ]),
    ...mapActions(`user`, [`updateUserInfo`])
  }
};
</script>
<style scoped>
.header {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

.header-title {
  color: #fff;
  margin: 0;
  margin-left: 12px;
  font-size: 33px;
}

.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;

  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 6px #cac6c6;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #666;
}

.remember {
  margin: 0px 0px 35px 0px;
}
</style>