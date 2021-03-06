import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "label": "代码类型",
    "field": "codeType",
    "type": "select_single",
    "mode": "button",
    "defaultValue": {
      "source": "static",
      "value": "xml"
    },
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "xml",
          "label": "xml"
        },
        {
          "value": "json",
          "label": "json"
        },
        {
          "value": "javascript",
          "label": "javascript"
        },
        {
          "value": "java",
          "label": "java"
        }
      ]
    }
  },
  {
    "label": "编辑器风格",
    "field": "theme",
    "type": "select_single",
    "mode": "button",
    "defaultValue": {
      "source": "static",
      "value": "black"
    },
    "options": {
      "from": "manual",
      "data": [
        {
          "label": "black",
          "value": "black"
        },
        {
          "label": "white",
          "value": "white"
        }
      ]
    }
  },
  {
    "label": "支持全屏",
    "field": "fullScreen",
    "type": "switch"
  },
  {
    "label": "编辑器高度",
    "field": "height",
    "type": "number",
    "defaultValue": {
      "source": "static",
      "value": "120"
    },
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