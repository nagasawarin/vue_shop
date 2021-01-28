import axios from 'axios';

// 设置项目默认请求接口
export function request() {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 5000
  });

  return instance;
}