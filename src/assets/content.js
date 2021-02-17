import { Message } from 'element-ui';
import { rolesListRequest } from "network/powerRequest";
import { getCateList } from "network/goodsRequest";

// 网络请求函数
export async function request({ request, params, status = 200, success, error, successMsg = true, errorMsg = true }) {
  const { data: result } = await request(params);
  if (result.meta.status === status) {
    if (success) {
      success(result.data);
    }
    if (!successMsg) {
      return;
    }
    if (typeof successMsg === 'string') {
      Message({ message: successMsg, type: "success" });
    } else {
      Message({ message: result.meta.msg, type: "success" });
    }
  } else {
    if (error) {
      error(result);
    }
    if (!errorMsg) {
      return;
    }
    Message.error(result.meta.msg);
  }
}

// 获取角色列表函数
export function getRolesList(success) {
  request({
    request: rolesListRequest,
    success: success,
    successMsg: false,
  });
}

// 获取分类数据列表
export function getCate(queryInfo, success) {
  request({
    request: getCateList,
    params: queryInfo,
    success: success,
    successMsg: false,
  });
}