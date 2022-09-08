import { FormConfig } from "ccms/dist/steps/form";
import { DetailConfig } from "ccms/dist/steps/detail";

export const Config: FormConfig = {
  "type": "form",
  "fields": [
    {
      "field": "type",
      "label": "类型",
      "type": "hidden",
      "defaultValue": {
        "source": "static",
        "value": "detail"
      }
    },
    {
      "field": "",
      "label": "数据来源",
      "type": "group",
      "fields": [
        {
          "field": "defaultValue",
          "label": "",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/common/ParamConfig.json",
            "urlParams": [
              {
                "field": "version",
                "data": {
                  "source": "source",
                  "field": "version"
                }
              },
              {
                "field": "configDomain",
                "data": {
                  "source": "source",
                  "field": "configDomain"
                }
              }
            ],
            "method": 'GET',
            "cache": {
              "global": "CCMS_CONFIG_common_ParamConfig"
            }
          }
        },
        {
          "field": "unstringify",
          "label": "反序列化数据",
          "type": "form",
          "primaryField": "",
          "fields": [
            {
              "field": "",
              "label": "字段",
              "type": "text"
            }
          ],
          "canInsert": true,
          "canRemove": true,
          "canSort": true,
          "canCollapse": true,
          "initialValues": ""
        },
      ]
    },
    {
      "field": "columns.enable",
      "label": "分栏配置",
      "type": "switch"
    },
    {
      "field": "columns",
      "label": "分栏配置",
      "type": "import_subform",
      "interface": {
        "url": "${configDomain}/common/ColumnsConfig.json",
        "urlParams": [
          {
            "field": "version",
            "data": {
              "source": "source",
              "field": "version"
            }
          },
          {
            "field": "configDomain",
            "data": {
              "source": "source",
              "field": "configDomain"
            }
          }
        ],
        "method": 'GET',
        "cache": {
          "global": "CCMS_CONFIG_form"
        }
      },
      "condition": {
        "template": "${enable} === true",
        "params": [
          {
            "field": "enable",
            "data": {
              "source": "record",
              "field": "columns.enable"
            }
          }
        ]
      }
    },
    {
      "field": "fields",
      "label": "展示项",
      "type": "form",
      "primaryField": "label",
      "fields": [
        {
          "field": "label",
          "label": "字段描述",
          "type": "text"
        },
        {
          "field": "field",
          "label": "字段名",
          "type": "text",
          "defaultValue": {
            "source": "static",
            "value": ""
          }
        },
        {
          "field": "",
          "label": "",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/detail/index.json",
            "urlParams": [
              {
                "field": "version",
                "data": {
                  "source": "source",
                  "field": "version"
                }
              },
              {
                "field": "configDomain",
                "data": {
                  "source": "source",
                  "field": "configDomain"
                }
              }
            ],
            "method": 'GET',
            "cache": {
              "global": "CCMS_CONFIG_detail"
            }
          }
        }
      ],
      "canInsert": true,
      "canRemove": true,
      "canCollapse": true,
      "canSort": true,
      "initialValues": {
        "label": "",
        "field": ""
      }
    },
    {
      "field": "hiddenBack",
      "label": "是否隐藏返回按钮",
      "type": "switch"
    },
    {
      "field": "backText",
      "label": "返回按钮文案",
      "type": "text"
    }
  ],
  "defaultValue": {
    "source": "data",
    "field": ""
  },
  "actions": [],
  "rightTopActions": []
}

export const Template: DetailConfig = {
  "type": 'detail'
}