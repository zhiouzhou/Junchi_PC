<template>
  <div id="addStore">
    <el-form
      class="content"
      :model="storeForm"
      ref="storeForm"
      label-width="120px"
      label-suffix="："
      size="medium"
      :rules="rules"
    >
      <!-- <el-form-item label="安装店店主唯一标识">
        <el-input v-model.trim="storeForm.stationHost" placeholder="请输入"></el-input>
      </el-form-item>-->
      <el-form-item label="安装店名称" prop="stationName">
        <el-input v-model.trim="storeForm.stationName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="selectedOptions">
        <el-cascader
          size="large"
          :options="options"
          v-model.trim="storeForm.selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailLocation">
        <el-input v-model.trim="storeForm.detailLocation" placeholder="请输入" v-on:input="getDetail"></el-input>
      </el-form-item>
      <el-form-item label="安装店地址" prop="stationLocation">
        <el-input v-model.trim="storeForm.stationLocation" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="安装店纬度" prop="stationLat">
        <div style="display:flex;align-items:center;">
          <el-input v-model.trim="storeForm.stationLat" placeholder="请选择经纬度" disabled></el-input>
          <el-button type="primary" @click="selectAddress(pageType)" style="margin-left:20px;">选择经纬度</el-button>
        </div>
      </el-form-item>
      <el-form-item label="安装店经度" prop="stationLon">
        <el-input v-model.trim="storeForm.stationLon" placeholder="请选择经纬度" disabled></el-input>
      </el-form-item>
      <el-form-item label="店主名称" prop="hostName">
        <el-input v-model.trim="storeForm.hostName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="店主联系方式" prop="contactWay">
        <el-input v-model.trim="storeForm.contactWay" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="店主身份证号" prop="cardId">
        <el-input v-model.trim="storeForm.cardId" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model.trim="storeForm.contractNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="开始营业时间" prop="startTime">
        <el-time-picker
          v-model="storeForm.startTime"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="选择开始时间"
        ></el-time-picker>
      </el-form-item>
      <el-form-item label="结束营业时间" prop="endTime">
        <el-time-picker
          v-model="storeForm.endTime"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="选择结束时间"
        ></el-time-picker>
      </el-form-item>
      <el-form-item label="门店状态" v-if="pageType=='edit'">
        <el-select v-model="storeForm.stationStatus" clearable>
          <!-- :key="item.value" :label="item.sex" :value="item.value" -->
          <el-option
            v-for="item in storeStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="selectAddress">选择经纬度</el-button> -->

        <el-button type="primary" @click="submitForm('storeForm')">提交</el-button>
        <el-button @click="resetForm('storeForm')">重置</el-button>
        <el-button @click="$router.push({name:`storeManage`})">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/storeApi";
