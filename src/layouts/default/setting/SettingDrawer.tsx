import { defineComponent, unref, ref } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider, Spin } from 'ant-design-vue';
import { SettingFooter, ThemePicker } from './components';

import { AppDarkModeToggle } from '/@/components/Application';
import { TriggerEnum } from '/@/enums/menuEnum';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMenuTriggerOptions } from './enum';

const { t } = useI18n();
const spinStatus = ref(false);

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const { getShowDarkModeToggle } = useRootSetting();
    const { getTrigger, getSplit } = useMenuSetting();

    function handleThemeChange(mode, status) {
      spinStatus.value = status;
    }

    function renderTheme() {
      return <ThemePicker />;
    }

    /**
     * @description:
     */
    function renderFeatures() {
      let triggerDef = unref(getTrigger);

      const triggerOptions = getMenuTriggerOptions(unref(getSplit));
      const some = triggerOptions.some((item) => item.value === triggerDef);
      if (!some) {
        triggerDef = TriggerEnum.FOOTER;
      }

      return (
        <>
          <div></div>
        </>
      );
    }

    return () => (
      <BasicDrawer
        {...attrs}
        title={t('layout.setting.drawerTitle')}
        width={330}
        class="setting-drawer"
      >
        {unref(getShowDarkModeToggle) && <Divider>{() => t('layout.setting.darkMode')}</Divider>}
        {unref(getShowDarkModeToggle) && (
          <AppDarkModeToggle class="mx-auto" onChange={handleThemeChange} />
        )}
        {renderTheme()}
        {renderFeatures()}
        <Divider />
        <SettingFooter />
        <div style="width: 100%; height: calc(50vh - 260px); "></div>
        <Spin spinning={spinStatus.value}>
          <div style="width: 100%;"></div>
        </Spin>
      </BasicDrawer>
    );
  },
});
