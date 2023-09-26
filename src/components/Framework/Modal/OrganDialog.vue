<template>
  <Dialog
    :title="title"
    :visible="modalVisible"
    @update:visible="updateVisible"
    :width="props.width"
    :height="props.height"
    @cancel="cancel"
    @confirm="confirm"
  >
    <div class="dialog-content" :style="`height: calc(${props.height}px - 90px)`">
      <!-- 左侧分类树 -->
      <div class="category-tree">
        <span>组织结构</span>
      </div>

      <!-- 右侧表格 -->
      <div class="employee-table">
        <span>被选人员</span>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import { ref, defineProps, defineEmits, computed, onMounted, watch } from 'vue';

  const modalVisible = ref(false);

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    width: { type: Number, default: 700 }, // 弹框宽度
    height: { type: Number, default: 500 }, // 弹框高度
  });
  const emit = defineEmits(['update:visible', 'cancel', 'confirm']); // 定义事件

  const cancel = () => {
    modalVisible.value = false;
    emit('cancel'); // 发送取消事件
    emit('update:visible', false); // 关闭弹框
  };

  const confirm = () => {
    modalVisible.value = false;
    emit('confirm'); // 发送确定事件
    emit('update:visible', false); // 关闭弹框
  };

  const updateVisible = ($event) => {
    modalVisible.value = $event;
    emit('update:visible', false); // 关闭弹框
  };

  watch(
    () => props.visible,
    (newValue) => {
      modalVisible.value = newValue;
    },
  );

  onMounted(() => {
    modalVisible.value = props.visible;
  });
</script>

<style lang="less" scoped>
  .dialog-content {
    display: flex; /* 使用 flex 布局 */
    justify-content: flex-start; /* 左对齐 */
    align-items: stretch; /* 垂直方向拉伸填充 */
  }

  .category-tree {
    flex: 5;
    padding: 10px;
    border-right: 1px solid #ebebeb; /* 右侧加上分割线 */
    text-align: left;

    span {
      text-align: left;
    }
  }

  .employee-table {
    flex: 5;
    padding: 10px;
    text-align: left;

    span {
      text-align: left;
    }
  }
</style>