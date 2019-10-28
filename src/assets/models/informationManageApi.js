import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default  {
    // 查询资讯列表
    getInformationList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/operations/news/getShowNews`, params)
    },
    //新增资讯
    addInformation(params={}){
        return axios.post(baseUrl+`api/v1/junchi/operations/news/addNewsInfomation?access_token=${params.access_token}`,params)
    },
    // 删除资讯
    deleteInfomation(params = {}){
        return axios.delete(baseUrl+`api/v1/junchi/operations/news/removeNews`,params)
    },
    //更新资讯
    editInfomation(params = {}){
        return axios.post(baseUrl+`api/v1/junchi/operations/news/updateNewsInformation?access_token=${params.access_token}`,params)
    }
}