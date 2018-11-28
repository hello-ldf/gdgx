// /* global i18n */
import Mock from 'mockjs'
import { param2Obj, compare, parseTime } from '@/utils'

import { addHistory } from '@/mock/history'

const _bills = []
var _billzList = []

export default {
  fetchList: config => {
    const { firstName, lastName, checkinDate, roomNo, page = 1, limit = 20 } = param2Obj(config.url)

    const mockList = _bills.filter(item => {
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
  }, // fetchList
  getBillDetail: config => {
    const { orderNo } = param2Obj(config.url)

    const rs = { bill: {}, billzList: [] }
    // 取单头
    for (const item of _bills) {
      if (item.orderNo === orderNo) {
        rs.bill = Object.assign({}, item)
        break
      }
    }
    // 取单身
    rs.billzList = _billzList.filter(item => {
      if (item.orderNo !== orderNo) return false
      return true
    })

    return rs
  }, // getBillDetail
  addBillz: config => {
    const { orderNo, billzListJson } = param2Obj(config.url)
    const billzList = JSON.parse(billzListJson)

    let maxSortNo = 1
    for (const _billz of _billzList) {
      if (_billz.sortNo > maxSortNo) { maxSortNo = _billz.sortNo }
    }

    const now = new Date()

    for (const billz of billzList) {
      maxSortNo++
      billz.sortNo = maxSortNo
      billz.createDate = now

      let change = ''
      for (const key in billz) {
        change += `${key}=${billz[key]} ; `
      }
      if (change !== '') {
        const history = {}
        history.type = 'Bill'
        history.orderNo = billz.orderNo
        history.operateDate = new Date()
        history.employeeID = 'admin'
        history.employeeName = 'Admin'
        history.operate = '抛入账单。' + change
        addHistory(history)
      }
    }
    _billzList = _billzList.concat(billzList)

    for (const _bill of _bills) {
      if (_bill.orderNo === orderNo) {
        let totol = 0
        for (const _billz of _billzList) {
          if (_billz.orderNo === orderNo) {
            totol += parseInt(_billz.type === 2 ? -_billz.amount : _billz.amount)
          }
        }
        console.log(totol)
        _bill.amount = totol
        break
      }
    }
  }, // addBillz
  sortBillz: config => {
    const { billzListJson } = param2Obj(config.url)
    const billzList = JSON.parse(billzListJson)

    for (const billz of billzList) {
      for (const _billz of _billzList) {
        if (billz.id === _billz.id) {
          _billz.sortNo = billz.sortNo
          _billz.section = billz.section
          break
        }
      }
    }
  } // sortBillz
}

// 初始化账单列表
export function initBills(rows) {
  for (const item of rows) {
    const data = {}
    data.id = Mock.Random.id()
    data.orderNo = item.orderNo
    data.roomNo = item.roomNo
    data.firstName = item.firstName
    data.lastName = item.lastName
    data.checkinDate = item.checkinDate
    data.checkoutDate = item.checkoutDate
    data.amount = 0
    _bills.push(data)
  }
  return { data: 'success' }
} // initBills

