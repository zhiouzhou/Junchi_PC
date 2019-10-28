import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default {

    //获取订单列表
    getOrderList(params = {}) {
        return axios.get(baseUrl + `api/v1/jc/mall/order/list_all`, params)
    },
    //打款
    makeMoney(params = {}) {
        return axios.post(baseUrl + `api/v1/jc/mall/order/confirmOrderFinish?access_token=${params.access_token}&orderNo=${params.orderNo}`)
    },
    //查询订单预约门店信息
    getStoreInfo(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/task/getAdvancedBook`, params)
    },
    //查询订单安装任务
    getInstallInfo(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/task/getOrderTask`, params)
    },
    //查询附近门店
    getStoreList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/station/getStationsNearbyWithStatics`, params)
    },
    //指派门店
    assignStore(params = {}, access_token) {
        return axios.post(baseUrl + `api/v1/junchi/customer/task/designStation?access_token=${access_token}`, params)
    },
    //订单涉及佣金记录
    getCommission(params = {}) {
        return axios.get(baseUrl + `api/v1/user/wallet/orderTradeDetails`, params)
    },
    //查询订单收益记录
    getIncomeRecord(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/customer/wallet/getOrderEarnings`, params)
    },

}