/* global i18n */

// import Mock from 'mockjs'
// import i18n from '@/lang' // Internationalization

import { param2Obj, compare } from '@/utils'

const List = []
// const count = 100

// const Random = Mock.Random
export default {
  fetchList: config => {
    const { type, orderNo, page = 1, limit = 20 } = param2Obj(config.url)

    if (!type) console.log('类型type不能为空')

    const mockList = List.filter(item => {
      if (item.type !== type) return false
      if (item.orderNo.toString() !== orderNo.toString()) return false
      return true
    }).sort(compare('operateDate'))

    let pageList = mockList
    if (page > 0) { pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1)) }

    // console.log(pageList)
    return {
      total: mockList.length,
      items: pageList
    }
  }
}

export function addHistory(history) {
  List.push(history)
}

export function initRoomReserveHistory(rows) {
  // const rows = JSON.parse(config.body)
//   console.log(i18n.t('roomReserve.obj.userNo'))
  for (const item of rows) {
    const data = {}
    data.type = 'RoomReserve'
    data.orderNo = item.orderNo
    data.operateDate = new Date()
    data.employeeID = 'admin'
    data.employeeName = 'Admin'
    data.operate = '新增记录。'
    for (const key in item) {
      data.operate += `${i18n.t('roomReserve.obj.' + key)}: ${item[key]}; `
    }
    List.push(data)
  }
  return { data: 'success' }
}

