<template>
  <div id="addHelper">
    <el-form
      class="content"
      :model="helperForm"
      ref="helperForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="推广图片" prop="swiperImgs">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :data="formData"
          :action="actions"
          :on-remove="handleSwiperRemove"
          :show-file-list="true"
          :file-list="imageUrl"
          :on-success="handleAvatarSuccessSwiper"
          :before-upload="beforeAvatarUploadSwiper"
        >
          <!-- <i class="el-icon-plus"></i> -->
          <!-- <img v-if="swiperImgUrl" :src="swiperImgUrl" class="avatar"> -->
          <!-- <div> -->

          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">图片格式为550*900，右下角预留小程序码位置191*196，不可有内容，否则会遮挡。</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('helperForm')">提交</el-button>
        <!-- <el-button @click="resetForm('productForm')">重置</el-button> -->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/swiperManageApi";
import https from "http/helperApi";

import { mapState } from "vuex";
import axios from "axios";
// let baseUrl = `https://jc.tieyan.top/`;
export default {
  data() {
    return {
      helperForm: {
        imageKeys: [],
        access_token: ``
      },
      actions: `https://up.qiniup.com`,
      qiniuaddr: "pd6rnk9ck.bkt.clouddn.com",
      formData: {
        token: ``
      },
      imageUrl: []
    };
  },
  computed: {
    rules() {
      return {
        swiperImgs: [
          { required: true, message: "请上传推广图片", trigger: "change" }
        ]
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.helperForm.access_token = this.access_token;
  },
  methods: {
    // 上传推广图片之前
    beforeAvatarUploadSwiper(file) {
      // console.log(file,fileList)
      console.log("file", file);
      // console.log("fileList", fileList);
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let swiperImgs = [];
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 550;
        let height = 900;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return http.getUploadToken({ params }).then(data => {
            console.log(data.data.data.token);
            _this.formData = { token: data.data.data.token };
            _this.helperForm.imageKeys.push(data.data.data.key);
          });
        },
        () => {
          this.productLoading = false;
          _this.$message("上传的图片必须是等于550*900！");
          return Promise.reject();
        }
      );
      return isSize;
    },
    // 上传轮播图成功之后
    handleAvatarSuccessSwiper(res, file) {
      // this.swiperImgUrl = res.payload.url;
      this.imageUrl.push({ url: res.payload.url });
      this.$message(`上传成功`);
    },
    // 移除图片
    handleSwiperRemove(file, fileList) {
      console.log(file, fileList);
      //   this.productForm.swiperImgs.forEach((item, index) => {
      //     if (item.url == file.url) {
      //       this.productForm.swiperImgs.splice(index, 1);
      //     }
      //   });
    },
    submitForm() {
      https.addHelper(this.helperForm).then(data => {
        console.log(data.data);
        if (data.data.code == 0) {
          this.$message(data.data.desc);
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>