import { defineComponent, unref } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider } from 'ant-design-vue';
import { SettingFooter, ThemePicker } from './components';

import { AppDarkModeToggle } from '/@/components/Application';
import { TriggerEnum } from '/@/enums/menuEnum';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMenuTriggerOptions } from './enum';

const { t } = useI18n();

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const { getShowDarkModeToggle } = useRootSetting();
    const { getTrigger, getSplit } = useMenuSetting();

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

    function renderContent() {
      return (
        <>
          <div></div>
        </>
      );
    }

    function renderTransition() {
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
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}
        {renderTheme()}
        {renderFeatures()}
        {renderContent()}
        {renderTransition()}
        <Divider />
        <SettingFooter />
      </BasicDrawer>
    );
  },
});
