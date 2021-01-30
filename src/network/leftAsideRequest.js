import { request } from 'network/request';

// 左侧菜单请求
export function asideMenusRequest() {
  const instance = request();
  return instance.get("menus");
}