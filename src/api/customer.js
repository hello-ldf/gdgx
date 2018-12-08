import request from '@/utils/request'

export default {
  fetchCustomers: (query) => {
    return request({
      url: '/Customer/FetchCustomers',
      method: 'get',
      params: query
    })
  },

  getCustomerDetail: (params) => {
    return request({
      url: '/Customer/GetCustomerDetail',
      method: 'get',
      params: params
    })
  },

  createCustomer: (params) => {
    return request({
      url: '/Customer/CreateCustomer',
      method: 'post',
      params: params
    })
  },

  updateCustomer: (params) => {
    console.log(params)
    return request({
      url: '/Customer/UpdateCustomer',
      method: 'post',
      data: params
    })
  }
}

// export function updateCustomer(params) {
//   console.log(params)
//   return request({
//     url: '/Customer/UpdateCustomer',
//     method: 'post',
//     params: params
//   })
// }
