<template>
    <div>
        <h2 style="text-align:center">变更门店状态审核</h2>

        <div class="container">
            <!-- 用户申请审核信息 -->
            <div class="container-info">
                <div class="info">
                    <span>申请类型：</span>
                    <span>{{storeStatusInfo.authType==7?'门店申请休业':storeStatusInfo.authType==8?'门店申请恢复营业':storeStatusInfo.authType==9?'门店申请解除异常':''}}</span>
                </div>
                <div class="info">
                    <span>申请原因：</span>
                    <span >{{storeStatusInfo.operCause}}</span>
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
        name: `storeStatusAudit`,
        data() {
            return {
                storeStatusInfo: {},
                libraryInfo: {},
                applyId: ``,
            }
        },
        activated() {
            let storeStatusInfo = JSON.parse(this.$route.query.authContent)
            let applyId = this.$route.query.applyId
            console.log(storeStatusInfo)
            this.storeStatusInfo = storeStatusInfo
            this.applyId = applyId
            console.log(storeStatusInfo)
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
                http.storeStatusAudit({params}).then(data=>{
                    if (data.data.code == 0) {
                            that.$message(`已提交审核`)
                            that.$router.go(-1)
                        } else {
                            that.$message(data.data.desc)
                        }
                        console.log(data.data)
                })


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