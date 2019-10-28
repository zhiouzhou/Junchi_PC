<template>
  <div id="addQuesAndAns">
    <el-form
      class="content"
      :model="quesAndAnsForm"
      ref="quesAndAnsForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="问题" prop="question">
        <el-input v-model.trim="quesAndAnsForm.question" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer">
        <el-input v-model.trim="quesAndAnsForm.answer" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('quesAndAnsForm')">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/questionApi";
// import http from "http/swiperManageApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      quesAndAnsForm: {
        access_token: ``
      }
    };
  },
  computed: {
    rules() {
      return {
        question: [
          { required: true, message: "请输入常见问题", trigger: "blur" }
        ],
        answer: [{ required: true, message: "请输入答案", trigger: "blur" }]
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.quesAndAnsForm.access_token = this.access_token;
  },
  methods: {
    submitForm(form) {
      let { quesAndAnsForm } = this;
      let that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          http.addQuesAndAns(quesAndAnsForm).then(data => {
            if (data.data.code == 0) {
              console.log(data);
              that.$router.back(-1);
              that.$message(`新增成功`);
            } else {
              that.$message.error(data.data.desc);
            }
          });
        } else {
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>
