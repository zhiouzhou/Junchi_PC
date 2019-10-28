<template>
  <div id="editType">
    <el-form
      :model="comAndSugForm"
      size="medium"
      label-width="150px"
      label-suffix="："
      class="demo-form-inline"
      :rules="rules"
      ref="comAndSugForm"
    >
      <el-form-item label="处理备注" prop="dealDesc">
        <el-input
          type="textarea"
          :rows="4"
          maxlength="200"
          placeholder="请输入内容"
          v-model="comAndSugForm.dealDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否处理装填" prop="isDeal">
        <!-- 选择器 -->
        <el-select v-model="comAndSugForm.isDeal" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('comAndSugForm')">提交</el-button>
        <!-- <el-button @click="resetForm('informationForm')">重置</el-button> -->
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/comAndSug";
export default {
  data() {
    return {
      comAndSugForm: {
        id: ``,
        dealDesc: ``,
        access_token: ``,
        isDeal: ``
      },
      options: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "处理"
        }
      ]
    };
  },
  computed: {
    rules() {
      return {
        dealDesc: [{ required: true, message: "请输入备注", trigger: "blur" }],
        isDeal: [
          { required: true, message: "请选择是否装填", trigger: "change" }
        ]
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.comAndSugForm.access_token = this.access_token;
    this.comAndSugForm.id = this.$route.query.id;
    this.comAndSugForm.dealDesc = this.textarea;
  },
  methods: {
    submitForm(form) {
        let comAndSugForm = this.comAndSugForm
        let that = this
      this.$refs[form].validate(valid => {
        if (valid) {
          http.editType(comAndSugForm).then(data => {
            if (data.data.code == 0) {
              console.log(data);
              that.$router.back(-1);
              that.$message(`修改成功`);
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
#editType {
  .el-form {
    width: 50%;
  }
}
</style>