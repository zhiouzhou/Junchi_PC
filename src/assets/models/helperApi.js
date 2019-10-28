
import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 查询推广列表
    getHelperList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/operations/promotion/getPromotionImages`, params)
    },
    //新增推广图片
    addHelper(params = {}) {
        return axios.post(baseUrl + `api/v1/junchi/operations/promotion/addPromotionImages?access_token=${params.access_token}`, params)
    },
    // 删除推广图片
    deleteHelper(params = {}) {
        return axios.delete(baseUrl + `api/v1/junchi/operations/promotion/removePromotionImage`, params)
    },
    // 修改推广图片显示
    editImgStatus(params = {}) {
        return axios.put(baseUrl + `api/v1/junchi/operations/promotion/freshImageShow?access_token=${params.access_token}&imageId=${params.imageId}&showStatus=${params.isShow}`)

    }
}