import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {
    // 获取交易趋势
    getTrendList(params = {}) {
        return axios.get(baseUrl + `api/v1/jc/mall/order/statistics/trend`, params)
    },
    //获取不同商品型号销售比例
    getSaleList(params = {}) {
        return axios.get(baseUrl + `api/v1/jc/mall/order/statistics/goodsModel`, params)
    },
    //获取用户角色比例统计
    getUserRole(params = {}) {
        return axios.get(baseUrl + `api/v1/user/statistics/userRole`, params)
    },
    //用户增长量统计
    getGrowth(params = {}) {
        return axios.get(baseUrl + `api/v1/user/statistics/trend`, params)
    },
    //获取用户列表
    getUserList(params = {}) {
        return axios.get(baseUrl + `api/v1/user/list`, params)
    },
    //查看传播链
    getUserChain(params = {}) {
        return axios.get(baseUrl + `api/v1/user/transmission`, params)
    },
    //设置内部销售员工
    setSalesStaff(params={},memberId,access_token){
        return axios.put(baseUrl+`api/v1/user/${memberId}/innerSales?innerSales=${params.innerSales}&access_token=${access_token}`)
    }
}