// /* global i18n */
import Mock from 'mockjs'
import { param2Obj, compare, parseTime } from '@/utils'
import { initOCList } from '@/mock/order-customer'

import { addHistory } from '@/mock/history'

const _customers = []

export default {
  fetchList: config => {
    const { firstName, lastName, checkinDate, roomNo, page = 1, limit = 20 } = param2Obj(config.url)

    const mockList = _customers.filter(item => {
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
  },

  getCustomerDetail: config => {
    const { customerID } = param2Obj(config.url)

    for (const item of _customers) {
      if (item.id === customerID) {
        return Object.assign({}, item)
      }
    }
  },

  createCustomer: (config) => {
    const data = JSON.parse(config.body)
    data.id = Mock.Random.id()
    _customers.unshift(data)

    const history = {}
    history.type = 'Customer'
    history.associateID = data.id
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
  updateCustomer: config => {
    console.log(config)
    const data = JSON.parse(config.body)
    for (const item of _customers) {
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
          history.type = 'Customer'
          history.associateID = item.id
          history.operateDate = new Date()
          history.employeeID = 'admin'
          history.employeeName = 'Admin'
          history.operate = '修改记录。 ' + change
          addHistory(history)
        }

        break
      }
    }
    return { data: 'success' }
  }
}

// 初始化客人列表
export function initCustomers(rows) {
  const ocList = []

  for (const item of rows) {
    const customer = Mock.mock({
      id: '@id',
      userNo: item.userNo,
      lastName: item.lastName,
      firstName: item.firstName,
      sex: item.sex,
      idNumber: '@id',
      dateOfBirth: +Mock.Random.date('T'),
      contactNumber: item.contactNumber,
      email: item.email,
      companyName: item.companyName,
      companyType: item.companyType,
      organizationCode: item.organizationCode,
      registeredCode: item.registeredCode,
      like: '@title',
      remark: item.remark,

      roomNo: item.roomNo,
      checkinDate: item.checkinDate,
      checkoutDate: item.checkoutDate
    })
    _customers.push(customer)

    ocList.push(Mock.mock({
      id: '@id',
      orderNo: item.orderNo,
      customerID: customer.id,
      main: 1
    }))
  }

  initOCList(ocList)
  return { data: 'success' }
}

