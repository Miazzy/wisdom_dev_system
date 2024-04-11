/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '/@/store/modules/user';

const userStore = useUserStore();
const userInfo = userStore.getUserInfo as { permissions?: [] };
const permissionMap = new Map<string, any>();

function isAuth(el: Element, binding: any) {
  if (permissionMap.size == 0) {
    userInfo?.permissions?.map((key) => permissionMap.set(key, true));
  };
  const value = binding.value;
  if (!value) return;
  if (!permissionMap.has(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const updated = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
  updated,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
  app.directive('permission', authDirective);
}

export default authDirective;
