import request from '@/utils/request'

export function fetchRoomReserve(query) {
  return request({
    url: '/RoomReserve/FetchList',
    method: 'get',
    params: query
  })
}

export function createRoomReserve(data) {
  console.log('create')
  return request({
    url: '/RoomReserve/Create',
    method: 'post',
    data
  })
}

export function updateRoomReserve(data) {
  console.log('upadte')
  return request({
    url: '/RoomReserve/Update',
    method: 'post',
    data
  })
}
