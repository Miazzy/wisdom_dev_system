// 设置Reactive属性
export const setReactiveValues = (fstate, data: Object) => {
  const formStateProperties = Object.keys(fstate);
  for (const property of formStateProperties) {
    if (Reflect.has(data, property)) {
      fstate[property] = data[property];
    }
  }
};

