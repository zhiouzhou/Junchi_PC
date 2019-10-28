<template>
  <div id="questionAndAns">
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="addTelePhone"
    >添加客服电话</el-button>
    <el-table :data="phoneList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="180">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactName" label="联系人"></el-table-column>
      <el-table-column prop="contactWay" label="电话号码"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="deletePhone(scope.row,'checked')" type="text" size="small">删除</el-button>
          <el-button @click="edit(scope.row,'checked')" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import http from "http/phoneApi";
import { mapState } from "vuex";
export default {
  name: `questionAndAns`,
  data() {
    return {
      phoneForm: {
        access_token: ``,
      },
      total: 0,
      phoneList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.phoneForm.access_token = this.access_token;
    this.getPhoneList();
  },
  methods: {
    addTelePhone() {
        this.$router.push({name:`addTelephone`})
    },
    indexMethods(index) {
        return index+1
    //   return (this.phoneForm.page - 1) * this.phoneForm.size + index + 1;
    },
    getPhoneList() {
      let params = this.phoneForm;
      http.getPhoneList({ params }).then(data => {
        if (data.data.code == 0) {
          this.phoneList = data.data.data;
        //   this.total = data.data.total;
        }
      });
    },
    deletePhone(row) {
      let params = { access_token: this.access_token, id: row.id };
      let that=  this
      this.$confirm("此操作将删除该号码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deletePhone({ params })
            .then(data => {
                console.log(data.data.code)
              if (data.data.code == 0) {
                that.$message(data.data.desc);
                that.phoneList = this.phoneList.filter(item => {
                  return item.id != row.id;
                });
                that.getPhoneList();
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
    },
    edit(row){
        this.$router.push({name:`addTelephone`,query:{phoneInfo:JSON.stringify(row),type:'edit'}})
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