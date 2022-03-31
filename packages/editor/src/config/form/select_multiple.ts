import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "展示配置",
    "type": "group",
    "fields": [
      {
        "field": "mode",
        "label": "展示形式",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "dropdown",
              "label": "下拉选框"
            },
            {
              "value": "checkbox",
              "label": "复选框"
            }
          ]
        }
      },
      {
        "field": "multiple.type",
        "label": "复选形式",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "array",
              "label": "数组"
            },
            {
              "value": "split",
              "label": "字符串分隔"
            }
          ]
        }
      },
      {
        "field": "multiple.split",
        "label": "分隔符",
        "type": "text",
        "condition": {
          "template": "${type} === 'split'",
          "params": [
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "multiple.type"
              }
            }
          ]
        }
      },
      {
        "field": "multiple.valueType",
        "label": "选项值类型",
        "type": "select_single",
        "mode": "dropdown",
        "canClear": true,
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "string",
              "label": "字符串"
            },
            {
              "value": "number",
              "label": "数字"
            }
          ]
        },
        "condition": {
          "template": "${type} === 'split'",
          "params": [
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "multiple.type"
              }
            }
          ]
        }
      },
      {
        "field": "placeholder",
        "label": "占位符",
        "type": "text",
        "condition": {
          "template": "${mode} === 'dropdown'",
          "params": [
            {
              "field": "mode",
              "data": {
                "source": "record",
                "field": "mode"
              }
            }
          ]
        }
      },
      {
        "field": "canClear",
        "label": "允许清除",
        "type": "switch",
        "condition": {
          "template": "${mode} === 'dropdown'",
          "params": [
            {
              "field": "mode",
              "data": {
                "source": "record",
                "field": "mode"
              }
            }
          ]
        }
      },
      {
        "field": "options",
        "label": "选项",
        "type": "group",
        "fields": [
          {
            "field": "",
            "label": "",
            "type": "import_subform",
            "interface": {
              "url": "/ccms/config/${version}/${subversion}/common/EnumerationConfig.json",
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
                "global": "CCMS_CONFIG_common_EnumerationConfig"
              }
            }
          }
        ]
      }
    ]
  }
]

export default config