import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "表单提示文案",
    "type": "group",
    "fields": [
      {
        "field": "desc",
        "label": "文案描述",
        "type": "text"
      },
      {
        "field": "link",
        "label": "外链URL",
        "type": "text"
      },
      {
        "field": "style.color",
        "label": "文字颜色",
        "type": "color"
      }
    ]
  }
]

export default config