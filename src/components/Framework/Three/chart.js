/**
 * 绘制3d图
 * @param pieData 总数据
 * @param internalDiameterRatio:透明的空心占比
 * @param distance 视角到主体的距离
 * @param alpha 旋转角度
 * @param pieHeight 立体的高度
 * @param opacity 饼或者环的透明度
 */
const getPie3D = (pieData, internalDiameterRatio, distance, alpha, pieHeight, opacity = 0.5) => {
  const series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  let legendData = [];
  let legendBfb = [];
  const k = 1 - internalDiameterRatio;
  pieData.sort((a, b) => {
    return b.value - a.value;
  });
  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value;
    const seriesItem = {
      name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
      center: ['10%', '50%'],
    };
    if (typeof pieData[i].itemStyle !== 'undefined') {
      const itemStyle = {};
      itemStyle.color =
        typeof pieData[i].itemStyle.color !== 'undefined' ? pieData[i].itemStyle.color : opacity;
      itemStyle.opacity =
        typeof pieData[i].itemStyle.opacity !== 'undefined'
          ? pieData[i].itemStyle.opacity
          : opacity;
      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  legendData = [];
  legendBfb = [];
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value;
    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      series[i].pieData.value,
    );
    startValue = endValue;
    const bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
    legendData.push({
      name: series[i].name,
      value: bfb,
    });
    legendBfb.push({
      name: series[i].name,
      value: bfb,
    });
  }
  const boxHeight = getHeight3D(series, pieHeight); // 通过pieHeight设定3d饼/环的高度，单位是px
  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  const option = {
    legend: {
      show: false,
      data: legendData,
      orient: 'vertical',
      left: 10,
      top: 10,
      itemGap: 10,
      textStyle: {
        color: '#A1E2FF',
      },
      icon: 'circle',
      formatter: function (param) {
        const item = legendBfb.filter((item) => item.name === param)[0];
        const bfs = fomatFloat(item.value * 100, 2) + '%';
        return `${item.name}  ${bfs}`;
      },
    },
    labelLine: {
      show: true,
      lineStyle: {
        color: '#fff',
      },
    },
    label: {
      show: true,
      position: 'outside',
      formatter: '{b} \n{c} {d}%',
    },
    tooltip: {
      backgroundColor: '#033b77',
      borderColor: '#21f2c4',
      textStyle: {
        color: '#fff',
        fontSize: 13,
      },
      formatter: (params) => {
        if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
          const bfb = (
            (option.series[params.seriesIndex].pieData.endRatio -
              option.series[params.seriesIndex].pieData.startRatio) *
            100
          ).toFixed(2);
          return (
            `${params.seriesName}<br/>` +
            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
            `${bfb}%`
          );
        }
      },
    },
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: -1,
      max: 1,
    },
    grid3D: {
      show: false,
      boxHeight: boxHeight, // 圆环的高度
      viewControl: {
        // 3d效果可以放大、旋转等，请自己去查看官方配置
        alpha, // 角度
        distance, // 调整视角到主体的距离，类似调整zoom
        rotateSensitivity: 0, // 设置为0无法旋转
        zoomSensitivity: 0, // 设置为0无法缩放
        panSensitivity: 0, // 设置为0无法平移
        autoRotate: false, // 自动旋转
      },
    },
    series: series,
  };
  return option;
};

/**
 * 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
 */
const getParametricEquation = (startRatio, endRatio, isSelected, isHovered, k, h) => {
  // 计算
  const midRatio = (startRatio + endRatio) / 2;
  const startRadian = startRatio * Math.PI * 2;
  const endRadian = endRatio * Math.PI * 2;
  const midRadian = midRatio * Math.PI * 2;
  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }
  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== 'undefined' ? k : 1 / 3;
  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1;
  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },
    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1;
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
    },
  };
};

/**
 * 获取3d丙图的最高扇区的高度
 */
const getHeight3D = (series, height) => {
  series.sort((a, b) => {
    return b.pieData.value - a.pieData.value;
  });
  return (height * 25) / series[0].pieData.value;
};

/**
 * 格式化浮点数
 */
const fomatFloat = (num, n) => {
  let f = parseFloat(num);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
  let s = f.toString();
  let rs = s.indexOf('.');
  // 判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + n) {
    s += '0';
  }
  return s;
};

const color = [
  '#00BBFF90',
  '#1890FF90',
  '#99DD0090',
  '#6495ED90',
  '#F7C82490',
  '#66DD0090',
  '#8A2BE290',
  '#58D59790',
  '#FFFF0090',
  '#00BBFF90',
  '#77FFEE90',
  '#0066FF90',
  '#7FFF0090',
  '#7FFFD490',
  '#00FFFF90',
  '#7FFFD490',
  '#0000FF90',
  '#6495ED90',
  '#00BFFF90',
  '#66CDAA90',
];

const getDefaultStatus = (optionData) => {
  return {
    name: '状态', // 自己根据场景修改
    backgroundColor: 'transparent',
    type: 'pie',
    label: {
      opacity: 1,
      fontSize: 13,
      lineHeight: 20,
    },
    startAngle: -40, // 起始角度，支持范围[0, 360]。
    clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    radius: ['20%', '50%'],
    center: ['50%', '50%'],
    data: optionData,
    itemStyle: {
      opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
    },
  };
};

export { color, getPie3D, getParametricEquation, getDefaultStatus };
