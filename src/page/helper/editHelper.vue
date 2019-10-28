<template>
  <div id="editHelper">
    <el-form
      class="content"
      :model="helperForm"
      ref="helperForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <el-form-item label="是否生效" prop="isShow">
        <el-select v-model="helperForm.isShow" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.state"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('helperForm')">提交</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from "http/helperApi";
import { mapState } from "vuex";
export default {
  data() {
    return {
        helperForm:{
            access_token:``,
            imageId:``,
        },
      statusOptions: [
        {
          value: 0,
          state: "不生效"
        },
        {
          value: 1,
          state: "生效"
        }
      ]
    };
  },
  activated() {
      this.helperForm.access_token = this.access_token
      this.helperForm.imageId = this.$route.query.imageId
  },
  methods: {
      submitForm(){
        let {helperForm} = this
        let params = helperForm
        http.editImgStatus(params).then(data=>{
            console.log(data.data)
            if(data.data.code==0){
                this.$message(data.data.desc)
                this.$router.go(-1)
            }else {
                this.$message(data.data.desc)

            }
        })
      },
  },
  computed: {
    rules() {
      return {
        isShow: [
          { required: true, message: "请选择是否生效", trigger: "change" }
        ]
      };
    },
    ...mapState(`user`,[`access_token`])
  }
};
</script>