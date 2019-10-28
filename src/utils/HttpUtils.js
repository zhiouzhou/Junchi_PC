import axios from 'axios'
import qs from 'qs'
let baseUrl = `https://jc.tieyan.top/`


axios.defaults.withCredentials = true

//技术人员管理
function addPersonnel(params){
    return axios.post(`${baseUrl}api/v1/junchi/customer/technician/addTechnicianInfo`,params)
}

export default {
    baseUrl,
    //技术人员管理
    addPersonnel
}
