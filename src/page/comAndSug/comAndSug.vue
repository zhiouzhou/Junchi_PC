<template>
  <div id="comAndSug">
    <el-form
      :inline="true"
      :model="comAndSugForm"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="comAndSugForm"
    >
      <el-form-item label="处理状态">
        <el-select v-model="comAndSugForm.isDeal" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="处理阶段">
        <el-select v-model="comAndSugForm.dealProgress" clearable>
          <el-option
            v-for="item in proGressOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item style="margin-left:20px;">
        <el-button type="primary" @click="getComAndSugList('clickCheck')" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="comAndSugList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="52">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户id"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>

      <el-table-column label="头像">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.headPic}}</span> -->
          <img :src="scope.row.portraitUrl" alt style="width:100%">
        </template>
      </el-table-column>
      <el-table-column prop="csContent" label="内容"></el-table-column>
      <el-table-column label="投诉图片">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.headPic}}</span> -->
          <img
            v-for="(item,index) in scope.row.picturePaths"
            :src="item"
            :key="index"
            style="width:100%"
          >
        </template>
      </el-table-column>
      <el-table-column prop="phoneEmail" label="电话邮箱"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="dealTime" label="处理时间"></el-table-column>
      <el-table-column label="处理阶段">
        <template slot-scope="scope">
          <span>{{scope.row.dealProgress==0?'运营专员':'售后'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否处理">
        <template slot-scope="scope">
          <span>{{scope.row.isDeal==0?'未处理':'处理'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="comAndSugForm.dealProgress==0"
            @click="commitDeal(scope.row,'checked')"
            type="text"
            size="small"
          >提交售后处理</el-button>
          <el-button
            @click="editType(scope.row,'checked')"
            type="text"
            size="small"
            :disabled="scope.row.isDeal==1?true:false"
          >更新状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="comAndSugForm.size"
      :current-page="comAndSugForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/comAndSug";
export default {
  data() {
    return {
      comAndSugForm: {
        access_token: ``,
        page: 1,
        size: 10,
        isDeal: "",
        dealProgress: ``
      },
      total: 0,
      comAndSugList: [],
      typeOptions: [{ value: 0, label: "未处理" }, { value: 1, label: "处理" }],
      proGressOptions: [
        { value: 0, label: "运营专员" },
        { value: 1, label: "售后" }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `roleArr`])
  },
  activated() {
    this.comAndSugForm.access_token = this.access_token;
    console.log(this.roleArr.indexOf("ROLE_op-zy") == -1);
    console.log(this.roleArr);
    if (this.roleArr.indexOf("ROLE_op-zy") > -1) {
      this.comAndSugForm.dealProgress = `0`;
    } else if (
      this.roleArr.indexOf("ROLE_af-zy") > -1 ||
      this.roleArr.indexOf("ROLE_af-zg") > -1 ||
      this.roleArr.indexOf("ROLE_af-jl") > -1
    ) {
      this.comAndSugForm.dealProgress = `1`;
    } else {
      this.comAndSugForm.dealProgress = ``;
    }
    this.getComAndSugList();
  },
  methods: {
    getComAndSugList() {
      let params = this.comAndSugForm;
      http.getComAndSugList({ params }).then(data => {
        console.log(data.data.data);
        this.comAndSugList = data.data.data;
        this.total = data.data.total;
      });
    },
    indexMethods(index) {
      return (
        (this.comAndSugForm.page - 1) * this.comAndSugForm.size + index + 1
      );
    },
    handlePageNumChange(num) {
      this.comAndSugForm.page = num;
      this.getComAndSugList();
    },
    editType(row) {
      this.$router.push({ name: `editComAndSugType`, query: { id: row.id } });
    },
    commitDeal(row) {
      let params = { access_token: this.access_token, id: row.id };
      let that = this
      this.$confirm("是否将该问题提交到售后处理?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          http.commitDeal(params).then(data => {
            if (data.data.code == 0) {
              that.$message(data.data.desc);
              this.getComAndSugList();
            } else {
              that.$message(data.data.desc);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>