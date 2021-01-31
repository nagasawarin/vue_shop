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

// 修改用户状态
export function stateUpdateRequest(params) {
  return instance.put(`users/${params.id}/state/${params.mg_state}`);
}

// 删除单个用户
export function userDeleteRequest(userId) {
  return instance.delete(`users/${userId}`);
}