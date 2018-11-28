// import Mock from 'mockjs'
import { param2Obj, compare, parseTime } from '@/utils'

const order_customer_list = []

export default {
  fetchList: config => {
    const { firstName, lastName, checkinDate, roomNo, page = 1, limit = 20 } = param2Obj(config.url)

    const mockList = order_customer_list.filter(item => {
      if (firstName && item.firstName.toUpperCase().indexOf(firstName.toUpperCase()) < 0) return false
      if (lastName && item.lastName.toUpperCase().indexOf(lastName.toUpperCase()) < 0) return false
      if (checkinDate && parseTime(item.checkinDate, '{y}-{m}-{d}') !== parseTime(checkinDate, '{y}-{m}-{d}')) return false
      if (roomNo && item.roomNo.toString().indexOf(roomNo.toString()) < 0) return false
      return true
    }).sort(compare('checkinDate'))

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  }
}

// 初始化订单客人
export function initOCList(rows) {
  for (const item of rows) {
    order_customer_list.push(item)
  }
  return { data: 'success' }
}

