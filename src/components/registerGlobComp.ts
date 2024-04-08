import type { App } from 'vue';
import { AButton, VButton } from './Button';
// import { Input, Layout } from 'ant-design-vue';
// import VXETable from 'vxe-table';

export function registerGlobComp(app: App) {
  app.use(AButton).use(VButton);
  //.use(Input).use(Layout);
  //.use(VXETable);
}
