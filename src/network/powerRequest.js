import { request } from 'network/request';
const instance = request();

// 获取权限列表
export function rightsListRequest(params) {
  return instance.get("rights/" + params);
}

// 获取角色列表
export function rolesListRequest() {
  return instance.get("roles");
}

// 删除角色权限
export function roleRightsDelete({ role, rightsId }) {
  return instance.delete(`roles/${role.id}/rights/${rightsId}`);
}

// 角色授权
export function roleRidUpdateRequest({ roleId, rids }) {
  return instance.post(`roles/${roleId}/rights`, {
    rids
  })
}

// 删除角色
export function roleDelRequest(id) {
  return instance.delete('roles/' + id)
}

// 增加角色
export function roleAddRequest(params) {
  return instance.post('roles', params)
}

// 根据id获取角色
export function getRoleByIdRequest(id) {
  return instance.get('roles/' + id);
}

// 修改角色信息
export function updRoleRequest(role) {
  return instance.put('roles/' + role.roleId, role);
}