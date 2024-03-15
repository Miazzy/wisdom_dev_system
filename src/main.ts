import 'uno.css';
import '@/design/index.less';
import '@/components/VxeTable/src/css/index.scss';
import 'ant-design-vue/dist/antd.less';
import 'virtual:svg-icons-register';
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import Antd from 'ant-design-vue';
import { registerGlobComp } from '@/components/registerGlobComp';
import { setupGlobDirectives } from '@/directives';
import { setupI18n } from '@/locales/setupI18n';
import { setupErrorHandle } from '@/logics/error-handle';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';
import App from './App.vue';

async function bootstrap() {
  let startTime = Date.now();
  console.info('main 开始时间: ', startTime);

  const app = createApp(App);

  let endTime = Date.now();
  console.info('main-createApp 耗时：', endTime - startTime);
  startTime = Date.now();

  // 先全局注册组件，后期优化
  app.use(ElementPlus);
  app.use(Antd);

  endTime = Date.now();
  console.info('main-app.use 耗时：', endTime - startTime);
  startTime = Date.now();

  // Configure store
  // 配置 store
  setupStore(app);

  endTime = Date.now();
  console.info('main-setupStore 耗时：', endTime - startTime);
  startTime = Date.now();

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  endTime = Date.now();
  console.info('main-initAppConfigStore 耗时：', endTime - startTime);
  startTime = Date.now();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  endTime = Date.now();
  console.info('main-registerGlobComp 耗时：', endTime - startTime);
  startTime = Date.now();

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app);

  endTime = Date.now();
  console.info('main-setupI18n 耗时：', endTime - startTime);
  startTime = Date.now();

  // Configure routing
  // 配置路由
  setupRouter(app);

  endTime = Date.now();
  console.info('main-setupRouter 耗时：', endTime - startTime);
  startTime = Date.now();

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  endTime = Date.now();
  console.info('main-setupRouterGuard 耗时：', endTime - startTime);
  startTime = Date.now();

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  endTime = Date.now();
  console.info('main-setupGlobDirectives 耗时：', endTime - startTime);
  startTime = Date.now();

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  endTime = Date.now();
  console.info('main-setupErrorHandle 耗时：', endTime - startTime);
  startTime = Date.now();

  // Vue应用挂载
  app.mount('#app');

  endTime = Date.now();
  console.info('main-app.mount 耗时：', endTime - startTime);
}

bootstrap();
