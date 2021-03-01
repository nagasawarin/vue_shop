import { request } from 'network/request';
const instance = request();

export function getOrders(queryInfo){
  return instance.get('orders',{params: queryInfo});
}

export function getExpress(id){
  return instance.get('/kuaid/' + id);
}