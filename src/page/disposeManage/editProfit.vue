<template>
  <div id="editProfit">
    <el-form
      class="content"
      :model="profitForm"
      ref="profitForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
      v-if="pageType=='store'"
    >
      <el-form-item label="技工佣金" prop="techEarning">
        <el-input v-model.trim="profitForm.techEarning" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="门店佣金" prop="stationEarning">
        <el-input v-model.trim="profitForm.stationEarning" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('profitForm')">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

    <el-form
      class="content"
      :model="commisionForm"
      ref="commisionForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
      v-else
    >
      <el-form-item label="销售佣金" prop="upper1Level">
        <el-input v-model.trim="commisionForm.upper1Level" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="管理佣金" prop="upper2Level">
        <el-input v-model.trim="commisionForm.upper2Level" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('commisionForm')">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/disposeApi";
// import http from "http/swiperManageApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
      profitForm: {
        techEarning: ``,
        stationEarning: ``
      },
      commisionForm: {
        upper1Level: ``, //销售佣金
        upper2Level: `` //管理佣金
      },
      pageType: ``
    };
  },
  computed: {
    rules() {
      return {
        techEarning: [
          { required: true, message: "请输入技工佣金", trigger: "blur" }
        ],
        stationEarning: [
          { required: true, message: "请输入门店佣金", trigger: "blur" }
        ],
        upper1Level: [
          { required: true, message: "请输入销售佣金", trigger: "blur" }
        ],
        upper2Level: [
          { required: true, message: "请输入管理佣金", trigger: "blur" }
        ],
      };
    },
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.profitForm = JSON.parse(this.$route.query.profitInfo);
    this.commisionForm = JSON.parse(this.$route.query.profitInfo);
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
  },
  methods: {
    submitForm(form) {
      let { profitForm, commisionForm,pageType } = this;
      let params = {};
      let value = {};
      let that = this;
      if (pageType == "store") {
        params = {
          techEarning: profitForm.techEarning * 100,
          stationEarning: profitForm.stationEarning * 100
        };
        value = { access_token: this.access_token };
        this.$refs[form].validate(valid => {
          if (valid) {
            http.editProfit(params, value).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.back(-1);
                that.$message(`修改成功`);
                that.profitForm = {
                  techEarning: ``,
                  stationEarning: ``
                };
              } else {
                that.$message.error(data.data.desc);
              }
            });
          }
        });
      }else {
         params = {
          upper1Level: commisionForm.upper1Level * 100,
          upper2Level: commisionForm.upper2Level * 100
        };
        value = { access_token: this.access_token };
        this.$refs[form].validate(valid => {
          if (valid) {
            http.editCommi(params, value).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.back(-1);
                that.$message(`修改成功`);
                that.profitForm = {
                  upper1Level: ``,
                  upper2Level: ``
                };
              } else {
                that.$message.error(data.data.desc);
              }
            });
          }
        });
      }
    }
  }
};
</script>
<style lang="stylus" scoped></style>