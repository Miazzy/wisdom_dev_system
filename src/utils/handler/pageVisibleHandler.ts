/**
 * @description 全局监听框架页面是否显示类
 */
export class PageVisibleHandler {
  private static instance: PageVisibleHandler | undefined;
  private static taskList: Array<any> = [];
  private static showCallback: Function | null;
  private static hideCallback: Function | null;

  public static getInstance() {
    if (!PageVisibleHandler.instance) {
      PageVisibleHandler.instance = new PageVisibleHandler();
    }
    return PageVisibleHandler.instance;
  }

  constructor() {
    PageVisibleHandler.taskList = [];
    PageVisibleHandler.showCallback = null;
    PageVisibleHandler.hideCallback = null;
  }

  start() {
    window.addEventListener('visibilitychange', this.handleVisible);
  }

  end() {
    window.removeEventListener('visibilitychange', this.handleVisible);
  }

  handleVisible(event) {
    try {
      if (document.hidden) {
        if (PageVisibleHandler.hideCallback) {
          PageVisibleHandler.hideCallback(event);
        }
      } else {
        if (PageVisibleHandler.showCallback) {
          PageVisibleHandler.showCallback(event);
        }
        if (PageVisibleHandler?.taskList?.length > 0) {
          PageVisibleHandler?.taskList.forEach((element) => {
            const { callback } = element;
            callback();
          });
        }
      }
    } catch (error) {
      //
    }
    console.info('system on page show event...');
  }

  setCallback(scallback: Function = () => {}, hcallback: Function = () => {}) {
    PageVisibleHandler.showCallback = scallback;
    PageVisibleHandler.hideCallback = hcallback;
  }

  pushTask(id: String, callback: Function = () => {}) {
    PageVisibleHandler.taskList.push({ id, callback });
  }

  removeTask(id: String) {
    PageVisibleHandler.taskList = PageVisibleHandler.taskList.filter((task) => task.id !== id);
  }
}
