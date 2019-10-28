import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询下级管理员
    getSubsList(params = {}) {
        return axios.get(baseUrl + `api/v1/auth/admin/subs`, params)
    },
    //查询所有角色
    getRoleList(params = {}) {
        return axios.get(baseUrl + `api/v1/auth/admin/subRoles`, params)
    },
    //更改角色
    editRole(params = {}) {
        return axios.put(baseUrl + `api/v1/auth/admin?access_token=${params.access_token}`, params)
    },
    //查询用户
    getAdmin(params = {}) {
        return axios.get(baseUrl + `api/v1/user/account`, params)
    },
    //添加管理员
    addAdmin(params = {}) {
        return axios.post(baseUrl + `api/v1/auth/admin?access_token=${params.access_token}`, params)
    },
    //删除
    deleteRole(params = {}) {
        return axios.delete(baseUrl + `api/v1/auth/admin/${params.memberId}?access_token=${params.access_token}`,params)
    },
}