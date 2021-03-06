import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "展示配置",
    "type": "group",
    "fields": [
      {
        "field": "precision",
        "label": "小数位数",
        "type": "number"
      },
      {
        "field": "step",
        "label": "步进数",
        "type": "number"
      }
    ]
  },
  {
    "field": "",
    "label": "校验条件",
    "type": "group",
    "fields": [
      {
        "field": "max",
        "label": "最大值",
        "type": "number"
      },
      {
        "field": "min",
        "label": "最小值",
        "type": "number"
      },
      {
        "field": "regExp",
        "label": "正则校验",
        "type": "group",
        "fields": [
          {
            "field": "expression",
            "label": "正确表达式",
            "type": "text"
          },
          {
            "field": "message",
            "label": "错误提示语",
            "type": "text"
          }
        ]
      }
    ]
  }
]

export default config