<template>
  <div id="addPersonnel">
    <el-form
      class="content"
      :model="personnelForm"
      ref="personnelForm"
      label-width="100px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="身份证号" prop="cardId">
        <el-input v-model.trim="personnelForm.cardId" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="techName">
        <el-input v-model.trim="personnelForm.techName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="personnelForm.sex" placeholder="请选择性别">
          <el-option label="男" :value="0"></el-option>
          <el-option label="女" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式" prop="techPhone">
        <el-input v-model.trim="personnelForm.techPhone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="techAddress">
        <el-input v-model.trim="personnelForm.techAddress" placeholder="请输入省、市、区、街道"></el-input>
      </el-form-item>

      <el-form-item label="证书编号" prop="certificateNo">
        <el-input v-model.trim="personnelForm.certificateNo" placeholder="请输入证书编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('personnelForm')">提交</el-button>
        <el-button @click="resetForm('personnelForm')">重置</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/personnelApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      personnelForm: {
        cardId: ``, //身份证号
        techName: ``, //姓名
        sex: 0, //性别
        techPhone: ``, //电话
        techAddress: ``, //地址
        certificateNo: ``, //证书编号
        access_token: ``
      },
      pageType: ``
    };
  },
  activated() {
    this.personnelForm.access_token = this.access_token;
    if (this.$route.query.personnelInfo) {
      this.personnelForm = JSON.parse(this.$route.query.personnelInfo);
      // this.storeForm.access_token = this.access_token
    }
    this.pageType = this.$route.query.pageType;
  },
  methods: {
    submitForm(formName) {
      let { personnelForm, pageType } = this;
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (pageType == "add") {
            http.addPersonnel(personnelForm).then(data => {
              console.log(data);
              if (data.data.code == 0) {
                that.$router.back(-1);
                that.$message("新增成功");
              } else {
                that.$message(data.data.desc);
              }
            });
          } else {
            http.editPersonnel(personnelForm).then(data => {
              console.log(data);
              if (data.data.code == 0) {
                that.$router.back(-1);
                that.$message("修改成功");
              } else {
                that.$message(data.data.desc);
              }
            });
          }
        } else {
          that.$message.error(`请填写完整信息`);
          return false;
        }
      });
    },
    resetForm() {
      this.personnelForm = {
        cardId: ``, //身份证号
        techName: ``, //姓名
        sex: 0, //性别
        techPhone: ``, //电话
        techAddress: ``, //地址
        certificateNo: ``, //证书编号
        access_token: this.access_token
      };
    },
  },
  computed: {
      rules() {
        return {
          cardId: [
            { required: true, message: "请输入身份证号", trigger: "blur" }
          ],
          techName: [
            { required: true, message: "请输入名称", trigger: "blur" }
          ],
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
      ...mapState(`user`, [`access_token`])
    }
};
</script>
<style lang="stylus" scoped>
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
}
</style>