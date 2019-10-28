<template>
    <div>
        <h2 style="text-align:center">{{pageType=='leave'?'请假审核':'技术员离开或加入门店审核'}}</h2>

        <div class="container">
            <!-- 用户申请审核信息 -->
            <div class="container-info">
                <div class="info">
                    <span>申请类型：</span>
                    <span>{{pageType=='leave'?'请假审核':'技术员离开或加入门店审核'}}</span>
                </div>
                <div class="info">
                    <span>申请原因：</span>
                    <span>{{pageType=='leave'?leaveInfo.leaveCause:leaveInfo.operCause}}</span>
                </div>
                <div style="margin-top:20px">
                    <el-button type="primary" @click="auditBtn(1)" size="medium">同意</el-button>
                    <el-button type="info" @click="auditBtn(0)" style="margin-left:40px;" size="medium">不同意</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import http from 'http/approvalManageApi'
    import { mapState } from 'vuex'
    export default {
        name: `leaveInfo`,
        data() {
            return {
                leaveInfo: {},
                applyId: ``,
                pageType: ``
            }
        },
        activated() {
            let leaveInfo = JSON.parse(this.$route.query.authContent)
            let applyId = this.$route.query.applyId
            let pageType = this.$route.query.pageType
            console.log(leaveInfo)
            this.leaveInfo = leaveInfo
            this.applyId = applyId
            this.pageType = pageType
            console.log(applyId)
        },
        computed: {
            ...mapState(`user`, [`access_token`])
        },
        methods: {
            auditBtn(authResult) {
                //authResult 为0未批准 1为批准
                let params = { authResult, applyId: this.applyId, access_token: this.access_token }
                let that = this

                console.log(authResult)
                if (this.pageType == 'leave') {
                    http.leaveAudit({ params }).then(data => {
                        if (data.data.code == 0) {
                            that.$message(`已提交审核`)
                            that.$router.go(-1)
                        } else {
                            that.$message(data.data.desc)
                        }
                        console.log(data.data)
                    })
                }else {
                    http.joinOrLeaveAudit({params}).then(data=>{
                        if (data.data.code == 0) {
                            that.$message(`已提交审核`)
                            that.$router.go(-1)
                        } else {
                            that.$message(data.data.desc)
                        }
                        console.log(data.data)
                    })
                }


            },
        },
    }
</script>
<style lang="stylus" scoped>
    .container {
        display: flex;
        /* align-items: center; */
        margin-top: 40px;
        border: 1px solid #ededed;
        padding: 20px
    }

    .container-info {
        flex: 50%;
        border-right: 2px dashed #eaeaea;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center
    }

    .info {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
    }

    .info>span {
        padding-right: 20px
    }

    .card-img {
        width: 190px;
        height: 160px;
    }
</style>