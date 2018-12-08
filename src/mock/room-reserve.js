import Mock from 'mockjs'
import { parseTime, param2Obj, compare } from '@/utils'

import { addHistory, initRoomReserveHistory } from '@/mock/history'
import { initBills } from '@/mock/bill'
import { initCustomers } from '@/mock/customer'

const List = []
const count = 100

const Random = Mock.Random

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',

    orderNo: '@id',

    userNo: '@id',
    firstName: '@clast',
    lastName: '@cfirst',
    contactNumber: /\d{13}/,
    'sex|1': [0, 1],
    email: '@email',

    checkinDate: +Random.date('T'),
    stayDuration: +Random.integer(1, 100),
    checkoutDate: +Random.date('T'),
    attendance: +Random.integer(1, 30),
    roomNo: /[1-9]0[1-9]/,
    unitPrice: +Random.integer(100, 500),
    totalPrice: +Random.integer(1000, 5000),
    deposit: +Random.integer(100, 500),

    'payway|1': ['', '现金'],
    payman: '@cname',

    companyName: '@title',
    'companyType|1': ['国企', '民营'],
    organizationCode: '@id',
    registeredCode: '@id',
    remark: '@cparagraph(1, 3)',
  }))
}
initRoomReserveHistory(List)
initBills(List)
initCustomers(List)

export default {
  fetchList: config => {
    // const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    const { firstName, lastName, checkinDate, roomNo, page = 1, limit = 20 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (firstName && item.firstName.toUpperCase().indexOf(firstName.toUpperCase()) < 0) return false
      if (lastName && item.lastName.toUpperCase().indexOf(lastName.toUpperCase()) < 0) return false
      if (checkinDate && parseTime(item.checkinDate, '{y}-{m}-{d}') !== parseTime(checkinDate, '{y}-{m}-{d}')) return false
      if (roomNo && item.roomNo.toString().indexOf(roomNo.toString()) < 0) return false
      // if (state.length > 0 && state.indexOf(item.state) < 0) return false
      return true
    }).sort(compare('checkinDate'))

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  create: (config) => {
    const data = JSON.parse(config.body)
    data.id = Random.id()
    List.unshift(data)

    const history = {}
    history.type = 'RoomReserve'
    history.associateID = data.orderNo
    history.operateDate = new Date()
    history.employeeID = 'admin'
    history.employeeName = 'Admin'
    history.operate = '新增记录。'
    for (const key in data) {
      history.operate += `${key}: ${data[key]}; `
    }
    addHistory(history)

    return { data: 'success' }
  },
  update: (config) => {
    console.log(config)
    const data = JSON.parse(config.body)
    for (const item of List) {
      if (item.id === data.id) {
        let change = ''
        for (const key in item) {
          if (item[key] !== data[key]) {
            change += `${key}由[${item[key]}]改为[${data[key]}]; `
            item[key] = data[key]
          }
        }
        if (change !== '') {
          const history = {}
          history.type = 'RoomReserve'
          history.associateID = item['orderNo']
          history.operateDate = new Date()
          history.employeeID = 'admin'
          history.employeeName = 'Admin'
          history.operate = '修改记录。 ' + change
          addHistory(history)
        }

        // const index = List.indexOf(item)
        // List.splice(index, 1, data)
        break
      }
    }
    return { data: 'success' }
  }
}
