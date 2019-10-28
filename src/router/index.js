import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import storeManage from '../page/storeManage/storeManage'
import login from '../page/login/login'
import userInfo from '../page/login/userInfo'
import editUserInfo from '../page/login/editUserInfo'
import personnelManage from '../page/personnelManage/personnelManage'
import addPersonnel from '../page/personnelManage/addPersonnel'
import addStore from '../page/storeManage/addStore'
import techAudit from '../page/auditManage/techAudit'
//审批流程管理
import approvalManage from '../page/workFlowManage/approvalManage'
import approvalDetail from '../page/workFlowManage/approvalDetail'
import editApproval from '../page/workFlowManage/editApproval'
import storeAudit from '../page/auditManage/storeAudit'
import storeStatusManage from '../page/auditManage/storeStatusManage'
import leaveAudit from '../page/auditManage/leaveAudit'
import joinOrLeaveAudit from '../page/auditManage/joinOrLeaveAudit'
//审核技术人员信息和门店
import techAuditInfo from '../page/auditManage/techAuditInfo'
//加入-离开门店-开除技术员审核
import storeStatusAudit from '../page/auditManage/storeStatusAudit'
//请假审核
import leaveInfo from '../page/auditManage/leaveInfo'
//发票管理
import invoiceManage from '../page/invoiceManage/invoiceManage'
//审核发票
import invoiceAudit from '../page/invoiceManage/invoiceAudit'
//商品管理
import productManage from '../page/productManage/productManage'
//录入商品
import addProduct from '../page/productManage/addProduct'
// 商品详情
import productDetail from '../page/productManage/productDetail'
//轮播图管理
import swiperManage from '../page/swiperManage/swiperManage'
//新增轮播图
import addSwiper from '../page/swiperManage/addSwiper'
//交易趋势
import tradingTrend from '../page/statistics/tradingTrend'
// 门店选择经纬度
import selectAddress from '../page/storeManage/selectAddress'
// 操作日志管理
import perationRecode from '../page/perationRecode/perationRecode'
//咨讯管理
import informationManage from '../page/informationManage/informationManage'
//新增资讯
import addInformation from '../page/informationManage/addInformation'
//常见问题与答案
import questionAndAnswer from '../page/questionAndAnswer/questionAndAnswer'
//录入常见问题与答案
import addQuesAndAns from '../page/questionAndAnswer/addQuesAndAns'
//投诉与建议
import comAndSug from '../page/comAndSug/comAndSug'
//更新投诉与建议状态
import editComAndSugType from '../page/comAndSug/editComAndSugType'
//客服电话管理
import telephoneManage from '../page/telephoneManage/telephoneManage'
//新增客服电话
import addTelephone from '../page/telephoneManage/addTelephone'
//新增活动
import addActive from '../page/activeManage/addActive'
//活动管理
import activeManage from '../page/activeManage/activeManage'
//查看报名人员列表
import enrollRecordsList from '../page/activeManage/enrollRecordsList'
// 订单管理
import orderManage from '../page/orderManage/orderManage'
//订单详情
import orderDetail from '../page/orderManage/orderDetail'
//推广助手
import helper from '../page/helper/helper'
//新增推广助手
import addHelper from '../page/helper/addHelper'
//修改状态
import editHelper from '../page/helper/editHelper'
//权限管理
import limitManage from '../page/limitManage/limitManage'
//新增管理员
import addAdmin from '../page/limitManage/addAdmin'
//查询门店预约
import storeReservation from '../page/storeReservation/storeReservation'
//安裝任務
import installTask from '../page/taskManage/installTask'
//維修任務
import repairTask from '../page/taskManage/repairTask'
//用户列表
import userList from '../page/statistics/userList'
//上下架关系图
import tree from '../page/statistics/tree'
//技工门店分成收益配置
import profitDispose from '../page/disposeManage/profitDispose'
//更新配置
import editProfit from '../page/disposeManage/editProfit'
//订单配置
import orderDispose from '../page/disposeManage/orderDispose'
//门店信誉分详情
import scoreDetail from '../page/storeManage/scoreDetail'
//指派门店
import assignStore from '../page/orderManage/assignStore'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: userInfo,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/editUserInfo',
      name: 'editUserInfo',
      component: editUserInfo,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/storeManage',
      name: 'storeManage',
      component: storeManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addStore',
      name: 'addStore',
      component: addStore,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/personnelManage',
      name: 'personnelManage',
      component: personnelManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addPersonnel',
      name: 'addPersonnel',
      component: addPersonnel,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/techAudit',
      name: 'techAudit',
      component: techAudit,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/approvalManage',
      name: 'approvalManage',
      component: approvalManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/approvalDetail',
      name: 'approvalDetail',
      component: approvalDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/editApproval',
      name: 'editApproval',
      component: editApproval,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/storeAudit',
      name: 'storeAudit',
      component: storeAudit,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/storeStatusManage',
      name: 'storeStatusManage',
      component: storeStatusManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/leaveAudit',
      name: 'leaveAudit',
      component: leaveAudit,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/leaveInfo',
      name: 'leaveInfo',
      component: leaveInfo,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/joinOrLeaveAudit',
      name: 'joinOrLeaveAudit',
      component: joinOrLeaveAudit,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/techAuditInfo',
      name: 'techAuditInfo',
      component: techAuditInfo,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/storeStatusAudit',
      name: 'storeStatusAudit',
      component: storeStatusAudit,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/invoiceManage',
      name: 'invoiceManage',
      component: invoiceManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/invoiceAudit',
      name: 'invoiceAudit',
      component: invoiceAudit,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/productManage',
      name: 'productManage',
      component: productManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addProduct',
      name: 'addProduct',
      component: addProduct,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: productDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/swiperManage',
      name: 'swiperManage',
      component: swiperManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addSwiper',
      name: 'addSwiper',
      component: addSwiper,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/tradingTrend',
      name: 'tradingTrend',
      component: tradingTrend,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/selectAddress',
      name: 'selectAddress',
      component: selectAddress,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/perationRecode',
      name: 'perationRecode',
      component: perationRecode,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/informationManage',
      name: 'informationManage',
      component: informationManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addInformation',
      name: 'addInformation',
      component: addInformation,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/questionAndAnswer',
      name: 'questionAndAnswer',
      component: questionAndAnswer,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addQuesAndAns',
      name: 'addQuesAndAns',
      component: addQuesAndAns,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/comAndSug',
      name: 'comAndSug',
      component: comAndSug,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/editComAndSugType',
      name: 'editComAndSugType',
      component: editComAndSugType,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/telephoneManage',
      name: 'telephoneManage',
      component: telephoneManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addTelephone',
      name: 'addTelephone',
      component: addTelephone,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/activeManage',
      name: 'activeManage',
      component: activeManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addActive',
      name: 'addActive',
      component: addActive,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/enrollRecordsList',
      name: 'enrollRecordsList',
      component: enrollRecordsList,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/orderManage',
      name: 'orderManage',
      component: orderManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/helper',
      name: 'helper',
      component: helper,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addHelper',
      name: 'addHelper',
      component: addHelper,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/editHelper',
      name: 'editHelper',
      component: editHelper,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/limitManage',
      name: 'limitManage',
      component: limitManage,
      meta: {
        keepalive: true
      }
    },
    {
      path: '/addAdmin',
      name: 'addAdmin',
      component: addAdmin,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/storeReservation',
      name: 'storeReservation',
      component: storeReservation,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/installTask',
      name: 'installTask',
      component: installTask,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/repairTask',
      name: 'repairTask',
      component: repairTask,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/userList',
      name: 'userList',
      component: userList,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/tree',
      name: 'tree',
      component: tree,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/profitDispose',
      name: 'profitDispose',
      component: profitDispose,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/editProfit',
      name: 'editProfit',
      component: editProfit,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/orderDispose',
      name: 'orderDispose',
      component: orderDispose,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/scoreDetail',
      name: 'scoreDetail',
      component: scoreDetail,
      meta: {
        keepalive: true
      }
    },
    {
      path:'/assignStore',
      name: 'assignStore',
      component: assignStore,
      meta: {
        keepalive: true
      }
    }

  ]
})
