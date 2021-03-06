import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "url",
    "label": "URL",
    "type": "text",
    "required": true,
    "defaultValue": {
      "source": "static",
      "value": ""
    }
  },
  {
    "field": "method",
    "label": "方法",
    "type": "select_single",
    "mode": "button",
    "required": true,
    "defaultValue": {
      "source": "static",
      "value": "GET"
    },
    "options": {
      "from": "manual",
      "data": [
        {
          "label": "GET",
          "value": "GET"
        },
        {
          "label": "POST",
          "value": "POST"
        }
      ]
    }
  },
  {
    "field": "contentType",
    "label": "入参形式",
    "type": "select_single",
    "mode": "button",
    "defaultValue": {
      "source": "static",
      "value": "json"
    },
    "options": {
      "from": "manual",
      "data": [
        {
          "label": "json",
          "value": "json"
        },
        {
          "label": "form-data",
          "value": "form-data"
        }
      ]
    }
  },
  {
    "field": "withCredentials",
    "label": "携带认证",
    "type": "switch"
  }
]

export default config