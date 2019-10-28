import axios from 'axios'
let baseUrl = `https://apis.map.qq.com/`
export default {
    getAddress(params = {}) {
        return axios.post(baseUrl + `ws/geocoder/v1/`, params)
    },


}