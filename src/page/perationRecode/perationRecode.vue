<template>
  <div id="perationRecode">
    <el-form
      :inline="true"
      :model="journalInfo"
      size="medium"
      label-width="100px"
      label-suffix="："
      class="demo-form-inline"
      ref="journalInfo"
    >
      <el-form-item label="操作者">
        <!-- <el-select v-model="journalInfo.memberId" clearable>
          <el-option
            v-for="item in memberOPtions"
            :key="item.value"
            :label="item.sex"
            :value="item.value"
          ></el-option>
        </el-select>-->
        <el-input v-model.trim="journalInfo.memberId" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select
          v-model="servTypes"
          @change="selectServType"
          clearable
          @clear="clearServ('servTypes')"
        >
          <el-option
            v-for="item in servTypesOptions"
            :key="item.name"
            :label="item.showName"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子业务类型">
        <el-select
          v-model="actions"
          @change="selectActions"
          clearable
          :disabled="!servTypes?true:false"
          @clear="clearServ('actions')"
        >
          <el-option
            v-for="item in actionsOptions"
            :key="item.name"
            :label="item.showName"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作结果">
        <el-select v-model="journalInfo.result" clearable>
          <el-option
            v-for="item in resultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检索时间">
        <el-date-picker
          v-model="timeArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:20px;">
        <el-button type="primary" @click="getJournalList('clickCheck')" size="medium">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="journalList" border style="width: 100%;margin-top:14px;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item
              v-for="(item,index) in props.row.record.data"
              :key="index"
              :label="item.showName"
            >
              <span>{{item.value}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="58" type="index"></el-table-column>
      <el-table-column label="操作时间" prop="record.time"></el-table-column>
      <el-table-column label="会员标识">
        <template slot-scope="scope">
          <span>{{scope.row.record.operator.memberId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.record.operator.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码">
        <template slot-scope="scope">
          <span>{{scope.row.record.operator.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型">
        <template slot-scope="scope">
          <span>{{scope.row.record.servType.showName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="子业务类型">
        <template slot-scope="scope">
          <span>{{scope.row.record.action.showName}}</span>
        </template>
      </el-table-column>
      <div
        slot="append"
        style="text-align: center;font-size:13px;color:#409EFF;border-bottom:1px solid #eaeaea;padding:12px 0 ;cursor:pointer"
        @click="getMore"
        v-if="journalList&&journalList.length!=0"
      >
        <span>点击加载更多...</span>
      </div>
      <!-- <div
        slot="append"
        style="text-align: center;font-size:13px;color:#409EFF;border-bottom:1px solid #eaeaea;padding:12px 0;cursor:pointer"
        v-if="noMore&&journalList"
      >
        <span>没有更多数据了...</span>
      </div>-->
    </el-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "http/perationRecodeApi";

export default {
  data() {
    return {
      journalInfo: {
        access_token: ``,
        memberId: null,
        // servTypes: null, //业务类型
        // actions: null, //子业务类型
        result: null, //操作结果
        startTime: null, //检索的开始时间
        endTime: null, //检索的结束时间
        size: 8,
        servTypes: [],
        actions: [],
        searchAfterTime: null, //一页最后一条记录的time，第一页为null,返回日志记录中的time字段
        searchAfterId: null //上一页最后一条记录的id，第一页为null,返回日志记录中的id字段
      },
      servTypes: ``,
      actions: ``,
      timeArr: [],
      memberOPtions: [], //会员id列表
      servTypesOptions: [], //业务类型列表
      actionsOptions: [], //子业务类型列表
      resultOptions: [
        {
          label: "积极结果",
          value: "0"
        },
        {
          label: "消极结果",
          value: "1"
        }
      ],
      journalList: [],
      noMore: false
    };
  },
  activated() {
    (this.journalInfo.access_token = this.access_token), this.getJournalList();
    this.journalList = [];
    this.getServTypesOptions();
  },
  methods: {
    getJournalList(type) {
      let params = this.journalInfo;
      // let params = {access_token:this.access_token,size:8}
      if (type == "clickCheck") {
        this.journalList = [];
        this.journalInfo.searchAfterTime = ``;
        this.journalInfo.searchAfterId = ``;
      }
      http.getJournalList(params).then(data => {
        console.log(data.data);

        if (
          (!data.data.data || data.data.data.length == 0) &&
          (!this.journalInfo.searchAfterTime && !this.journalInfo.searchAfterId)
        ) {
          this.journalList = [];
          this.noMore = true;
        } else if (
          (!data.data.data || !data.data.data.length) &&
          (this.journalInfo.searchAfterTime && this.journalInfo.searchAfterId)
        ) {
          // this.journalList = this.journalList
          this.$message(`没有更多数据了`);
          this.noMore = true;
        } else {
          let oldArr = this.journalList;
          let newArr = data.data.data;
          let finaArr = oldArr.concat(newArr);
          this.journalList = finaArr;
        }
      });
    },
    //获取全部业务类型列表
    getServTypesOptions() {
      let params = { access_token: this.access_token };
      http.getServTypesOptions({ params }).then(data => {
        console.log(data.data);
        this.servTypesOptions = data.data.data;
      });
    },
    //获取子业务类型
    getActionsOptions() {},
    selectServType(name) {
      console.log(name);
      this.journalInfo.servTypes = [name];
      let params = { access_token: this.access_token, servTypeName: name };
      http.getActionsOptions({ params }).then(data => {
        console.log(data.data.data);
        this.actionsOptions = data.data.data;
      });
    },
    selectActions(name) {
      this.journalInfo.actions = [name];
    },
    //获取更多
    getMore() {
      // 获取一页中的最后一条数据
      let endInfo = this.journalList[this.journalList.length - 1];
      console.log(endInfo);
      this.journalInfo.searchAfterTime = endInfo.time;
      this.journalInfo.searchAfterId = endInfo.id;
      console.log(this.journalInfo);
      this.getJournalList();
    },
    clearServ(type) {
      console.log(type);
      if (type == "servTypes") {
        this.journalInfo.servTypes = [];
      } else if (type == "actions") {
        this.journalInfo.actions = [];
      }
    },
    selectTime(arr) {
      if (arr == null) {
        this.timeArr = [];
        this.journalInfo.startTime = ``;
        this.journalInfo.endTime = ``;
      } else {
        this.journalInfo.startTime = arr[0];
        this.journalInfo.endTime = arr[1];
      }
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`])
  }
};
</script>
<style lang="stylus" scoped>
#perationRecode {
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>