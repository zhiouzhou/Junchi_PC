<template>
  <div>
    <el-form
      class="content"
      :model="productForm"
      ref="productForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model.trim="productForm.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商品型号" prop="model">
        <el-input v-model.trim="productForm.model" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商品原价" prop="originPrice">
        <el-input v-model.trim="productForm.originPrice" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商品现价" prop="currentPrice">
        <el-input v-model.trim="productForm.currentPrice" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model.trim="productForm.stock" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="销售佣金" prop="profit.upper1LevelProfit">
        <el-input v-model.trim="productForm.profit.upper1LevelProfit" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="管理佣金" prop="profit.upper2LevelProfit">
        <el-input v-model.trim="productForm.profit.upper2LevelProfit" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="门店佣金" prop="profit.stationEarning">
        <el-input v-model.trim="productForm.profit.stationEarning" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="技工佣金" prop="profit.techEarning">
        <el-input v-model.trim="productForm.profit.techEarning" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="商品缩略图" prop="goodsImg" class="productImg">
        <!-- <el-input v-model.trim="swiperForm.imageUrl" placeholder="请输入"></el-input> -->
        <el-upload
          v-loading="productLoading"
          element-loading-text="正在上传图片"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.5)"
          class="avatar-uploader"
          :data="formData"
          :action="actions"
          :show-file-list="false"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccessProduct"
          :before-upload="beforeAvatarUploadProduct"
        >
          <!-- <i class="el-icon-plus"></i> -->
          <img v-if="productForm.goodsImg" :src="productForm.goodsImg" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">图片格式为242*242</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品轮播图" prop="swiperImgs">
        <!-- <el-input v-model.trim="swiperForm.imageUrl" placeholder="请输入"></el-input> -->
        <!-- <img v-for="item,index in productForm.swiperImgs" :key="index" v-if="productForm.swiperImgs" :src="item"
        class="avatar" />-->
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :data="formData"
          :action="actions"
          :on-remove="handleSwiperRemove"
          :show-file-list="true"
          :file-list="productForm.swiperImgs"
          :on-success="handleAvatarSuccessSwiper"
          :before-upload="beforeAvatarUploadSwiper"
        >
          <!-- <i class="el-icon-plus"></i> -->
          <!-- <img v-if="swiperImgUrl" :src="swiperImgUrl" class="avatar"> -->
          <!-- <div> -->

          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">图片格式为750*750</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情图" prop="detailImgs">
        <!-- <el-input v-model.trim="swiperForm.imageUrl" placeholder="请输入"></el-input> -->
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :data="formData"
          :action="actions"
          :on-remove="handleDetailRemove"
          :show-file-list="true"
          :file-list="productForm.detailImgs"
          :on-success="handleAvatarSuccessDetail"
          :before-upload="beforeAvatarUploadDetail"
        >
          <!-- <i class="el-icon-plus"></i> -->
          <!-- <img v-if="swiperImgUrl" :src="swiperImgUrl" class="avatar"> -->
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">图片格式宽为750px</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('productForm')">提交</el-button>
        <!-- <el-button @click="resetForm('productForm')">重置</el-button> -->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/swiperManageApi";
import https from "http/productManageApi";

