import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询技工门店分成收益配置
    getStoreProfit(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/configuration/getEarningConfig`, params)
    },
    //更新配置
    editProfit(params = {}, value = {}) {
        console.log(value)
        return axios.post(baseUrl + `api/v1/junchi/customer/configuration/freshEarningConfig?access_token=${value.access_token}`, params)
    },
    //查看佣金
    getCommision(params = {}) {
        return axios.get(baseUrl + `api/v1/user/setting/profit`, params)
    },
    //设置佣金
    editCommi(params = {}, value = {}) {
        console.log(value)
        return axios.post(baseUrl + `api/v1/user/setting/profit?access_token=${value.access_token}`, params)
    },
}