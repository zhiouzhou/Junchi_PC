<template>
  <div id="userInfo">
    <h3>用户信息</h3>
    <div class="user-info-content">
      <span>注册时间：</span>
      <span>{{userInfo.gmtCreate}}</span>
    </div>
    <div class="user-info-content">
      <div class="content">
        <span>用户名：</span>
        <span>{{userInfo.nickname}}</span>
      </div>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:20px;"
        @click="editUser('nickName')"
      >修改</el-button>
    </div>
    <div class="user-info-content">
      <div class="content">
        <span>会员号：</span>
        <span>{{userInfo.memberId}}</span>
      </div>
    </div>

    <div class="user-info-content">
      <div class="content">
        <span>绑定手机号：</span>
        <span>{{userInfo.mobile}}</span>
      </div>
      <el-button type="primary" size="mini" style="margin-left:20px;" @click="editUser('mobile')">修改</el-button>
    </div>
    <div class="user-info-content">
      <div class="content">
        <span>绑定邮箱：</span>
        <span>{{userInfo.email}}</span>
      </div>
      <el-button type="primary" size="mini" style="margin-left:20px;" @click="editUser('email')">修改</el-button>
    </div>
    <div class="user-info-content">
      <!-- <div class="content">
        <span>登录密码：</span>
        <span>{{userInfo.email}}</span>
      </div> -->
      <el-button type="primary" size="mini" @click="editUser('password')">修改登录密码</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: `userInfo`,
  data() {
    return {};
  },
  computed: {
    ...mapState(`user`, [`access_token`, `userInfo`])
  },
  methods: {
    editUser(type) {
      this.$router.push({name:`editUserInfo`,query:{pageType:type}})
    }
  }
};
</script>
<style lang="stylus" scoped>
.user-info-content {
  line-height: 58px;
  display: flex;
  align-items: center;
}

.user-info-content>span {
  display: block;
  margin-right: 14px;
}

.content {
  display: flex;
  align-items: center;
}
</style>