import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default  {
    // 查询开票历史列表
    getInvoiceList(params = {}) {
        return axios.get(baseUrl + `api/v1/jc/mall/order/invoice/allHistory`, params)
    },
    //审核发票
    auditInvoice(params = {}){
        return axios.put(baseUrl + `api/v1/jc/mall/order/invoice/${params.invoiceId}?access_token=${params.access_token}`, params)
    },
    //查询订单详情
    getOrderInfo(params = {}){
        return axios.get(baseUrl + `api/v1/jc/mall/order`, params)
    },
}