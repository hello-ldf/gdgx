import request from '@/utils/request'

export function fetchBills(query) {
  return request({
    url: '/Bill/FetchList',
    method: 'get',
    params: query
  })
}

export function getBillDetail(params) {
  return request({
    url: '/Bill/GetBillDetail',
    method: 'get',
    params: params
  })
}

export function addBillz(params) {
  return request({
    url: '/Bill/AddBillz',
    method: 'post',
    params: params
  })
}

export function sortBillz(params) {
  return request({
    url: '/Bill/SortBillz',
    method: 'post',
    params: params
  })
}
