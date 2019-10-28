import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    //添加商品
    addProduct(params = {}) {
        return axios.post(baseUrl + `api/v1/jc/mall/goods?access_token=${params.access_token}`, params)
    },
    //获取商品列表
    getProductList(params = {}) {
        return axios.get(baseUrl + `api/v1/jc/mall/goods/list`, params)
    },
    //删除商品
    deleteProduct(params = {}) {
        return axios.delete(baseUrl + `api/v1/jc/mall/goods/${params.no}?access_token=${params.access_token}`)

    },
    // 修改商品信息
    editProduct(params={}){
        return axios.put(baseUrl+`api/v1/jc/mall/goods/${params.no}?access_token=${params.access_token}`,params)
    },
    //上移下移商品位置
    movePosition(params={}){
        return axios.post(baseUrl+`api/v1/jc/mall/goods/${params.no}/shift?access_token=${params.access_token}&direction=${params.direction}`)
    }

}