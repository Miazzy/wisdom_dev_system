import { MsgManager } from '/@/message/MsgManager';
import { useUserStoreWithOut } from '/@/store/modules/user';

export const dialogMaskOpen = () => {
  const userStore = useUserStoreWithOut();
  let count = userStore.getHasMask;
  userStore.setHasMask(++count);
  if (count <= 1) {
    MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
  }
};

export const dialogMaskClose = (force = false) => {
  const userStore = useUserStoreWithOut();
  let count = userStore.getHasMask;
  userStore.setHasMask(--count);
  if (count <= 0 || force) {
    MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
  }
};
