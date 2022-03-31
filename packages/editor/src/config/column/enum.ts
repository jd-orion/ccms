import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "options",
    "label": "选项",
    "type": "group",
    "fields": [
      {
        "field": "from",
        "label": "来源",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "manual",
              "label": "手动设置"
            }
          ]
        }
      },
      {
        "field": "data",
        "label": "数据",
        "type": "form",
        "primaryField": "label",
        "canInsert": true,
        "canRemove": true,
        "canSort": true,
        "canCollapse": true,
        "fields": [
          {
            "field": "key",
            "label": "值",
            "type": "any"
          },
          {
            "field": "label",
            "label": "描述",
            "type": "text"
          }
        ]
      }
    ]
  }
]

export default config