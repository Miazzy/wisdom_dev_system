import { useGlobSetting } from '/@/hooks/setting';
const { chinaMapDataUrl } = useGlobSetting();

// 查询中国行政区域地图数据
export const getChinaJsonData = async () => {
  const callback = new Promise((resolve) => {
    const url = chinaMapDataUrl;
    _fetch(url, function (text:any) {
      const data = JSON.parse(text);
      resolve(data);
    });
  });
  const data = await callback;
  return data;
};

function _fetch(url:any, cb:any) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb && cb(xhr.responseText);
    }
  };
}