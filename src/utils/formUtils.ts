// 设置Reactive属性
export const setReactiveValues = (fstate, data: Object) => {
  const formStateProperties = Object.keys(fstate);
  for (const property of formStateProperties) {
    if (Reflect.has(data, property)) {
      fstate[property] = data[property];
    }
  }
};

export const scrollToInValidField = (formInstance, fields, index = 0) => {
  if (fields && fields.errorFields) {
    try {
      let field = null;
      if (fields.errorFields.length > index) {
        field = fields.errorFields[index];
      } else if (fields.errorFields.length > 2) {
        field = fields.errorFields[2];
      } else if (fields.errorFields.length > 1) {
        field = fields.errorFields[1];
      } else if (fields.errorFields.length > 0) {
        field = fields.errorFields[0];
      }
      if (Reflect.has(field, 'name')) {
        const name = field['name'];
        formInstance?.scrollToField(name[0]);
      }
    } catch (error) {
      //
    }
  }
}
