import { MsgManager } from '/@/message/MsgManager';
import { useUserStoreWithOut } from '/@/store/modules/user';

const userStore = useUserStoreWithOut();
export const dialogMaskOpen = () => {
  let count = userStore.getHasMask;
  userStore.setHasMask(++count);
  if (count <= 1) {
    MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
  }
};

export const dialogMaskClose = () => {
  let count = userStore.getHasMask;
  userStore.setHasMask(--count);
  if (count <= 0) {
    MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
  }
};
