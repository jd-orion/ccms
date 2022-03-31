import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "开关值映射",
    "type": "group",
    "fields": [
      {
        "field": "valueTrue",
        "label": "开状态",
        "type": "any",
        "defaultValue": {
          "source": "static",
          "value": true
        }
      },
      {
        "field": "valueFalse",
        "label": "关状态",
        "type": "any",
        "defaultValue": {
          "source": "static",
          "value": false
        }
      }
    ]
  }
]

export default config