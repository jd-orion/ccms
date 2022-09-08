import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "展示配置",
    "type": "group",
    "fields": [
      {
        "field": "placeholder",
        "label": "占位符",
        "type": "text"
      }
    ]
  },
  {
    "field": "",
    "label": "校验条件",
    "type": "group",
    "fields": [
      {
        "field": "maxLength",
        "label": "最大字符长度",
        "type": "number"
      },
      {
        "field": "minLength",
        "label": "最小字符长度",
        "type": "number"
      },
      {
        "field": "cjkLength",
        "label": "中文占字符数",
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