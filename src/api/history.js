import request from '@/utils/request'

export function fetchHistory(query) {
  return request({
    url: '/History/FetchList',
    method: 'get',
    params: query
  })
}

