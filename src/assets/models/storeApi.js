import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    addStore(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/station/addStationInfo?access_token=${params.access_token}`, params)
    },
    //获取门店列表
    getStoreList(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/station/getStationsList?access_token=${params.access_token}&page=${params.page}&size=${params.size}`, params)
    },
    //删除门店
    deleteStore(params = {}) {
        return axios.delete(baseUrl + `api/v1/junchi/customer/station/removeStation`, params)

    },
    //编辑门店信息
    editStore(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/station/freshStationInfo?access_token=${params.access_token}`, params)
    }

}