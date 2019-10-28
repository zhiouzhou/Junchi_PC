import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    //获取安装任务
    getInstallList(params={},value={}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/task/getTaskList?access_token=${value.access_token}&page=${value.page}&size=${value.size}`, params)
    },
    //获取维修任务
    getRepairTask(params={},value={}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/maintenance/getMaintenaceTasks?access_token=${value.access_token}&page=${value.page}&size=${value.size}&isStation=${value.isStation}`, params)
    },
    
}