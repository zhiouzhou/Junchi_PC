import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询技术员列表
    getPersonnelList(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/technician/getTechniciansInPage?access_token=${params.access_token}&page=${params.page}&size=${params.size}`, params)
    },
    addPersonnel(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/technician/addTechnicianInfo?access_token=${params.access_token}`, params)
    },
    //下拉门店列表
    storeList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/station/getAllStations`, params)
    },
    //删除技术员
    deletePersonnel(params = {}) {
        return axios.delete(baseUrl + `api/v1/junchi/customer/technician/removeTechnician`, params)
    },
    //编辑技术员信息
    editPersonnel(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/customer/technician/freshTechnicianInfo?access_token=${params.access_token}`, params)
    },
    //查询门店预约列表
    getStoreServationList(params={},value={}){
        return axios.post(baseUrl+`api/v1/junchi/customer/task/getAllAdvancedBooks?access_token=${value.access_token}&page=${value.page}&size=${value.size}`,params)
    }
}