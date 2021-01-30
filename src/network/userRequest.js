import { request } from 'network/request';
const instance = request();

// 登陆页面请求用户信息
export function userInfoRequest(params) {
  return instance.post("login", params);
}

// 获取用户列表
export function userListRequest(params) {
  return instance.get("users", {
    params
  });
}

// 增加用户
export function addUserRequest(params) {
  return instance.post("users", params);
}