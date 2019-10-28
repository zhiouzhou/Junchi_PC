import axios from 'axios'
import Urls from './baseUrl'
let baseUrl = Urls.baseUrl
export default  {
    // 查询问题与答案列表
    getQuestionList(params = {}) {
        return axios.get(baseUrl + `api/v1/junchi/operations/qanswer/getQAs`, params)
    },
    //删除问题与答案
    deleteQuesAndAns(params={}){
        return axios.delete(baseUrl + `api/v1/junchi/operations/qanswer/rmQA`, params)
    },
    //录入问题与答案
    addQuesAndAns(params={}){
        return axios.post(baseUrl+`api/v1/junchi/operations/qanswer/addQA?access_token=${params.access_token}`,params)
    }
}