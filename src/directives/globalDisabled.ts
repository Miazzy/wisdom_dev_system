import type { Directive, App } from 'vue';
import { MsgManager } from '/@/message/MsgManager';

export const setGlobalDisabled: Directive = {
  mounted(el, binding) {
    el.setAttribute('global-disabled', binding.value);
    if (binding.value) {
      el.querySelectorAll('input, textarea, select').forEach((input) => {
        input.disabled = true;
        input?.parentNode?.setAttribute('disabled', true);
      });
    } else {
      // el.querySelectorAll('input, textarea, select').forEach((input) => {
      //   input.disabled = false;
      //   input?.parentNode?.setAttribute('disabled', false);
      // });
    }
    MsgManager.getInstance().sendMsg('global-disabled', binding.value);
  },
  updated(el, binding) {
    el.setAttribute('global-disabled', binding.value);
    if (binding.value) {
      el.querySelectorAll('input, textarea, select').forEach((input) => {
        input.disabled = true;
        input?.parentNode?.setAttribute('disabled', true);
      });
    } else {
      // el.querySelectorAll('input, textarea, select').forEach((input) => {
      //   input.disabled = false;
      //   input?.parentNode?.setAttribute('disabled', false);
      // });
    }
    MsgManager.getInstance().sendMsg('global-disabled', binding.value);
  },
};

export const setupGlobalDisabledDirective = (app: App) => {
  app.directive('global-disabled', setGlobalDisabled);
  app.directive('page-readonly', setGlobalDisabled);
};
