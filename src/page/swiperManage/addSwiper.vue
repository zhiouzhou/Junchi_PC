<template>
  <div id="addSwiper">
    <el-form
      class="content"
      :model="swiperForm"
      ref="swiperForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="轮播资讯名" prop="infoName">
        <el-input v-model.trim="swiperForm.infoName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="picPath">
        <!-- <el-input v-model.trim="swiperForm.imageUrl" placeholder="请输入"></el-input> -->
        <el-upload
          class="avatar-uploader"
          :data="formData"
          :action="actions"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">图片格式为750*422</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容url" prop="infoUrl">
        <el-input v-model.trim="swiperForm.infoUrl" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序" prop="showOrder">
        <el-input v-model.trim="swiperForm.showOrder" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="swiperForm.isShow" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.state"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('swiperForm')">提交</el-button>
        <el-button @click="resetForm('swiperForm')">重置</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/swiperManageApi";
import { mapState } from "vuex";
export default {
  name: `addSwiper`,
  data() {
    return {
      swiperForm: {
        access_token: ``
      },
      imageUrl: ``,
      // fileList1: [],
      actions: `https://up.qiniup.com`,
      qiniuaddr: "pd6rnk9ck.bkt.clouddn.com",
      formData: {
        token: ``
      },
      statusOptions: [
        {
          value: 0,
          state: "不显示"
        },
        {
          value: 1,
          state: "显示"
        }
      ]
    };
  },
  activated() {
    this.swiperForm.access_token = this.access_token;
  },
  methods: {
    // 上传图片之前的钩子
    beforeAvatarUpload(file, fileList) {
      console.log("file", file);
      console.log("fileList", fileList);
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        return false;
      }
      // return
      // const isLt2M = file.size / 1024 / 1024 < 2;
      const isSize = new Promise(function(resolve, reject) {
        let width = 750;
        let height = 422;
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
            _this.swiperForm.picPath = data.data.data.key;
          });
        },
        () => {
          _this.$message("上传的图片必须是等于750*422！");
          return Promise.reject();
        }
      );
      return isSize;
    },
    // 上传成功时的钩子
    handleAvatarSuccess(res, file, fileList) {
      console.log(res.payload.url);
      this.imageUrl = res.payload.url;
      this.$message(`上传成功`);
    },
    submitForm(form) {
      let { swiperForm } = this;
      let that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          http.addSwiper(swiperForm).then(data => {
            if (data.data.code == 0) {
              console.log(data);
              that.$router.back(-1);
              that.$message(`新增成功`);
            } else {
              that.$message.error(data.data.desc);
            }
          });
        } else {
          this.$message.error(`请填写完整信息`);
          return false;
        }
      });
    }
  },

  computed: {
    rules() {
      return {
        infoName: [
          { required: true, message: "请输入轮播图资讯名", trigger: "blur" }
        ],
        picPath: [{ required: true, message: "请上传图片", trigger: "change" }],
        infoUrl: [
          { required: true, message: "请输入内容url", trigger: "blur" }
        ],
        showOrder: [
          { required: true, message: "请输入显示顺序", trigger: "blur" }
        ],
        isShow: [
          { required: true, message: "请选择是否显示", trigger: "change" }
        ]
      };
    },
    ...mapState(`user`, [`access_token`])
  }
};
</script>
<style lang="stylus">
#addSwiper {
  .el-form {
    margin-top: 40px;
    width: 50%;
  }

  .avatar {
    width: 100%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  }
}
</style>