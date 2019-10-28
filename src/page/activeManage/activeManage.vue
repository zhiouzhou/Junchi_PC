<template>
  <div id="activeManage">
    <el-form
      :inline="true"
      :model="activeForm"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="activeForm"
    >
      <el-form-item label="是否有效">
        <el-select v-model="activeForm.isShow">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.status"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getActiveList" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="addActive"
    >新增活动</el-button>
    <el-button
      size="medium"
      style="margin-top:14px;font-size:13px;"
      type="primary"
      @click="editDefaultPage"
    >更新活动默认页面</el-button>
    <el-table :data="activeList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="activeName" label="活动名字"></el-table-column>
      <el-table-column prop="activeEnroll" label="已报名人数"></el-table-column>
      <el-table-column prop="enrollment" label="最多人数"></el-table-column>
      <el-table-column label="活动图片">
        <template slot-scope="scope">
          <img :src="scope.row.picPath" alt style="width:100%;">
        </template>
      </el-table-column>
      <el-table-column prop="infoAbbr" label="摘要"></el-table-column>
      <el-table-column prop="infoUrl" label="内容url"></el-table-column>
      <el-table-column prop="startDate" label="活动开始时间"></el-table-column>
      <el-table-column prop="endDate" label="活动结束时间"></el-table-column>
      <el-table-column label="是否显示">
        <template slot-scope="scope">
          <span>{{scope.row.isShow=="0"?"不显示":"显示"}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="checkPersonnel(scope.row.id,'checked')"
            type="text"
            size="small"
          >查看活动报名人员</el-button>
          <el-button @click="deleteActive(scope.row,'checked')" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="activeForm.size"
      :current-page="activeForm.page"
      @current-change="handlePageNumChange"
      :total="total"
    ></el-pagination>
    <!-- 更新默认活动页面的弹框 -->
    <el-dialog title="更新默认活动页面" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form>
        <el-form-item label="活动页面url" label-width="120px">
          <el-input v-model.trim="url" placeholder="请上传文件" disabled></el-input>
          <el-upload
            ref="uploadHtml"
            :action="actions"
            :data="formData"
            :auto-upload="true"
            :multiple="false"
            :limit="1"
            accept=".html"
            :before-upload="beforeUploadFile"
            :on-success="handleSuccess"
            :on-remove="removeImg"
          >
            <el-button size="small" plain>上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="upDatePage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/activeApi";
import https from "http/swiperManageApi";
export default {
  data() {
    return {
      activeForm: {
        isShow: ``,
        page: 1,
        size: 10,
        access_token: ``
      },
      activeList: [],
      total: 0,
      statusOption: [
        { value: "0", status: "否" },
        { value: "1", status: "是" }
      ],
      dialogFormVisible: false,
      url: ``,
      actions: `https://up.qiniup.com`,
      qiniuaddr: "pd6rnk9ck.bkt.clouddn.com",
      formData: {
        token: ``
      }
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    this.activeForm.access_token = this.access_token;
    this.getActiveList();
  },
  methods: {
    getActiveList() {
      let params = this.activeForm;
      http.getActiveList({ params }).then(data => {
        if (data.data.code == 0) {
          this.activeList = data.data.data;
          this.total = data.data.total;
        }
      });
    },
    handlePageNumChange(num) {
      this.activeForm.page = num;
      this.getActiveList();
    },
    indexMethods(index) {
      return (this.activeForm.page - 1) * this.activeForm.size + index + 1;
    },
    addActive() {
      this.$router.push({ name: `addActive` });
    },
    deleteActive(row) {
      let params = { access_token: this.access_token, id: row.id };
      let that = this;
      this.$confirm("此操作将删除该活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteActive({ params }).then(data => {
            console.log(data.data.code);
            if (data.data.code == 0) {
              that.$message(data.data.desc);
              that.activeList = this.activeList.filter(item => {
                return item.id != row.id;
              });
              that.getActiveList();
            } else {
              this.$message(`删除失败`);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    checkPersonnel(id) {
      this.$router.push({ name: `enrollRecordsList`, query: { actId: id } });
    },
    editDefaultPage() {
      this.dialogFormVisible = true;
    },
    upDatePage() {
      if (!this.url) {
        this.$message(`请上传文件之后提交`);
        return;
      }
      let params = { access_token: this.access_token, pageKey: this.key };
      http
        .upDateDefalutPage(params)
        .then(data => {
          console.log(data.data);
          if (data.data.code == 0) {
            this.$message(data.data.desc);
            this.dialogFormVisible = false;
          } else {
            this.$message(data.data.desc);
          }
        })
        .catch(e => {
          this.$message(`更新失败，请稍后重试`);
        });
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
      let _this = this;
      let name = file.name;
      let params = { fileName: name, access_token: this.access_token };
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (extension !== "html") {
        this.$notify.warning({
          title: "警告",
          message: `只能上传html文件`
        });
        // return false
      }
      return https.getUploadToken({ params }).then(data => {
        console.log(data.data.data.token);
        _this.formData = { token: data.data.data.token };
        _this.key = data.data.data.key;
      });
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log(res);
      this.$message(`上传成功`);
      this.url = res.payload.url;
      // this.activeForm.infoUrl = res.payload.url;
    },
    removeImg(file, fileList) {
      console.log(`移除`);
      this.url = ``;
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