import { regionData, CodeToText } from "element-china-area-data";
export default {
  data() {
    return {
      storeForm: {
        stationName: ``, //安装店名称
        stationLocation: ``, //安装点位置
        stationLat: ``, //安装纬度
        stationLon: ``, //安装经度
        cardId: ``, //身份证号
        contractNo: ``, //合同编号
        startTime: ``, //开始时间
        endTime: ``, //结束时间
        access_token: ``,
        contactWay: ``, //联系方式
        hostName: ``, //安装店主名
        nation: "中国",
        province: "",
        city: "",
        county: "",
        detailLocation: "",
        selectedOptions:[],
      },
      options: regionData,
      selectedOptions: [],

      pageType: `add`,
      storeStatusOptions: [
        { value: 1, label: `营业中` },
        { value: 2, label: `经营异常` },
        { value: 3, label: `休业中` }
      ]
    };
  },
  activated() {
    this.storeForm.access_token = this.access_token;
    console.log(regionData);
    if (this.$route.query.storeInfo) {
      this.storeForm = JSON.parse(this.$route.query.storeInfo);
      this.storeForm.access_token = this.access_token;
      console.log(CodeToText);
      let arr = regionData.filter(item => {
        return item.label == this.storeForm.province;
      });
      console.log(arr);
      let arr1 = arr[0].children.filter(item => {
        return item.label == this.storeForm.city;
      });
      console.log(arr1);
      let arr2 = arr1[0].children.filter(item => {
        return item.label == this.storeForm.county;
      });
      console.log(arr2);
      this.storeForm.selectedOptions = [arr[0].value, arr1[0].value, arr2[0].value];
    }
    if (this.$route.query.addressInfo) {
      console.log(this.$route.query.addressInfo);
      let addressInfo = JSON.parse(this.$route.query.addressInfo);
      this.storeForm.stationLat = addressInfo.lat;
      this.storeForm.stationLon = addressInfo.lng;
      // this.pageType = this.pageType
    }
    this.pageType = this.$route.query.pageType;
  },
  methods: {
    getDetail(value) {
      console.log(value);
      this.storeForm.stationLocation =
        this.storeForm.nation +
        this.storeForm.province +
        this.storeForm.city +
        this.storeForm.county +
        this.storeForm.detailLocation;
    },
    handleChange(value) {
      console.log(value);
      let data =
        CodeToText[value[0]] +
        ", " +
        CodeToText[value[1]] +
        ", " +
        CodeToText[value[2]];
      this.storeForm.province = CodeToText[value[0]];
      this.storeForm.city = CodeToText[value[1]];
      this.storeForm.county = CodeToText[value[2]];
      this.storeForm.stationLocation =
        this.storeForm.nation +
        CodeToText[value[0]] +
        CodeToText[value[1]] +
        CodeToText[value[2]];
      console.log(data);
    },
    submitForm(form) {
      let { storeForm, pageType } = this;
      let that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          if (pageType == "add") {
            http.addStore(storeForm).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.push({ name: `storeManage` });
                that.$message(`新增成功`);
              } else {
                that.$message.error(data.data.desc);
              }
            });
          } else if (pageType == "edit") {
            http.editStore(storeForm).then(data => {
              if (data.data.code == 0) {
                console.log(data);
                that.$router.push({ name: `storeManage` });
                that.$message(`编辑成功`);
              } else {
                that.$message.error(data.data.desc);
              }
            });
          }
        } else {
          this.$message.error(`请填写完整信息`);
          return false;
        }
      });
    },
    resetForm() {
      this.storeForm = {
        stationName: ``, //安装点名称
        stationLocation: ``, //安装点位置
        stationLat: ``, //安装纬度
        stationLon: ``, //安装经度
        cardId: ``, //身份证号
        contractNo: ``, //合同编号
        startTime: ``, //开始时间
        endTime: ``, //结束时间
        access_token: this.access_token,
        contactWay: ``, //联系方式
        hostName: ``, //安装店主名
        selectedOptions:[]
      };
      this.selectedOptions = [];
    },
    selectAddress(pageType) {
      this.$router.push({ name: `selectAddress`, query: { pageType } });
    }
  },
  computed: {
    rules() {
      return {
        selectedOptions: [
          { required: true, message: "请选择省市区", trigger: "change" }
        ],
        hostName: [
          { required: true, message: "请输入店主名称", trigger: "blur" }
        ],
        contactWay: [
          { required: true, message: "请输入店主联系方式", trigger: "blur" }
        ],
        stationName: [
          { required: true, message: "请输入安装店名称", trigger: "blur" }
        ],
        stationLocation: [
          { required: true, message: "请输入安装店地址", trigger: "blur" }
        ],
        stationLat: [
          { required: true, message: "请输入安装店纬度", trigger: "blur" }
        ],
        stationLon: [
          { required: true, message: "请输入安装店经度", trigger: "blur" }
        ],
        cardId: [
          { required: true, message: "请输入身份证号", trigger: "blur" }
        ],
        contractNo: [
          { required: true, message: "请输入合同编号", trigger: "blur" }
        ],
        startTime: [
          { required: false, message: "请选择开始营业时间", trigger: "change" }
        ],
        endTime: [
          { required: false, message: "请选择结束营业时间", trigger: "change" }
        ]
      };
    },
    ...mapState(`user`, [`access_token`])
  }
};
</script>
<style lang="stylus" scoped>
#addStore {
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

  .el-time-picker {
    width: 100%;
  }
}
</style>