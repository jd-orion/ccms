import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "configFrom",
    "label": "",
    "type": "group",
    "fields": [
      {
          "field": "type",
          "label": "配置来源",
          "type": "select_single",
          "mode": "dropdown",
          "canClear": true,
          "options": {
              "from": "manual",
              "data": [
                  {
                      "value": "data",
                      "label": "数据"
                  },
                  {
                      "value": "interface",
                      "label": "接口"
                  }
              ]
          }
      },
      {
          "field": "dataField",
          "label": "数据字段",
          "type": "text",
          "condition": {
              "template": "${type} === 'data'",
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
          "field": "configField",
          "label": "配置字段",
          "type": "text",
          "condition": {
              "template": "${type} === 'data'",
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
        "field": "interface",
        "label": "接口配置",
        "type": "import_subform",
        "interface": {
          "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/InterfaceConfig.json",
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
            "global": "CCMS_CONFIG_common_InterfaceConfig"
          }
        },
        "condition": {
          "template": "${type} === 'interface'",
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
      }
    ]
  },
  {
    "field": "withConfig",
    "label": "拓展配置",
    "type": "group",
    "fields": [
      {
        "field": "enable",
        "label": "是否开启",
        "type": "switch"
      },
      {
        "field": "dataField",
        "label": "数据项",
        "type": "text",
        "condition": {
          "template": "${enable} === true",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            }
          ]
        }
      },
      {
        "field": "configField",
        "label": "配置项",
        "type": "text",
        "condition": {
          "template": "${enable} === true",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            }
          ]
        }
      }
    ]
  }
]

export default config