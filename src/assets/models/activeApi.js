import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 添加活动
    addActive(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/operations/activity/addActivity?access_token=${params.access_token}`, params)
    },
    //查询活动列表
    getActiveList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/operations/activity/getActivityInfos`, params)
    },
    //删除活动
    deleteActive(params = {}) {
        return axios.delete(baseUrl + `api/v1/junchi/operations/activity/removeActivity`, params)
    },
    //查询活动报名人员
    getPersonnelList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/operations/activity/getEnrollRecords`, params)
    },
    //更新活动默认页面
    upDateDefalutPage(params = {}) {
        return axios.put(baseUrl + `api/v1/junchi/operations/page/updateActivityPage?access_token=${params.access_token}&pageKey=${params.pageKey}`)
    },

}