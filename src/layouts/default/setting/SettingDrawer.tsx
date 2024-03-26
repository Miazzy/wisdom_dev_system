import { defineComponent, ref } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider, Spin } from 'ant-design-vue';
import { ThemePicker } from './components';
import { AppDarkModeToggle } from '/@/components/Application';

const spinStatus = ref(false);

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    function handleThemeChange(mode, status) {
      spinStatus.value = status;
    }

    return () => (
      <BasicDrawer {...attrs} title="项目配置" width={330} class="setting-drawer">
        {<Divider>主题</Divider>}
        {<AppDarkModeToggle class="mx-auto" onChange={handleThemeChange} />}
        {<ThemePicker />}
        <Divider />
        <div style="width: 100%; height: calc(50vh - 260px); "></div>
        <Spin spinning={spinStatus.value}>
          <div style="width: 100%;"></div>
        </Spin>
      </BasicDrawer>
    );
  },
});
