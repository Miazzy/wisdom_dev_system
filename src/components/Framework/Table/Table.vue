<template>
  <table class="table" :style="tableCssStyle">
    <thead>
      <tr>
        <th
          v-for="column in tcolumns"
          :key="column.key"
          :style="{ width: column.width, textAlign: column.halign }"
        >
          <span>{{ column.title }}</span>
        </th>
        <th v-if="toperable">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in tdata" :key="item.key">
        <td
          v-for="column in tcolumns"
          :key="column.key"
          :style="{ width: column.width, textAlign: column.talign }"
        >
          <span>{{ item[column.dataIndex] }}</span>
        </td>
        <td v-if="toperable">
          <slot name="actions" :item="item"> </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
  import { defineProps, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    tableCssStyle: { type: Object, default: {} },
    data: { type: Array, default: [] },
    columns: { type: Array, default: [] },
    operable: { type: Boolean, default: false },
  });

  const tdata = ref<any[]>([]);
  const tcolumns = ref<any[]>([]);
  const toperable = ref(false);

  watch(
    () => props.data,
    () => {
      tdata.value = props.data as any[];
    },
  );

  watch(
    () => props.columns,
    () => {
      tcolumns.value = props.columns;
    },
  );

  watch(
    () => props.operable,
    () => {
      toperable.value = props.operable;
    },
  );

  onMounted(() => {
    tdata.value = props.data;
    tcolumns.value = props.columns;
    toperable.value = props.operable;
  });
</script>

<style>
  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 4px 2px;
    text-align: left;
  }

  .table th {
    background-color: #f2f2f2;
  }
</style>
