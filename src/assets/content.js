import { Message } from 'element-ui';

export default async function userRequest({ request, params, status = 200, success, error, successMsg = true, errorMsg = true }) {
  const { data: result } = await request(params);
  if (result.meta.status === status) {
    if (success) {
      success(result.data);
    }
    if (!successMsg) {
      return;
    }
    Message({ message: result.meta.msg, type: "success" });
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