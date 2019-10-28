<template>
  <div id="app">
    <el-container
      style="left:0;top:0;bottom:0;width:100%;position: fixed;overflow-y: scroll;"
      v-loading="menuLoading"
      v-if="isLogin"
    >
      <!--  -->
      <!-- header  -->
      <el-header class="header-wrap">
        <div class="header-title">
          <span class="menu-header">骏路智驾后台管理系统</span>
        </div>
        <div class>
          <!--  -->
          <el-dropdown trigger="click" @command="checkUserInfo">
            <span class="el-dropdown-link">
              <span class="nickname">
                {{userInfo.nickname}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="checkUserInfo" command="userInfo">管理个人资料</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <span class="nickname">{{userInfo.nickname}}</span> -->
          <span @click="logOut" class="cancel">注销</span>
        </div>
      </el-header>
      <!-- 主内容区 -->
      <el-container>
        <!-- 侧边栏导航菜单 -->
        <el-aside class="menu-wrap" style="width:210px;">
          <el-menu
            style="flex: 1"
            :router="true"
            background-color="rgb(54, 65, 80)"
            text-color="#fff"
            active-text-color="#fff"
            @select="selectIndex"
            :unique-opened="true"
            
          >
            <div v-for="item in roleInfoList" :key="item.id">
              <el-submenu :index="item.id+''">
                <template slot="title">
                  <!-- <i class="el-icon-menu"></i> -->
                  <img :src="getImageUrl(item.icon)" class="icon_img" >
                  {{item.name}}
                </template>
                <el-menu-item-group v-for="itemNav in item.children" :key="itemNav.id">
                  <el-menu-item :index="itemNav.id+''" :route="{name:itemNav.eleId}">
                    <i class="el-icon-menu"></i>
                    {{itemNav.name}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </div>
          </el-menu>
        </el-aside>
        <!-- 功能区 -->
        <el-main>
          <transition>
            <keep-alive>
              <router-view v-if="$route.meta.keepalive"></router-view>
            </keep-alive>
          </transition>
          <transition>
            <router-view v-if="!$route.meta.keepalive"></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
    <router-view v-else></router-view>
    <!--  v-else -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import personnelPic from "./assets/images/personnel.png";
import activityPic from "./assets/images/activity.png";
import jianyiPic from "./assets/images/cahngjianwenti.png";
import caozuoPic from "./assets/images/caozuo.png";
import gongzuoliu from "./assets/images/gongzuoliu.png";
import invoicePic from "./assets/images/invoice.png";
import phonePic from "./assets/images/phone.png";
import productPic from "./assets/images/product.png";
import shenhePic from "./assets/images/shenhe.png";
import shujutongjiPic from "./assets/images/shujutongji.png";
import storePic from "./assets/images/store.png";
import swiperPic from "./assets/images/swiper.png";
import tousujianyiPic from "./assets/images/tousujianyi.png";
import zixunPic from "./assets/images/zixun.png";
import orderPic from "./assets/images/orderPic.png";
import helperPic from "./assets/images/tuiguang.png";
import limitPic from "./assets/images/limitPic.png";
import taskManagePic from './assets/images/taskPic.png'
import userPic from './assets/images/user_icon.png'
import disposePic from './assets/images/system_icon.png'

import http from "http/loginApi";
export default {
  name: "App",
  data() {
    return {
      menuLoading: false,
      token: ``,
      personnelPic,
      activityPic,
      jianyiPic,
      caozuoPic,
      gongzuoliu,
      invoicePic,
      phonePic,
      productPic,
      shenhePic,
      shujutongjiPic,
      storePic,
      swiperPic,
      tousujianyiPic,
      zixunPic,
      orderPic,
      helperPic,
      limitPic,
      taskManagePic,
      userPic,
      disposePic
    };
  },
  computed: {
    isLogin() {
      return !!this.access_token;
    },
    ...mapState(`user`, [`access_token`, `userInfo`, `roleInfoList`])
  },
  activated() {
    // this.getMenuList();
    console.log(this)
    this.$nextTick(()=>{
      console.log(this.$refs.insideDomRefAll)
    })
  },
  methods: {
    logOut() {
      this.$router.push({ path: "/login" });
      this.clearToken();
    },
    checkUserInfo(command) {
      console.log(command);
      this.$router.push({ name: command });
    },
    selectIndex(index) {
      console.log(index);
    },
    getMenuList() {
      let params = { access_token: this.access_token };
      http.getMenuList({ params }).then(data => {
        console.log(data.data);
      });
    },
    getImageUrl(imgName){
      let imageSrc = this[imgName]
      return imageSrc
    },
    ...mapMutations(`user`, [`clearToken`])
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.header-wrap {
  max-height: 50px;
  line-height: 50px;
  background-color: #2b3643;
  color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px 0 20px;
}

.menu-header {
  height: 50px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  line-height: 50px;
}

.menu-wrap {
  width: 210px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.cancel {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
.icon_img {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}
.nickname {
  padding-right: 20px;
  font-size: 13px;
  cursor: pointer;
  color: #fff;
}
.el-menu-item {
}
.el-menu--inline {
}
</style>