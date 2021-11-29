import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
