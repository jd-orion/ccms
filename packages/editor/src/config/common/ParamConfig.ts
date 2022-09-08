import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "source",
    "label": "来源",
    "type": "select_single",
    "mode": "dropdown",
    "canClear": true,
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "record",
          "label": "当前记录"
        },
        {
          "value": "data",
          "label": "当前步骤"
        },
        {
          "value": "step",
          "label": "指定步骤"
        },
        {
          "value": "source",
          "label": "页面入参"
        },
        {
          "value": "url",
          "label": "URL入参"
        },
        {
          "value": "static",
          "label": "固定值"
        }
      ]
    }
  },
  {
    "field": "step",
    "label": "步骤",
    "type": "number",
    "condition": {
      "template": "${source} === 'step'",
      "params": [
        {
          "field": "source",
          "data": {
            "source": "record",
            "field": "source"
          }
        }
      ]
    },
    "defaultValue": {
      "source": "static",
      "value": 0
    }
  },
  {
    "field": "field",
    "label": "字段",
    "type": "text",
    "condition": {
      "template": "['record', 'data', 'step', 'source', 'url'].includes(${source})",
      "params": [
        {
          "field": "source",
          "data": {
            "source": "record",
            "field": "source"
          }
        }
      ]
    },
    "defaultValue": {
      "source": "static",
      "value": ""
    }
  },
  {
    "field": "value",
    "label": "值",
    "type": "any",
    "condition": {
      "template": "${source} === 'static'",
      "params": [
        {
          "field": "source",
          "data": {
            "source": "record",
            "field": "source"
          }
        }
      ]
    },
    "defaultValue": {
      "source": "static",
      "value": ""
    }
  }
]

export default config