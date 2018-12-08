import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

import roomReserveAPI from './room-reserve'
import meetingRoomAPI from './meetingRoom'

import historyAPI from './history'
import billAPI from './bill'
import customerAPI from './customer'
import floorPlanMock from './floor-plan'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 房间预订
Mock.mock(/\/RoomReserve\/FetchList/, 'get', roomReserveAPI.fetchList)
Mock.mock(/\/RoomReserve\/Create/, 'post', roomReserveAPI.create)
Mock.mock(/\/RoomReserve\/Update/, 'post', roomReserveAPI.update)

// 账单
Mock.mock(/\/Bill\/FetchList/, 'get', billAPI.fetchList)
Mock.mock(/\/Bill\/GetBillDetail/, 'get', billAPI.getBillDetail)
Mock.mock(/\/Bill\/AddBillz/, 'post', billAPI.addBillz)
Mock.mock(/\/Bill\/SortBillz/, 'post', billAPI.sortBillz)

// 会议室
Mock.mock(/\/meetingRoom\/list/, 'get', meetingRoomAPI.getList)
Mock.mock(/\/meetingRoom\/create/, 'post', meetingRoomAPI.createMeetingRoomRecord)

// 历史记录
Mock.mock(/\/History\/FetchList/, 'get', historyAPI.fetchList)

// 客人
Mock.mock(/\/Customer\/FetchCustomers/, 'get', customerAPI.fetchList)
Mock.mock(/\/Customer\/GetCustomerDetail/, 'get', customerAPI.getCustomerDetail)
Mock.mock(/\/Customer\/CreateCustomer/, 'post', customerAPI.createCustomer)
Mock.mock(/\/Customer\/UpdateCustomer/, 'post', customerAPI.updateCustomer)

// 平面图
Mock.mock(/\/FloorPlan\/FetchList/, 'get', floorPlanMock.fetchList)
Mock.mock(/\/FloorPlan\/GetDetail/, 'get', floorPlanMock.getDetail)

export default Mock
