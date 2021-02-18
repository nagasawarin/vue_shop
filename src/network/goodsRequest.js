import { request } from 'network/request';
const instance = request();

/* 商品分类开始 */

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


/* 分类参数开始 */

// 获取分类参数信息
export function getCateAttrList({ id, sel }) {
  return instance.get(`categories/${id}/attributes`, { params: { sel } })
}

// 编辑提交分类参数
export function updCateAttr({ cat_id, attr_id, attr_name, attr_sel, attr_vals }) {
  let attr = {
    attr_name,
    attr_sel
  }
  if (attr_vals instanceof Array) {
    attr.attr_vals = attr_vals.join(',');
  }

  return instance.put(`categories/${cat_id}/attributes/${attr_id}`, attr);
}

// 添加动态参数或静态属性
export function addAttr({ id, attr_name, attr_sel, attr_vals }) {
  let attr = {
    attr_name, attr_sel
  }
  if (attr_vals) {
    attr.attr_vals = attr_vals;
  }
  return instance.post(`categories/${id}/attributes`, attr);
}

// 根据id查询动态或静态参数
export function getAttrById({ id, attrId, attr_sel }) {
  return instance.get(`categories/${id}/attributes/${attrId}`, { attr_sel });
}

// 删除参数
export function delAttr({ id, attrid }) {
  return instance.delete(`categories/${id}/attributes/${attrid}`);
}


/* 商品列表开始 */

// 获取商品列表
export function getGoods(queryInfo) {
  return instance.get('goods', { params: queryInfo });
}

// 添加商品
export function addGoods(goodsInfo) {
  if (goodsInfo.goods_cat instanceof Array) {
    goodsInfo.goods_cat = goodsInfo.goods_cat.join(',');
  }
  return instance.post('goods', goodsInfo);
}

// 根据 ID 查询商品
export function getGoodsById(id) {
  return instance.get('goods/' + id);
}

// 编辑提交商品
export function editGoods(goodsInfo) {
  if (goodsInfo.goods_cat instanceof Array) {
    goodsInfo.goods_cat = goodsInfo.goods_cat.join(',');
  }
  return instance.put('goods/' + goodsInfo.goods_id, goodsInfo);
}

// 删除商品
export function delGoods(id) {
  return instance.delete('goods/' + id);
}