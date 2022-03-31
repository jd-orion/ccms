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
              "value": "radio",
              "label": "单选框"
            },
            {
              "value": "button",
              "label": "按钮组"
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
      },
      {
        "field": "defaultSelect",
        "label": "默认选中项目",
        "type": "number"
      }
    ]
  }
]

export default config