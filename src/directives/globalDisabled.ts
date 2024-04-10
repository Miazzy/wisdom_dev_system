import type { Directive, App } from 'vue';

export const setGlobalDisabled: Directive = {
  mounted(el, binding) {
    el.setAttribute('global-disabled', binding.value);
    if (binding.value) {
      el.querySelectorAll('input, textarea, select, button').forEach((input) => {
        input.disabled = true;
      });
    } else {
      el.querySelectorAll('input, textarea, select, button').forEach((input) => {
        input.disabled = false;
      });
    }
  },
  updated(el, binding) {
    el.setAttribute('global-disabled', binding.value);
    if (binding.value) {
      el.querySelectorAll('input, textarea, select, button').forEach((input) => {
        input.disabled = true;
      });
    } else {
      el.querySelectorAll('input, textarea, select, button').forEach((input) => {
        input.disabled = false;
      });
    }
  },
};

export const setupGlobalDisabledDirective = (app: App) => {
  app.directive('global-disabled', setGlobalDisabled);
};
