import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default  {
    // 查询投诉电话列表
    getPhoneList(params={}){
        return axios.get(baseUrl + `api/v1/junchi/operations/phone/getPhones`, params)
    },
    //更新客服电话
    editPhone(params={}){
        return axios.post(baseUrl + `api/v1/junchi/operations/phone/freshServicePhone?access_token=${params.access_token}`, params)
    },
    //新增电话
    addPhone(params={}){
        return axios.post(baseUrl + `api/v1/junchi/operations/phone/addPhone?access_token=${params.access_token}`, params)
    },
    deletePhone(params){
        return axios.delete(baseUrl + `api/v1/junchi/operations/phone/rmServicePhone`, params)
    },
}