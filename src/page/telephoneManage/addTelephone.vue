<template>
  <div id="addPhone">
    <el-form
      class="content"
      :model="phoneForm"
      ref="phoneForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="联系人名字" prop="contactName">
        <el-input v-model.trim="phoneForm.contactName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="answer">
        <el-input v-model.trim="phoneForm.contactWay" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('phoneForm')">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/phoneApi";
// import http from "http/swiperManageApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      phoneForm: {
        access_token: ``,
        contactName: ``,
        contactWay: ``
      }
    };
  },
  computed: {
    rules() {
      return {
        contactName: [
          { required: true, message: "请输入常见问题", trigger: "blur" }
        ],
        contactWay: [{ required: true, message: "请输入答案", trigger: "blur" }]
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.phoneForm.access_token = this.access_token;
    console.log(this.$route.query.type)
    if (this.$route.query.phoneInfo && this.$route.query.type == "edit") {
      this.phoneForm = JSON.parse(this.$route.query.phoneInfo);
      this.phoneForm.access_token = this.access_token;
      this.type = this.$route.query.type;
    }else {
      this.phoneForm = {
        access_token: this.access_token,
        contactName: ``,
        contactWay: ``}
    }
  },
  methods: {
    submitForm(form) {
      let { phoneForm } = this;
      let that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          if (that.type == "edit") {
            http.editPhone(phoneForm).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.back(-1);
                that.$message(`编辑成功`);
                that.phoneForm = {access_token:that.access_token,contactName:``,contactWay:``}
              } else {
                that.$message.error(data.data.desc);
              }
            });
          } else {
            http.addPhone(phoneForm).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.back(-1);
                that.$message(`新增成功`);
              } else {
                that.$message.error(data.data.desc);
              }
            });
          }
        } else {
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>
