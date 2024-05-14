<template>
  <!-- 工作栏 -->
  <div class="workspace-box">
    <ng-form-build ref="formBuild" :formTemplate="form" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  // import { NgFormBuild } from 'ng-form-elementplus';
  // import 'ng-form-elementplus/lib/style.css';

  const form = ref({});

  onMounted(() => {
    form.value = {
      list: [
        {
          type: 'input',
          options: {
            type: 'text',
            placeholder: '请输入',
            clearable: false,
            hidden: false,
            disabled: false,
          },
          label: '输入框',
          labelWidth: -1,
          width: '100%',
          span: 24,
          value: '23828',
          model: 'input_17143602805972',
          key: 'input_17143602805972',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
        {
          type: 'textarea',
          options: {
            rows: 4,
            placeholder: '请输入',
            autosize: false,
            hidden: false,
            disabled: false,
          },
          label: '文本框',
          labelWidth: -1,
          width: '100%',
          span: 24,
          model: 'textarea_17143602816662',
          key: 'textarea_17143602816662',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
        {
          type: 'number',
          options: {
            precision: 0,
            step: 1,
            min: 0,
            max: 1000,
            placeholder: '请输入',
            clearable: false,
            hidden: false,
            disabled: false,
          },
          label: '数字输入框',
          labelWidth: -1,
          width: '100%',
          span: 24,
          model: 'number_17143602830132',
          key: 'number_17143602830132',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
        {
          type: 'select',
          options: {
            placeholder: '请输入',
            dynamic: 0,
            options: [
              {
                value: '1',
                label: '下拉框1',
              },
              {
                value: '2',
                label: '下拉框2',
              },
              {
                value: '',
                label: '',
              },
            ],
            methodType: 'get',
            multiple: false,
            showSearch: false,
            onlineSearch: false,
            clearable: false,
            hidden: false,
            disabled: false,
            linkage: false,
            linkData: [],
          },
          label: '下拉选择器',
          labelWidth: -1,
          width: '100%',
          span: 24,
          model: 'select_17143602862972',
          key: 'select_17143602862972',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
        {
          type: 'radio',
          options: {
            placeholder: '请输入',
            dynamic: 0,
            options: [
              {
                value: '1',
                label: '选项1',
              },
              {
                value: '2',
                label: '选项2',
              },
            ],
            methodType: 'get',
            hidden: false,
            disabled: false,
            linkage: false,
            linkData: [],
          },
          label: '单选框',
          labelWidth: -1,
          width: '100%',
          span: 24,
          model: 'radio_17143603257442',
          key: 'radio_17143603257442',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
        {
          type: 'checkbox',
          options: {
            defaultValue: [],
            placeholder: '请输入',
            dynamic: 0,
            options: [
              {
                value: '1',
                label: '选项1',
              },
              {
                value: '2',
                label: '选项2',
              },
            ],
            methodType: 'get',
            hidden: false,
            disabled: false,
            linkage: false,
            linkData: [],
          },
          label: '多选框',
          labelWidth: -1,
          width: '100%',
          span: 24,
          model: 'checkbox_17143603234202',
          key: 'checkbox_17143603234202',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
        {
          type: 'date',
          options: {
            dateType: 'date',
            format: 'YYYY-MM-DD',
            placeholder: '请输入',
            clearable: false,
            editable: true,
            hidden: false,
            disabled: false,
          },
          label: '日期',
          labelWidth: -1,
          width: '100%',
          span: 24,
          model: 'date_17143603291312',
          key: 'date_17143603291312',
          rules: [
            {
              required: false,
              message: '必填项',
              trigger: ['blur'],
            },
          ],
        },
      ],
      config: {
        labelPosition: 'left',
        labelWidth: 100,
        size: 'default',
        outputHidden: false,
        hideRequiredMark: false,
        syncLabelRequired: true,
        labelSuffix: '',
        customStyle: '',
      },
    };
  });
</script>
<style scoped>
  .workspace-box {
    width: calc(100% - 20px);
    height: auto;
    margin: 10px;
    background: #fefefe;
  }
</style>
