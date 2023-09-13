export type ParamsType = {
  pageNo: number;
  pageSize: number;
  key: undefined | string;
  name: undefined | string;
  category: undefined | string;
};

// 获取流程分类数据字典
export const getDictTypeWflow = () => {
  const type = JSON.parse(
    `[{"value":1,"label":"默认","colorType":"primary","cssClass":""},{"value":2,"label":"OA","colorType":"success","cssClass":""}]`,
  );
  return type;
};

// 获取流程表格列表数据
export const getTableDataWflow = () => {
  const data = JSON.parse(
    `{"list":[{"key":"vue3_huoqian","name":"vue3会签","description":null,"category":null,"formType":null,"formId":null,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"de3a16a7-a0a5-11ed-9f70-acde48001122","formName":null,"createTime":1675086977675,"processDefinition":null},{"key":"vue3_normal","name":"vue3普通工作流","description":null,"category":"1","formType":10,"formId":23,"formCustomCreatePath":"","formCustomViewPath":null,"id":"3cd88b2c-a09c-11ed-b5b4-acde48001122","formName":"可以用的表单","createTime":1675082841452,"processDefinition":{"id":"vue3_normal:1:89a58529-a0a4-11ed-9f70-acde48001122","version":1,"deploymentTime":1675086404870,"suspensionState":1}},{"key":"aoteman112","name":"2","description":"3","category":"1","formType":10,"formId":18,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"2a51b46b-9895-11ed-bd9b-b29457079be3","formName":"测试","createTime":1674200194590,"processDefinition":null},{"key":"test_file","name":"测试文件","description":null,"category":"2","formType":10,"formId":19,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"dbd799ed-0d09-11ed-a0fd-427d68986255","formName":"测试文件","createTime":1658857151256,"processDefinition":{"id":"test_file:2:79d9b3fa-970e-11ed-ab4b-ee1dc3210acf","version":2,"deploymentTime":1674032392927,"suspensionState":1}},{"key":"oa_leave","name":"OA 请假","description":null,"category":"2","formType":20,"formId":null,"formCustomCreatePath":"/bpm/oa/leave/create","formCustomViewPath":"/bpm/oa/leave/detail","id":"5eba3e41-0b26-11ed-a881-427d68986255","formName":null,"createTime":1658649494428,"processDefinition":{"id":"oa_leave:4:9a228696-0b26-11ed-a881-427d68986255","version":4,"deploymentTime":1658649593120,"suspensionState":1}},{"key":"test_import","name":"测试导入流程","description":"哈哈哈","category":"1","formType":10,"formId":18,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"96fbc9ad-051c-11ed-a88c-427d68986255","formName":"测试","createTime":1657985586866,"processDefinition":null},{"key":"qingjia","name":"请假测试","description":"哈哈哈哈3","category":"1","formType":20,"formId":23,"formCustomCreatePath":"12","formCustomViewPath":"23","id":"0feec618-0512-11ed-a88c-427d68986255","formName":"可以用的表单","createTime":1657981065316,"processDefinition":{"id":"qingjia:9:cd0ada66-98e0-11ed-94ae-b29457079be3","version":9,"deploymentTime":1674232679742,"suspensionState":1}},{"key":"test","name":"测试流程","description":"biubiu","category":"1","formType":10,"formId":23,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"571f1c6f-04e2-11ed-86b8-427d68986255","formName":"可以用的表单","createTime":1657960568912,"processDefinition":{"id":"test:10:64457386-9b08-11ed-93bb-b29457079be3","version":10,"deploymentTime":1674469584513,"suspensionState":1}},{"key":"huoqian","name":"或签","description":"1231","category":"1","formType":10,"formId":17,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"f72619aa-de72-11ec-b639-baed8c0f87bf","formName":null,"createTime":1653734589575,"processDefinition":{"id":"huoqian:4:b9e9513a-0981-11ed-9f76-427d68986255","version":4,"deploymentTime":1658468826470,"suspensionState":1}},{"key":"huiqian","name":"会签","description":null,"category":"1","formType":10,"formId":17,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"ffdd0c91-de71-11ec-b7c0-baed8c0f87bf","formName":null,"createTime":1653734174698,"processDefinition":{"id":"huiqian:6:c10cc6b2-fe19-11ec-b39c-065114797fbf","version":6,"deploymentTime":1657214710726,"suspensionState":1}}],"total":10}`,
  );
  return data;
};