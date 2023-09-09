/*
 * @Description: 
 * @Date: 2023-08-18 16:28:56
 * @LastEditTime: 2023-08-22 14:58:29
 * @FilePath: \frontdemo\src\utils\lib\echarts.ts
 */
import * as echarts from 'echarts/core';

import {
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  PictorialBarChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
} from 'echarts/components';

import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  SVGRenderer,
  PictorialBarChart,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  ScatterChart,
]);

// 注册自定义echarts主题
fetch('/echartsTheme/light.json')
  .then(r => r.json())
  .then(theme => {
    echarts.registerTheme('light', theme);
  });
fetch('/echartsTheme/dark.json')
  .then(r => r.json())
  .then(theme => {
    echarts.registerTheme('dark', theme);
  });

export default echarts;
