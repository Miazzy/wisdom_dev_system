<script lang="ts" setup>
  import Iconify from '@purge-icons/generated';
  import { useDesigns } from '@/hooks/web/useDesign';
  import { computed, nextTick, ref, unref, watch } from 'vue';

  type ElRef<T extends HTMLElement = HTMLDivElement> = T | null;

  defineOptions({ name: 'Icon' });

  const { getPrefixCls } = useDesigns();

  const prefixCls = getPrefixCls('icon');

  const props = defineProps({
    icon: { type: String, default: '' },
    color: { type: String, default: '' },
    size: { type: Number, default: '' },
    svgClass: { type: String, default: '' },
  });

  const elRef = ref<ElRef>(null);

  const isLocal = computed(() => props.icon.startsWith('svg-icon:'));

  const symbolId = computed(() => {
    return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon;
  });

  const getIconifyStyle = computed(() => {
    const { color, size } = props;
    return {
      fontSize: `${size}px`,
      color,
    };
  });

  const getSvgClass = computed(() => {
    const { svgClass } = props;
    return `iconify ${svgClass}`;
  });

  const updateIcon = async (icon: string) => {
    if (unref(isLocal)) return;

    const el = unref(elRef);
    if (!el) return;

    await nextTick();

    if (!icon) return;

    const svg = Iconify.renderSVG(icon, {});
    if (svg) {
      el.textContent = '';
      el.appendChild(svg);
    } else {
      const span = document.createElement('span');
      span.className = 'iconify';
      span.dataset.icon = icon;
      el.textContent = '';
      el.appendChild(span);
    }
  };

  watch(
    () => props.icon,
    (icon: string) => {
      updateIcon(icon);
    },
  );
</script>

<template>
  <ElIcon :class="prefixCls" :color="color" :size="size">
    <svg v-if="isLocal" :class="getSvgClass" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <span v-else ref="elRef" :class="$attrs.class" :style="getIconifyStyle">
      <span :class="getSvgClass" :data-icon="symbolId"></span>
    </span>
  </ElIcon>
</template>
