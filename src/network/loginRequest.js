import { request } from 'network/request';

// 登陆页面请求用户信息
export function userInfoRequest(config, params) {
  const instance = request();
  return instance.post(config, params);
}