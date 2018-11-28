import request from '@/utils/request'

export function fetchCustomers(query) {
  return request({
    url: '/Customer/FetchCustomers',
    method: 'get',
    params: query
  })
}

export function getCustomerDetail(params) {
  return request({
    url: '/Customer/GetCustomerDetail',
    method: 'get',
    params: params
  })
}
