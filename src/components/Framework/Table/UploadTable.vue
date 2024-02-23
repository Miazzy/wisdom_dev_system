<template>
  
</template>

<script lang="ts" setup>
  import { defineProps, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    url: { type: Object, default: {} },
    multiple: { type: Array, default: [] },
    file: { type: Array, default: [] },
    operable: { type: Boolean, default: false },
  });


  onMounted(() => {
   
  });
</script>

<style>
  
</style>
