import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default{
    //查询操作日志记录
    getJournalList(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/operations/logRecord/getLogRecords?access_token=${params.access_token}`, params)
    },
    //获取全部业务类型列表
    getServTypesOptions(params = {}){
         return axios.get(baseUrl + `api/v1/junchi/operations/logRecord/getServTypes`, params)
    },
    //获取全部子业务类型列表
    getActionsOptions(params = {}){
        return axios.get(baseUrl + `api/v1/junchi/operations/logRecord/getActionsByServType`, params)
   },
}