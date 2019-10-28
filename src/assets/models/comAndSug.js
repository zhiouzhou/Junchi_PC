import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询投诉与建议
    getComAndSugList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/operations/compsugg/getCSList`, params)
    },
    //更改状态
    editType(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/operations/compsugg/freshDeal?access_token=${params.access_token}`, params)
    },
    //提交售后处理
    commitDeal(params = {}) {
        return axios.put(baseUrl + `api/v1/junchi/operations/compsugg/upDeal?access_token=${params.access_token}&id=${params.id}`)
    },
}