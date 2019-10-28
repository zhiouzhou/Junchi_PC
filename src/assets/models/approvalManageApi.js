import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询流程审批列表
    getApprovalList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/auditconfirm/getAuditConfirmTypes`, params)
    },
    //查询审核类型详情
    getAuditDetail(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/auditconfirm/getAuditConfirmType`,params)
    },

    //查看申请列表
    getApplyList(params={},value={}){
        return axios.post(baseUrl+`api/v1/junchi/customer/apply/getMyAuthApplications?access_token=${value.access_token}&page=${value.page}&size=${value.size}`,params)
    },
    //获取部门列表
    getDepartList(params = {}){
        return axios.get(baseUrl+`api/v1/auth/admin/group/list`,params)
    },
    //获取部门中的角色
    getRoleList(params = {}){
        return axios.get(baseUrl+`api/v1/auth/admin/role/list`,params)
    },
    //添加審核階段
    addAuditRole(data = {}){
        return axios.post(baseUrl+`api/v1/junchi/customer/auditconfirm/addAuditConfirmRole?access_token=${data.access_token}`,data)
    },
    //删除审核阶段
    deleteAuditRole(params={}){
        return axios.get(baseUrl+`api/v1/junchi/customer/auditconfirm/rmAuditConfrimRole`,params)
    },
    // 审核技术人员认证 ----  获取库里的认证信息
    getApplyInfo(params={}){
        return axios.get(baseUrl+`api/v1/junchi/customer/technician/getTechnician`,params)
    },
    //技术人员审核
    authAudit(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/technician/authTech`,params)
    },
    // 审核门店审核认证 ----  获取库里的认证信息
    getStoreApplyInfo(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/station/getStation`,params)
    },
    //门店审核
    storeAudit(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/station/authStation`,params)
    },
    // 审核变更门店状态申请
    storeStatusAudit(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/station/auditStatusApply`,params)
    },
    //请假审核
    leaveAudit(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/technician/auditLeaveApply`,params)
    },
    //加入或离开门店审核
    joinOrLeaveAudit(params = {}){
        return axios.get(baseUrl+`api/v1/junchi/customer/station/auditDismissApply`,params)
    },
}