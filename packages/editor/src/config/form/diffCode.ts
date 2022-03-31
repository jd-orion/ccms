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
    "label": "原始值字段",
    "field": "originalCodeField",
    "type": "text"
  },
  {
    "label": "修改值字段",
    "field": "modifiedCodeField",
    "type": "text"
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
  }
]

export default config