import { FormConfig } from "ccms/dist/src/steps/form";
import { FilterConfig } from "ccms/dist/src/steps/filter";

export const Config: FormConfig = {
  "type": "form",
  "fields": [
    {
      "field": "type",
      "label": "类型",
      "type": "hidden",
      "defaultValue": {
        "source": "static",
        "value": "filter"
      }
    },
    {
      "field": "fields",
      "label": "表单项",
      "type": "form",
      "primaryField": "label",
      "canInsert": true,
      "canRemove": true,
      "canSort": true,
      "canCollapse": true,
      "fields": [
        {
          "field": "label",
          "label": "字段描述",
          "type": "text"
        },
        {
          "field": "field",
          "label": "字段名",
          "type": "text"
        },
        {
          "field": "",
          "label": "",
          "type": "import_subform",
          "interface": {
            "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/form/index.json",
            "urlParams": [
              {
                "field": "version",
                "data": {
                  "source": "source",
                  "field": "version"
                }
              },
              {
                "field": "subversion",
                "data": {
                  "source": "source",
                  "field": "subversion"
                }
              }
            ],
            "method": 'GET',
            "cache": {
              "global": "CCMS_CONFIG_form"
            }
          }
        }
      ],
      "initialValues": {
        "label": ""
      }
    },
    {
      "field": "hiddenSubmit",
      "label": "是否隐藏确定按钮",
      "type": "switch"
    },
    {
      "field": "submitText",
      "label": "确定按钮文案",
      "type": "text"
    },
    {
      "field": "hiddenReset",
      "label": "是否隐藏重置按钮",
      "type": "switch"
    },
    {
      "field": "resetText",
      "label": "重置按钮文案",
      "type": "text"
    }
  ],
  "defaultValue": {
    "source": "data",
    "field": ""
  },
  "actions": []
}

export const Template: FilterConfig = {
  "type": 'filter'
}