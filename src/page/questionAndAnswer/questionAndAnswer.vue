<template>
  <div id="questionAndAns">
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="addQuesAndAns"
    >录入问题与答案</el-button>
    <el-table :data="questionList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="180">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="question" label="问题"></el-table-column>
      <el-table-column prop="answer" label="答案"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteQuestion(scope.row,'checked')" type="text" size="small">删除</el-button>
          <!-- <el-button @click="editInfomation(scope.row,'checked')" type="text" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="questionForm.size"
      :current-page="questionForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "http/questionApi";
import { mapState } from "vuex";
export default {
  name: `questionAndAns`,
  data() {
    return {
      questionForm: {
        access_token: ``,
        page: 1,
        size: 8
      },
      total: 0,
      questionList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.questionForm.access_token = this.access_token;
    this.getQuesAndAns();
  },
  methods: {
    addQuesAndAns() {
        this.$router.push({name:`addQuesAndAns`})
    },
    indexMethods(index) {
      return (this.questionForm.page - 1) * this.questionForm.size + index + 1;
    },
    getQuesAndAns() {
      let params = this.questionForm;
      http.getQuestionList({ params }).then(data => {
        if (data.data.code == 0) {
          this.questionList = data.data.data;
          this.total = data.data.total;
        }
      });
    },
    handlePageNumChange(num) {
      this.questionForm.page = num;
      this.getQuestionList();
    },
    deleteQuestion(row) {
      let params = { access_token: this.access_token, id: row.id };
      let that=  this
      this.$confirm("此操作将永久删除该问题与答案, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteQuesAndAns({ params })
            .then(data => {
                console.log(data.data.code)
              if (data.data.code == 0) {
                that.$message(data.data.desc);
                that.questionList = this.questionList.filter(item => {
                  return item.id != row.id;
                });
                that.getQuesAndAns();
              } else {
                this.$message(`删除失败`);
              }
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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