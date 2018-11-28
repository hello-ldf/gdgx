import Mock from 'mockjs'
import { parseTime, param2Obj } from '@/utils'

const List = []
const count = 100

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    checkInDT: +Mock.Random.date('T'),
    date: +Mock.Random.date('T'),
    time: +Mock.Random.date('T'),
    meetingRoomNo: '@integer(501, 520)',
    peopleNum: '@integer(1, 10)',
    bookMan: '@first',
    firstName: '@first',
    lastName: '@first',
    roomNo: '@integer(300, 5000)',
    free: '@integer(0, 100)',
    payway: '付款方式',
    device: '设备',
    staff: '@first',
    remark: '备注',
    'state|1': ['book', 'complete', 'cancel'],

    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: '我是测试数据',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

export default {
  // 获取会议记录
  getList: config => {
    // const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    const { firstName, lastName, checkInDT, roomNo, stateJson, page = 1, limit = 20, sort } = param2Obj(config.url)
    var state = JSON.parse(stateJson)
    // if (stateJson) {
    //   console.log(JSON.parse(stateJson))
    // }

    function compare(property) {
      return function(obj1, obj2) {
        var value1 = obj1[property]
        var value2 = obj2[property]
        return value2 - value1 // 降序
      }
    }

    let mockList = List.filter(item => {
      if (firstName && item.firstName.toUpperCase().indexOf(firstName.toUpperCase()) < 0) return false
      if (lastName && item.lastName.toUpperCase().indexOf(lastName.toUpperCase()) < 0) return false
      if (checkInDT && parseTime(item.checkInDT, '{y}-{m}-{d}') !== parseTime(checkInDT, '{y}-{m}-{d}')) return false
      if (roomNo && item.roomNo.toString().indexOf(roomNo.toString()) < 0) return false
      if (state.length > 0 && state.indexOf(item.state) < 0) return false
      return true
    }).sort(compare('checkInDT'))

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createMeetingRoomRecord: (config) => {
    const data = JSON.parse(config.body)
    List.unshift(data)
    return { data: 'success' }
  },
  updateArticle: () => ({
    data: 'success'
  })
}
