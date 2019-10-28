import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询流程审批列表
    login(params = {}) {
        return axios.post(baseUrl + `api/v1/auth/login/account?account=${params.account}&password=${params.password}`)
    },
    // 查询用户信息
    getUserInfo(params = {}) {
        return axios.get(baseUrl + `api/v1/user`, params)

    },
    //获取手机验证码
    getCode(params = {}) {
        return axios.get(baseUrl + `api/v1/auth/code/SMS`, params)
    },
    //获取邮箱验证码
    getEmailCode(params = {}) {
        return axios.get(baseUrl + `api/v1/auth/code/EMAIL`, params)
    },
    //修改昵称
    editNickName(params = {}) {
        return axios.put(baseUrl + `api/v1/user/${params.memberId}?access_token=${params.access_token}`, params)
    },
    //修改手机号
    editMobile(params = {}) {
        return axios.put(baseUrl + `api/v1/user/${params.memberId}/mobile?access_token=${params.access_token}&mobile=${params.mobile}&codeId=${params.codeId}&smsCode=${params.smsCode}&password=${params.password}`)
    },
    //绑定邮箱
    editEmail(params = {}) {
        return axios.post(baseUrl + `api/v1/auth/binding/email?email=${params.email}&access_token=${params.access_token}&codeId=${params.codeId}&emailCode=${params.emailCode}`)
    },
    //设置密码
    editPassword(params = {}) {
        return axios.post(baseUrl + `api/v1/auth/account/setLoginPass?access_token=${params.access_token}&newPass=${params.newPass}&oldPass=${params.oldPass}`)
    },
    //获取目录树
    getMenuList(params={}){
        return axios.get(baseUrl + `api/v1/auth/resource`, params)
    }
}