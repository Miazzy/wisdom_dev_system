// 获取两个数组不同的元素
export function findDiffItems(preList, curList, field = 'id') {
  const preSet = new Set(preList.map((item) => item[field]));
  const list = curList.filter((item) => !preSet.has(item[field]));
  return list;
}
