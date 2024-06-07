<template>
  <div :class="getClass" ref="wrapperRef" v-global-disabled="isGlobalDisabled">
    <PageHeader
      :ghost="ghost"
      :title="title"
      v-bind="omit($attrs, 'class')"
      ref="headerRef"
      v-if="getShowHeader"
    >
      <template #default>
        <template v-if="content">
          {{ content }}
        </template>
        <slot name="headerContent" v-else></slot>
      </template>
      <template #[item]="data" v-for="item in getHeaderSlots">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </PageHeader>

    <div class="overflow-hidden" :class="getContentClass" :style="getContentStyle" ref="contentRef">
      <slot></slot>
    </div>

    <PageFooter v-if="getShowFooter" ref="footerRef">
      <template #left>
        <slot name="leftFooter"></slot>
      </template>
      <template #right>
        <slot name="rightFooter"></slot>
      </template>
    </PageFooter>
  </div>
</template>
<script lang="ts" setup>
  import {
    CSSProperties,
    PropType,
    provide,
    computed,
    watch,
    ref,
    unref,
    useAttrs,
    useSlots,
  } from 'vue';

  import PageFooter from './PageFooter.vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { omit } from 'lodash-es';
  import { PageHeader } from 'ant-design-vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { PageWrapperFixedHeightKey } from '/@/enums/pageEnum';
  import { onMountedOrActivated } from '@vben/hooks';
  import { urlToPath } from '/@/utils/route';

  defineOptions({
    name: 'PageWrapper',
    inheritAttrs: false,
  });

  const props = defineProps({
    title: propTypes.string,
    dense: propTypes.bool,
    ghost: propTypes.bool,
    content: propTypes.string,
    contentStyle: {
      type: Object as PropType<CSSProperties>,
    },
    contentBackground: propTypes.bool,
    contentFullHeight: propTypes.bool.def(false),
    contentClass: propTypes.string,
    detail: { type: Boolean, default: false },
    fixedHeight: propTypes.bool,
    upwardSpace: propTypes.oneOfType([propTypes.number, propTypes.string]).def(0),
  });

  const attrs = useAttrs();
  const slots = useSlots();

  const wrapperRef = ref(null);
  const headerRef = ref(null);
  const contentRef = ref(null);
  const footerRef = ref(null);
  const isGlobalDisabled = ref(false);
  const { prefixCls } = useDesign('page-wrapper');

  provide(
    PageWrapperFixedHeightKey,
    computed(() => props.fixedHeight),
  );

  const getIsContentFullHeight = computed(() => {
    return props.contentFullHeight;
  });

  const getUpwardSpace = computed(() => props.upwardSpace);
  const { redoHeight, setCompensation, contentHeight } = useContentHeight(
    getIsContentFullHeight,
    wrapperRef,
    [headerRef, footerRef],
    [contentRef],
    getUpwardSpace,
  );
  setCompensation({ useLayoutFooter: true, elements: [footerRef] });

  const getClass = computed(() => {
    const dense = { [`${prefixCls}--dense`]: props.dense };
    const mainLayout = { ['main-layout']: window === window.top };
    const attrClass = attrs.class ?? {};
    return [prefixCls, dense, mainLayout, attrClass];
  });

  const getShowHeader = computed(
    () => props.content || slots?.headerContent || props.title || getHeaderSlots.value.length,
  );

  const getShowFooter = computed(() => slots?.leftFooter || slots?.rightFooter);

  const getHeaderSlots = computed(() => {
    return Object.keys(omit(slots, 'default', 'leftFooter', 'rightFooter', 'headerContent'));
  });

  const getContentStyle = computed((): CSSProperties => {
    const { contentFullHeight, contentStyle, fixedHeight } = props;
    if (!contentFullHeight) {
      return { ...contentStyle };
    }

    const height = `${unref(contentHeight)}px`;
    return {
      ...contentStyle,
      minHeight: height,
      ...(fixedHeight ? { height } : {}),
    };
  });

  const getContentClass = computed(() => {
    const { contentBackground, contentClass, detail } = props;
    return [
      `${prefixCls}-content`,
      contentClass,
      detail ? 'detail-content' : '',
      {
        [`${prefixCls}-content-bg`]: contentBackground,
      },
    ];
  });

  watch(
    () => [getShowFooter.value],
    () => {
      redoHeight();
    },
    {
      flush: 'post',
      immediate: true,
    },
  );

  onMountedOrActivated(() => {
    try {
      const { params } = urlToPath() as any;
      const flag = params['global_disabled'] == 'true' || params['page_readonly'] == 'true';
      isGlobalDisabled.value = flag;
      window.document.title = params['__name__'];
    } catch (e) {
      //
    }
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-page-wrapper';

  .theme1 .@{prefix-cls} {
    &.main-layout {
      background: url(../../../assets/images/background1.png) no-repeat center / 100% 100%;
    }
  }

  .theme3 .@{prefix-cls} {
    &.main-layout {
      background-color: #f0f2f5;
    }
  }

  .@{prefix-cls} {
    position: relative;

    .@{prefix-cls}-content {
      margin: 16px;
    }

    .@{prefix-cls}-content.detail-content {
      margin: 10px 0;
    }

    .ant-page-header {
      &:empty {
        padding: 0;
      }
    }

    &-content-bg {
      background-color: @component-background;
    }

    &--dense {
      .@{prefix-cls}-content {
        margin: 0;
      }
    }
  }
</style>
