<template>
  <div id="enroll">
    <el-table :data="personnelList" border style="width: 100%;margin-top:14px;">
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <span>{{scope.$index}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="activeName" label="活动名字"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="userPhone" label="联系方式"></el-table-column>
      <el-table-column prop="userCard" label="身份证号"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/activeApi";
export default {
  data() {
    return {
      personnelList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  },
  activated() {
    let actId = this.$route.query.actId;
    let params = {
      actId: actId,
      page: 1,
      size: 0,
      access_token: this.access_token
    };
    http.getPersonnelList({params}).then(data=>{
        if(data.data.code==0){
            this.personnelList = data.data.data
        }
    });
  }
};
</script>
<style lang="stylus" scoped>
#enroll {
  .enroll-info-content {
    line-height: 36px;
    display: flex;
    align-items: center;
  }
}
</style>