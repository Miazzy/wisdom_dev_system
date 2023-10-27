import { useGlobSetting } from '/@/hooks/setting';

const { chinaMapDataUrl } = useGlobSetting();

// 查询中国行政区域地图数据
export const getChinaJsonData = async () => {
  return await fetch(chinaMapDataUrl as string).then((data) => {
    return data.json();
  });
};
