<!--
 * @Description: 
 * @Date: 2023-08-18 16:28:56
 * @LastEditTime: 2023-08-22 13:39:33
 * @FilePath: \frontdemo\src\layouts\default\setting\components\ThemePicker.vue
-->
<template>
  <div class="theme-picker">
    <template v-for="(item, index) in currentThemeList || []" :key="index">
      <Tooltip :title="item.title" placement="bottom">
        <div
          @click="handler(item)"
          class="theme-picker-item"
          :class="{ active: currentTheme === item.themeName }"
          :style="{ backgroundColor: item.color }"
        ></div>
      </Tooltip>
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { themeList } from '../enum';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { sendThemeMessage } from '/@/utils/theme';

  export default defineComponent({
    name: 'ThemePicker',
    components: { Tooltip },
    setup() {
      const { getDarkMode } = useRootSetting();
      let currentThemeList = ref([]);
      currentThemeList.value = themeList.filter((item) => {
        return item.mode === getDarkMode.value;
      });
      let currentThemeVal = localStorage.getItem('THEME') || currentThemeList.value[0].themeName;
      let currentTheme = ref(currentThemeVal);
      localStorage.setItem('THEME', unref(currentTheme));
      sendThemeMessage('class', `${unref(currentTheme)} my-layout`);

      const handler = (item: (typeof themeList)[0]) => {
        if (item.themeName === currentTheme.value) return;
        currentTheme.value = item.themeName;
        localStorage.setItem('THEME', unref(currentTheme));
        sendThemeMessage('class', `${item.themeName} my-layout`);
      };

      watch(
        () => getDarkMode.value,
        (v: string) => {
          currentThemeList.value = themeList.filter((item) => {
            return item.mode === getDarkMode.value;
          });
          currentTheme.value = currentThemeList.value[0].themeName;
          sendThemeMessage('class', `${currentThemeList.value[0].themeName} my-layout`);
          localStorage.setItem('THEME', unref(currentTheme));
        },
      );

      return {
        currentTheme,
        handler,
        currentThemeList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .theme-picker {
    display: flex;

    .theme-picker-item {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      border-radius: 2px;

      &.active {
        border: 2px solid #0960bd;
      }
    }
  }
</style>
