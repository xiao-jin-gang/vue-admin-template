import request from '@/utils/request'
import { baseUrl } from '@/api/url'

export function login(data) {
  return request({
    url: `${baseUrl}/eduservice/user/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${baseUrl}/eduservice/user/info`,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: `${baseUrl}/vue-admin-template/user/logout`,
    method: 'post'
  })
}
