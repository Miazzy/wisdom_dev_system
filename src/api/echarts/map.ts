// 查询中国行政区域地图数据
export const getChinaJsonData = async () => {
  return await fetch('http://localhost:8088/echarts/china_map_data.json').then((data) =>
    data.json(),
  );
};
