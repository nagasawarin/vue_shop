import { request } from 'network/request';
const instance = request();

export function getReports(){
  instance.get('reports/type/1').then(data => {
  });
  return instance.get('reports/type/1');
}