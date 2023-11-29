import type { Component } from 'vue';
import type { ComponentType } from './types/componentType';

import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Slider,
  Rate,
} from 'ant-design-vue';

import { ApiSelect, ApiTreeSelect, RadioButtonGroup, ApiRadioGroup } from '/@/components/Form';
import SearchBox from '@/components/Framework/Combox/SearchBox.vue';
import UploadBox from '@/components/Framework/Combox/UploadBox.vue';
import SelectBox from '@/components/Framework/Combox/SelectBox.vue';
import CascaderBox from '@/components/Framework/Combox/CascaderBox.vue';
import TreeBox from '@/components/Framework/Combox/TreeBox.vue';
import TreeSelectBox from '@/components/Framework/Combox/TreeSelectBox.vue';
import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
import DictRadioGroup from '@/components/Framework/Radio/DictRadioGroup.vue';
import CategoryDialog from '/@/components/Framework/Modal/CategoryDialog.vue';
import OrganDialog from '@/components/Framework/Modal/OrganDialog.vue';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputGroup', Input.Group);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', InputNumber);
componentMap.set('AutoComplete', AutoComplete);

componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('TreeSelect', TreeSelect);
componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('Switch', Switch);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('Cascader', Cascader);
componentMap.set('Slider', Slider);
componentMap.set('Rate', Rate);

componentMap.set('DatePicker', DatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('YearPicker', DatePicker.YearPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('TimeRangePicker', TimePicker.TimeRangePicker);

componentMap.set('SearchBox', SearchBox);
componentMap.set('UploadBox', UploadBox);
componentMap.set('TreeBox', TreeBox);
componentMap.set('SelectBox', SelectBox);
componentMap.set('CascaderBox', CascaderBox);
componentMap.set('TreeSelectBox', TreeSelectBox);
componentMap.set('DictSelectBox', DictSelectBox);
componentMap.set('DictRadioGroup', DictRadioGroup);
componentMap.set('CategoryDialog', CategoryDialog);
componentMap.set('OrganDialog', OrganDialog);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
