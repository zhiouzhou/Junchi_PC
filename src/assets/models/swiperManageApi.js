import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    addSwiper(params={}) {
        return axios.post(baseUrl + `api/v1/junchi/operations/carousel/addCarousel?access_token=${params.access_token}`, params)
    },
    //获取门店列表
    getSwiperList(params={}){
        return axios.get(baseUrl + `api/v1/junchi/operations/carousel/getAllCarousels`,params)
    },
    //上传图片获取uploadToken
    getUploadToken(params={}){
        return axios.get(baseUrl + `api/v1/tagua/qiniu/token`,params)
    },
    //删除轮播图
    deleteSwiper(params={}){
        return axios.delete(baseUrl + `api/v1/junchi/operations/carousel/removeCarousel`,params)
    }

}