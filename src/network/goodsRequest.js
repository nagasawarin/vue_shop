import { request } from 'network/request';
const instance = request();

// 查询商品分类
export function getCateList(querInfo) {
  return instance.get('categories', { params: querInfo });
}

// 添加商品分类
export function addCategories(cateInfo) {
  return instance.post('categories', cateInfo);
}

// 删除商品分类
export function delCategories(id) {
  return instance.delete('categories/' + id);
}

// 修改商品信息
export function updCategories({ id, cat_name }) {
  return instance.put('categories/' + id, { cat_name });
}