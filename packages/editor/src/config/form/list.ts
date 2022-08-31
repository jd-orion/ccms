import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "primaryField",
    "label": "子表单主字段",
    "type": "text"
  },
  {
    "field": "fields",
    "label": "子表单项",
    "type": "form",
    "primaryField": "field",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "label",
        "label": "字段描述",
        "type": "text"
      },
      {
        "field": "field",
        "label": "字段名",
        "type": "text"
      },
      {
        "field": "",
        "label": "",
        "type": "import_subform",
        "interface": {
          "url": "${configDomain}/form/index.json",
          "urlParams": [
            {
              "field": "version",
              "data": {
                "source": "source",
                "field": "version"
              }
            },
            {
              "field": "configDomain",
              "data": {
                "source": "source",
                "field": "configDomain"
              }
            }
          ],
          "method": 'GET',
          "cache": {
            "global": "CCMS_CONFIG_form"
          }
        }
      }
    ]
  },
  {
    "field": "canInsert",
    "label": "可添加",
    "type": "switch"
  },
  {
    "field": "canRemove",
    "label": "可删除",
    "type": "switch"
  },
  {
    "field": "canSort",
    "label": "可排序",
    "type": "switch"
  },
  {
    "field": "canCollapse",
    "label": "可折叠",
    "type": "switch"
  },
  {
    "field": "stringify",
    "label": "序列化数据",
    "type": "form",
    "primaryField": "",
    "fields": [
      {
        "field": "",
        "label": "字段",
        "type": "text"
      }
    ],
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "initialValues": ""
  },
  {
    "field": "unstringify",
    "label": "反序列化数据",
    "type": "form",
    "primaryField": "",
    "fields": [
      {
        "field": "",
        "label": "字段",
        "type": "text"
      }
    ],
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "initialValues": ""
  }
]

export default config