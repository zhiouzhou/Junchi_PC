<template>
  <div id="addActive">
    <el-form
      class="content"
      :model="activeForm"
      ref="activeForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="活动名" prop="activeName">
        <el-input v-model.trim="activeForm.activeName" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item label="已报名人数" prop="activeEnroll">
        <el-input v-model.trim="activeForm.activeEnroll" placeholder="请输入"></el-input>
      </el-form-item>-->
      <el-form-item label="最多人数" prop="enrollment">
        <el-input v-model.trim="activeForm.enrollment" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="上传列表展示图片" prop="picPath">
        <!-- <el-input v-model.trim="swiperForm.imageUrl" placeholder="请输入"></el-input> -->
        <el-upload
          v-loading="loadingListPic"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="avatar-uploader"
          :data="formData"
          :action="actions"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="listImageUrl" :src="listImageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">图片格式为654*318</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传背景图片" prop="picPath">
        <!-- <el-input v-model.trim="swiperForm.imageUrl" placeholder="请输入"></el-input> -->
        <el-upload
          class="avatar-uploader"
          :data="formData"
          :action="actions"
          :show-file-list="false"
          :on-success="handleBgSuccess"
          :before-upload="beforeBgUpload"
        >
          <img v-if="bgImageUrl" :src="bgImageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">图片格式为宽750，高度不限。</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要" prop="infoAbbr">
        <el-input v-model.trim="activeForm.infoAbbr" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="内容url" prop="infoUrl">
        <el-input v-model="activeForm.infoUrl" placeholder="请输入或者上传文件"></el-input>
        <el-upload
          ref="uploadHtml"
          :action="actions"
          :data="formData"
          :auto-upload="true"
          :multiple="false"
          :limit="1"
          accept=".html"
          :before-upload="beforeUploadFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-remove="removeImg"
        >
          <el-button size="small" plain>上传文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传.html文件，如果不上传，则为默认页面</div>
        </el-upload>
        <!-- <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button> -->
      </el-form-item>
      <el-form-item label="活动起止时间" prop="time">
        <el-date-picker
          @change="selectTime"
          v-model="timeArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="activeForm.isShow" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.state"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('activeForm')">提交</el-button>
        <!-- <el-button @click="resetForm('activeForm')">重置</el-button> -->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/activeApi";
import https from "http/swiperManageApi";

import { mapState } from "vuex";
export default {
  data() {
    return {
      activeForm: {
        access_token: ``
      },
      listImageUrl: ``,
      bgImageUrl: ``,
      url: ``,
      timeArr: [],
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
      ],
      loadingListPic: false
    };
  },
  computed: {
    rules() {
      return {
        activeName: [
          { required: true, message: "请输入活动名", trigger: "blur" }
        ],
        picPath: [{ required: true, message: "请上传图片", trigger: "change" }],
        // activeEnroll: [
        //   { required: true, message: "请输入已报名人数", trigger: "blur" }
        // ],
        enrollment: [
          { required: true, message: "请输入最多报名人数", trigger: "blur" }
        ],
        infoAbbr: [{ required: true, message: "请输入摘要", trigger: "blur" }],
        infoUrl: [
          { required: false, message: "请输入内容url", trigger: "blur" }
        ],
        isShow: [
          { required: true, message: "请选择是否显示", trigger: "change" }
        ],
        time: [
          {
            type: "date",
            required: false,
            message: "请选择起止时间",
            trigger: "change"
          }
        ]
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.activeForm = {infoUrl:''};
    this.listImageUrl = "";
    this.bgImageUrl = "";
    this.timeArr = []
    this.activeForm.access_token = this.access_token;
  },
  methods: {
    // 上传图片之前的钩子
    beforeAvatarUpload(file, fileList) {
      this.loadingListPic = true;
      console.log("file", file);
      console.log("fileList", fileList);
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 654;
        let height = 318;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return https.getUploadToken({ params }).then(data => {
            console.log(data.data.data.token);
            _this.formData = { token: data.data.data.token };
            // _this.informationForm.picPath = data.data.data.url;
            _this.loadingListPic = false;
          });
        },
        () => {
          _this.loadingListPic = false;
          _this.$message("上传的图片必须是等于654*318！");
          return Promise.reject();
        }
      );
      return isSize;
    },
    // 上传成功时的钩子
    handleAvatarSuccess(res, file, fileList) {
      this.loadingListPic = false;
      console.log(res.payload.url);
      this.listImageUrl = res.payload.url;
      this.activeForm.picPath = res.payload.url;
      this.$message(`上传成功`);
    },
    // 上传背景图片之前的钩子
    beforeBgUpload(file, fileList) {
      console.log("file", file);
      console.log("fileList", fileList);
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 750;
        // let height = 318;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == width;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return https.getUploadToken({ params }).then(data => {
            console.log(data.data.data.token);
            _this.formData = { token: data.data.data.token };
            // _this.informationForm.picPath = data.data.data.url;
          });
        },
        () => {
          _this.loadingListPic = false;
          _this.$message("上传的图片格式为宽750，高度不限。");
          return Promise.reject();
        }
      );
      return isSize;
    },
    // 上传背景图片成功时的钩子
    handleBgSuccess(res, file, fileList) {
      console.log(res.payload.url);
      this.bgImageUrl = res.payload.url;
      this.activeForm.backPic = res.payload.url;
      this.$message(`上传成功`);
    },
    selectTime(time) {
      console.log(time);
      this.activeForm.startDate = time[0];
      this.activeForm.endDate = time[1];
    },
    uploadFile() {
      this.$refs.uploadHtml.submit();
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
      let _this = this;
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (extension !== "html") {
        this.$notify.warning({
          title: "警告",
          message: `只能上传html文件`
        });
        // return false
      }
      return https.getUploadToken({ params }).then(data => {
        console.log(data.data.data.token);
        _this.formData = { token: data.data.data.token };
      });
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log(res);
      this.$message(`上传成功`);
      this.url = res.payload.url;
      this.activeForm.infoUrl = res.payload.url;
    },
    removeImg(file, fileList) {
      console.log(`移除`);
      this.url = ``;
      this.activeForm.infoUrl = ``;
    },
    handleError(err, file, fileList) {
      console.log(err);
    },
    submitForm(form) {
      let { activeForm } = this;
      let that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          http.addActive(activeForm).then(data => {
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
  }
};
</script>
<style lang="stylus" scoped>
#addActive {
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
    border: 1px dashed #eee;
  }
}
</style>