import { mapState } from "vuex";
export default {
  name: `addProduct`,
  data() {
    return {
      productForm: {
        access_token: ``,
        swiperImgs: [],
        detailImgs: [],
        profit: {}
      },
      pageType: ``,
      // productDialogVisible: false,
      productLoading: false,
      productImgUrl: ``,
      swiperImgUrl: ``,
      actions: `https://up.qiniup.com`,
      qiniuaddr: "pd6rnk9ck.bkt.clouddn.com",
      formData: {
        token: ``
      }
    };
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        model: [{ required: true, message: "请输入商品型号", trigger: "blur" }],
        originPrice: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        currentPrice: [
          { required: true, message: "请输入商品现价", trigger: "blur" }
        ],
        stock: [{ required: true, message: "请输入库存数量", trigger: "blur" }],
        goodsImg: [
          { required: true, message: "请上传商品缩略图", trigger: "change" }
        ],
        swiperImgs: [
          { required: true, message: "请上传商品轮播图", trigger: "change" }
        ],
        detailImgs: [
          { required: true, message: "请上传商品详情图", trigger: "change" }
        ],
        "profit.upper1LevelProfit": [
          { required: true, message: "请输入销售佣金", trigger: "blur" }
        ],
        "profit.upper2LevelProfit": [
          { required: true, message: "请输入管理佣金", trigger: "blur" }
        ],
        "profit.stationEarning": [
          { required: true, message: "请输入门店佣金", trigger: "blur" }
        ],
        "profit.techEarning": [
          { required: true, message: "请输入技工佣金", trigger: "blur" }
        ]
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.pageType = this.$route.query.pageType;
    this.productForm.access_token = this.access_token;
    if (this.$route.query.pageType == "edit") {
      let swiperArr = [],
        detailArr = [];

      this.productForm = JSON.parse(this.$route.query.productInfo);
      this.productForm.currentPrice = this.productForm.currentPrice;
      this.productForm.originPrice = this.productForm.originPrice;
      if (JSON.parse(this.$route.query.productInfo).profit) {
        this.productForm.profit.upper1LevelProfit = this.productForm.profit.upper1LevelProfit;
        this.productForm.profit.upper2LevelProfit = this.productForm.profit.upper2LevelProfit;
        this.productForm.profit.stationEarning = this.productForm.profit.stationEarning;
        this.productForm.profit.techEarning = this.productForm.profit.techEarning;
      }else {
        this.productForm.profit = {}
      }

      this.productForm.swiperImgs.forEach(item => {
        swiperArr.push({ url: item.url });
      });
      this.productForm.detailImgs.forEach(item => {
        detailArr.push({ url: item.url });
      });
      this.productForm.swiperImgs = swiperArr;
      this.productForm.detailImgs = detailArr;
    }
  },
  methods: {
    //上传商品略缩图之前
    beforeAvatarUploadProduct(file) {
      console.log("file", file);
      // console.log("fileList", fileList);
      this.productLoading = true;
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        this.productLoading = false;
        return false;
      }
      // return
      // const isLt2M = file.size / 1024 / 1024 < 2;
      const isSize = new Promise(function(resolve, reject) {
        let width = 242;
        let height = 242;
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
            // _this.productForm.goodsImg = data.data.data.key;
          });
        },
        // () => {
        //   return file;
        // },
        () => {
          this.productLoading = false;
          _this.$message("上传的图片必须是等于242*242！");
          return Promise.reject();
        }
      );
      return isSize;
    },
    //   上传商品略缩图成功后
    handleAvatarSuccessProduct(res, file) {
      // console.log(res.payload.url);
      // this.productImgUrl = res.payload.url;
      this.productForm.goodsImg = res.payload.url;
      this.productLoading = false;
      this.$message(`上传成功`);
    },
    handlePictureCardPreview(file) {
      this.productImgUrl = file.url;
      this.productDialogVisible = true;
    },
    // 上传轮播图之前
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
      // return
      // const isLt2M = file.size / 1024 / 1024 < 2;
      const isSize = new Promise(function(resolve, reject) {
        let width = 750;
        let height = 750;
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
            // swiperImgs.push(data.data.data.key);
            // _this.productForm.swiperImgs.push(data.data.data.key);
            // console.log(swiperImgs);
          });
        },
        // () => {
        //   return file;
        // },
        () => {
          _this.$message("上传的图片必须是等于750*750!");
          return Promise.reject();
        }
      );
      return isSize;
    },
    // 上传轮播图成功之后
    handleAvatarSuccessSwiper(res, file) {
      // this.swiperImgUrl = res.payload.url;
      this.productForm.swiperImgs.push({ url: res.payload.url });
      this.$message(`上传成功`);
    },
    // 移除图片
    handleSwiperRemove(file) {
      // console.log(file, fileList)
      this.productForm.swiperImgs.forEach((item, index) => {
        if (item.url == file.url) {
          this.productForm.swiperImgs.splice(index, 1);
        }
      });
    },
    //上传详情图之前
    beforeAvatarUploadDetail(file) {
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
      // return
      // const isLt2M = file.size / 1024 / 1024 < 2;
      const isSize = new Promise(function(resolve, reject) {
        let width = 750;
        // let height = 750;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();

        img.onload = function() {
          let valid = img.width == width;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return http.getUploadToken({ params }).then(data => {
            console.log(data.data.data.token);
            _this.formData = { token: data.data.data.token };
            // swiperImgs.push(data.data.data.key);
            // _this.productForm.detailImgs.push(data.data.data.key);
            // console.log(swiperImgs);
          });
        },
        // () => {
        //   return file;
        // },
        () => {
          _this.$message("上传的图片宽度必须为750px");
          return Promise.reject();
        }
      );
      return isSize;
    },
    // 上传详情图成功后
    handleAvatarSuccessDetail(res, file, fileList) {
      // this.swiperImgUrl = res.payload.url;
      this.productForm.detailImgs.push({ url: res.payload.url });

      this.$message(`上传成功`);
    },
    // 移除详情图
    handleDetailRemove(file, fileList) {
      // console.log(file, fileList)
      this.productForm.detailImgs.forEach((item, index) => {
        if (item.url == file.url) {
          this.productForm.detailImgs.splice(index, 1);
        }
      });
    },
    //提交
    submitForm(form) {
      let { productForm } = this;
      let that = this;
      let swiperArr = [],
        detailArr = [];
      productForm.swiperImgs.forEach(item => {
        swiperArr.push(item.url);
      });
      productForm.detailImgs.forEach(item => {
        detailArr.push(item.url);
      });
      // productForm.swiperImgs = swiperArr
      // productForm.detailImgs = detailArr
      let params = {
        no: productForm.no,
        access_token: that.access_token,
        name: productForm.name,
        model: productForm.model,
        originPrice: productForm.originPrice * 100,
        currentPrice: productForm.currentPrice * 100,
        status: productForm.status,
        stock: productForm.stock,
        goodsImg: productForm.goodsImg,
        swiperImgs: swiperArr,
        detailImgs: detailArr,
        profit: {
          upper1LevelProfit: productForm.profit.upper1LevelProfit * 100,
          upper2LevelProfit: productForm.profit.upper2LevelProfit * 100,
          stationEarning: productForm.profit.stationEarning * 100,
          techEarning: productForm.profit.techEarning * 100
        }
      };
      this.$refs[form].validate(valid => {
        if (valid) {
          if (that.pageType == "add") {
            https.addProduct(params).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.back(-1);
                that.$message(`新增成功`);
              } else {
                that.$message.error(data.data.desc);
              }
            });
          } else {
            https.editProduct(params).then(data => {
              console.log(data.data);
              if (data.data.code == 0) {
                that.$router.back(-1);
                that.$message(`修改成功`);
                that.productForm = {};
              } else {
                that.$message.error(data.data.desc);
              }
            });
            console.log(swiperArr, detailArr);
          }
        } else {
          this.$message.error(`请填写完整信息`);
          return false;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.productImg .avatar-uploader {
  width: 178px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.el-upload--picture-card {
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>