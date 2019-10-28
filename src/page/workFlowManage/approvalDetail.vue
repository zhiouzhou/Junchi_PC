<template>
    <div class='approvalDetail'>
        <div class='typeName'>审核类型：{{approvalInfo.typeName}}</div>
        <div>
            <el-steps :active="active" align-center style='margin-top:40px'>
                <el-step :title="item.roleName" v-for="(item,index) in approvalInfo.typeRoleDTOS" :key="index">
                </el-step>
            </el-steps>
        </div>
        <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->

    </div>
</template>
<script>
import http from 'http/approvalManageApi'
 import { mapState } from 'vuex'
export default {
    data(){
        return {
            active:1,
            approvalInfo:{},
        }
    },
    activated() {
        let typeId = this.$route.params.id
        this.getApprovalDetail(typeId)
    },
    methods: {
        getApprovalDetail(typeId){
            let params = {typeId,access_token:this.access_token}
            http.getAuditDetail({params}).then(data=>{
                console.log(data.data)
                if(data.data.code==0){
                    this.approvalInfo = data.data.data
                }
            })
        },
         next() {
        if (this.active++ > 2) this.active = 0;
      }
    },
    computed:{
        ...mapState(`user`,[`access_token`])
    }
}
</script>
<style lang="stylus" scoped>
    
</style>