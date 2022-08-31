import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "type",
    "label": "分栏选择",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "span",
          "label": "固定分栏"
        },
        {
          "value": "width",
          "label": "宽度分栏"
        }
      ]
    }
  },
  {
    "field": "value",
    "label": "分栏设置",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "1",
          "label": "1栏"
        },
        {
          "value": "2",
          "label": "2栏"
        },
        {
          "value": "3",
          "label": "3栏"
        },
        {
          "value": "4",
          "label": "4栏"
        },
        {
          "value": "6",
          "label": "6栏"
        }
      ]
    },
    "condition": {
      "template": "${type} === 'span'",
      "params": [
        {
          "field": "type",
          "data": {
            "source": "record",
            "field": "type"
          }
        }
      ]
    }
  },
  {
    "field": "value",
    "label": "宽度(px/%)",
    "type": "text",
    "regExp": {
      "expression": "^[0-9](px|%)$",
      "message": "宽度需设置px或%"
    },
    "condition": {
      "template": "${type} === 'width'",
      "params": [
        {
          "field": "type",
          "data": {
            "source": "record",
            "field": "type"
          }
        }
      ]
    }
  },
  {
    "field": "wrap",
    "label": "是否换行",
    "type": "switch"
  }
]

export default config