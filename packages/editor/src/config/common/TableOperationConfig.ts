import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "condition",
    "label": "展示条件",
    "type": "import_subform",
    "interface": {
      "url": "/ccms/config/${version}/${subversion}/common/ConditionConfig.json",
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
        "global": "CCMS_CONFIG_common_ConditionConfig"
      }
    }
  },
  {
    "field": "handle",
    "label": "处理逻辑",
    "type": "group",
    "fields": [
      {
        "field": "type",
        "label": "处理方式",
        "type": "hidden",
        "defaultValue": {
          "source": "static",
          "value": "ccms"
        }
      },
      {
        "field": "page",
        "label": "目标页面",
        "type": "tree_select",
        "defaultValue": {
          "source": "static",
          "value": 0
        },
        "treeData": {
          "from": "interface",
          "interface": {
            "url": "/api/menu/${applicationName}/all${businessSuffix}",
            "urlParams": [
              {
                "field": "applicationName",
                "data": {
                  "source": "source",
                  "field": "applicationName"
                }
              },
              {
                "field": "businessSuffix",
                "data": {
                  "source": "source",
                  "field": "businessSuffix"
                }
              }
            ],
            "method": "GET",
            "withCredentials": true,
            "response": {
              "root": "rs"
            },
            "condition": {
              "enable": true,
              "field": "code",
              "value": 1000,
              "success": {
                "type": "none"
              },
              "fail": {
                "type": "modal",
                "content": {
                  "type": "field",
                  "field": "msg"
                }
              }
            }
          },
          "format": {
            "type": "list",
            "keyField": "menuId",
            "titleField": "menuName",
            "childrenField": "children"
          }
        }
      },
      {
        "field": "target",
        "label": "打开方式",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "current",
              "label": "弹窗"
            },
            {
              "value": "handle",
              "label": "操作"
            },
            {
              "value": "page",
              "label": "页面跳转"
            },
            {
              "value": "open",
              "label": "新标签页"
            }
          ]
        }
      },
      {
        "field": "historyTpye",
        "label": "路由",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "replace",
              "label": "替换原路由"
            },
            {
              "value": "",
              "label": "新路由"
            }
          ]
        },
        "condition": {
          "template": "${target} === 'page'",
          "params": [
            {
              "field": "target",
              "data": {
                "source": "record",
                "field": "target"
              }
            }
          ]
        }
      },
      {
        "field": "params",
        "label": "参数传递",
        "type": "form",
        "primaryField": "field",
        "fields": [
          {
            "field": "field",
            "label": "字段名",
            "type": "text"
          },
          {
            "field": "data",
            "label": "",
            "type": "import_subform",
            "interface": {
              "url": "/ccms/config/${version}/${subversion}/common/ParamConfig.json",
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
                "global": "CCMS_CONFIG_common_ParamConfig"
              }
            }
          }
        ],
        "canInsert": true,
        "canRemove": true,
        "canSort": true,
        "canCollapse": true
      },
      {
        "field": "callback",
        "label": "确认回调刷新",
        "type": "switch"
      },
      {
        "field": "cancelCallback",
        "label": "关闭回调刷新",
        "type": "switch",
        "condition": {
          "template": "${target} === 'current'",
          "params": [
            {
              "field": "target",
              "data": {
                "source": "record",
                "field": "target"
              }
            }
          ]
        }
      },
      {
        "field": "debug",
        "label": "调试",
        "type": "switch"
      }
    ]
  },
  {
    "field": "confirm",
    "label": "二次确认",
    "type": "group",
    "fields": [
      {
        "field": "enable",
        "label": "启用",
        "type": "switch",
        "defaultValue": {
          "source": "static",
          "value": false
        }
      },
      {
        "field": "titleText", 
        "label": "确认文案",
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
        "field": "titleParams",
        "label": "文案参数",
        "type": "form",
        "primaryField": "field",
        "canInsert": true,
        "canRemove": true,
        "canSort": true,
        "canCollapse": true,
        "fields": [
          {
            "field": "field",
            "label": "参数",
            "type": "text"
          },
          {
            "field": "data",
            "label": "",
            "type": "import_subform",
            "interface": {
              "url": "/ccms/config/${version}/${subversion}/common/ParamConfig.json",
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
                "global": "CCMS_CONFIG_common_ParamConfig"
              }
            }
          }
        ],
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
        "field": "okText",
        "label": "确定按钮",
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
        "field": "cancelText",
        "label": "取消按钮",
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