<template>
    <div>
        <h2 style="text-align:center">{{pageType=='tech'?'技术人员认证审核':'门店认证审核'}}</h2>

        <div class="container">
            <!-- 用户申请审核信息 -->
            <div class="container-info">
                <div class="info">
                    <span>授权证书编号：</span>
                    <span>{{pageType=='tech'?techAuditInfo.certNo:techAuditInfo.contractNo}}</span>
                </div>
                <div class="info">
                    <span>身份证正面照：</span>
                    <img :src="techAuditInfo.frontSide" class="card-img" />
                </div>
                <div class="info">
                    <span>身份证背面照：</span>
                    <img :src="techAuditInfo.backSide" class="card-img" />
                </div>
                <div style="margin-top:20px">
                    <el-button type="primary" @click="auditBtn(1)" size="medium">同意</el-button>
                    <el-button type="info" @click="auditBtn(0)" style="margin-left:40px;" size="medium">不同意</el-button>
                </div>
            </div>
            <!-- //技术人员信息   -->
            <div class="container-info" style="border-right:none" v-if='pageType=="tech"'>
                <div class="info">
                    <span>授权证书编号：</span>
                    <span>{{libraryInfo.certificateNo}}</span>
                </div>
                <div class="info">
                    <span>身份证号：</span>
                    <span>{{libraryInfo.cardId}}</span>
                </div>
            </div>
            <!-- 门店审核信息 -->
            <div class="container-info" style="border-right:none" v-else>
                <div class="info">
                    <span>安装点名称：</span>
                    <span>{{libraryInfo.stationName || ''}}</span>
                </div>
                <div class="info">
                    <span>安装点位置：</span>
                    <span>{{libraryInfo.stationLocation||''}}</span>
                </div>
                <div class="info">
                    <span>店主名称：</span>
                    <span>{{libraryInfo.hostName||''}}</span>
                </div>
                <div class="info">
                    <span>联系方式：</span>
                    <span>{{libraryInfo.contactWay||''}}</span>
                </div>
                <div class="info">
                    <span>身份证号：</span>
                    <span>{{libraryInfo.cardId||''}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import http from 'http/approvalManageApi'
    import { mapState } from 'vuex'
    export default {
        name: `techAuditInfo`,
        data() {
            return {
                techAuditInfo: {},
                libraryInfo: {},
                applyId: ``,
                pageType: ``,
            }
        },
        activated() {
            let techAuditInfo = JSON.parse(this.$route.query.authContent)
            let applyId = this.$route.query.applyId
            let pageType = this.$route.query.pageType
            console.log(pageType)
            this.techAuditInfo = techAuditInfo
            this.applyId = applyId
            this.pageType = pageType
            console.log(techAuditInfo)
            this.getApplyInfo()
        },
        computed: {
            ...mapState(`user`, [`access_token`])
        },
        methods: {
            //获取库里的申请信息
            getApplyInfo() {
                let pageType = this.pageType
                let that = this
                if (pageType == 'tech') {
                    let params = { certNo: this.techAuditInfo.certNo, access_token: this.access_token }
                    http.getApplyInfo({ params }).then(data => {
                        console.log(data.data)
                        that.libraryInfo = data.data.data
                    })
                }else {
                    let params = { contractNo: this.techAuditInfo.contractNo, access_token: this.access_token }
                    http.getStoreApplyInfo({ params }).then(data => {
                        console.log(data.data)
                        that.libraryInfo = data.data.data
                    }) 
                }

            },
            auditBtn(authResult) {
                //authResult 为0未批准 1为批准
                let pageType = this.pageType
                let params = { authResult, applyId: this.applyId, access_token: this.access_token }
                let paramsStore = {contractNo:this.techAuditInfo.contractNo,authResult, applyId: this.applyId, access_token: this.access_token}
                let that = this
                console.log(authResult)
                if (pageType == 'tech') {
                    http.authAudit({ params }).then(data => {
                        if (data.data.code == 0) {
                            that.$message(`已提交审核`)
                            that.$router.go(-1)
                        } else {
                            that.$message(data.data.desc)
                        }
                        console.log(data.data)
                    })
                } else {
                   
                    http.storeAudit({ params:paramsStore }).then(data => {
                        if (data.data.code == 0) {
                            that.$message(`已提交审核`)
                            that.$router.go(-1)
                        } else {
                            that.$message(data.data.desc)
                        }
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