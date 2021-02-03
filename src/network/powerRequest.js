import { request } from 'network/request';
const instance = request();

export function rightsListRequest() {
  return instance.get("rights/list");
}

export function rolesListRequest() {
  return instance.get("roles");
}