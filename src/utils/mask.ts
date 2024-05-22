import { MsgManager } from '/@/message/MsgManager';
import { useUserStoreWithOut } from '/@/store/modules/user';

export const dialogMaskInit = () => {
  try {
    const userStore = useUserStoreWithOut();
    userStore.setHasMask(0);
  } catch (error) {
    //
  }
};

export const dialogMaskOpen = () => {
  try {
    const userStore = useUserStoreWithOut();
    let count = userStore.getHasMask;
    userStore.setHasMask(++count);
    if (count <= 1) {
      MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
    }
  } catch (error) {
    //
  }
};

export const dialogMaskClose = (force = false) => {
  try {
    const userStore = useUserStoreWithOut();
    let count = userStore.getHasMask;
    userStore.setHasMask(--count);
    if (count <= 0 || force) {
      MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
    }
  } catch (error) {
    //
  }
};
