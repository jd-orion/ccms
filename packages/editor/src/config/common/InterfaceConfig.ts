import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "domain",
    "label": "域名",
    "type": "text"
  },
  {
    "field": "url",
    "label": "URL",
    "type": "text"
  },
  {
    "field": "urlParams",
    "label": "URL参数",
    "type": "form",
    "primaryField": "field",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "field",
        "label": "参数名",
        "type": "text"
      },
      {
        "field": "data",
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
      }
    ]
  },
  {
    "field": "method",
    "label": "请求方法",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "GET",
          "label": "GET"
        },
        {
          "value": "POST",
          "label": "POST"
        }
      ]
    }
  },
  {
    "field": "contentType",
    "label": "数据格式",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "json",
          "label": "json"
        },
        {
          "value": "form-data",
          "label": "form-data"
        }
      ]
    },
    "condition": {
      "template": "${method} === 'POST'",
      "params": [
        {
          "field": "method",
          "data": {
            "source": "record",
            "field": "method"
          }
        }
      ]
    }
  },
  {
    "field": "withCredentials",
    "label": "携带认证",
    "type": "switch"
  },
  {
    "field": "params",
    "label": "GET传参",
    "type": "form",
    "primaryField": "field",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "field",
        "label": "参数名",
        "type": "text"
      },
      {
        "field": "data",
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
      }
    ]
  },
  {
    "field": "data",
    "label": "POST传参",
    "type": "form",
    "primaryField": "field",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "field",
        "label": "参数名",
        "type": "text"
      },
      {
        "field": "data",
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
      }
    ]
  },
  {
    "field": "condition",
    "label": "接口校验",
    "type": "group",
    "fields": [
      {
        "field": "enable",
        "label": "启用",
        "type": "switch"
      },
      {
        "field": "field",
        "label": "校验字段",
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
        "field": "value",
        "label": "校验值",
        "type": "any",
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
        "field": "success.type",
        "label": "成功时",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "none",
              "label": "无操作"
            },
            {
              "value": "modal",
              "label": "弹窗"
            }
          ]
        },
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
        "field": "success.content.type",
        "label": "提示",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "static",
              "label": "固定值"
            },
            {
              "value": "field",
              "label": "下发值"
            }
          ]
        },
        "condition": {
          "template": "${enable} === true && ${type} === 'modal'",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            },
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "success.type"
              }
            }
          ]
        }
      },
      {
        "field": "success.content.content",
        "label": "内容",
        "type": "text",
        "condition": {
          "template": "${enable} === true && ${type} === 'modal' && ${content} === 'static'",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            },
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "success.type"
              }
            },
            {
              "field": "content",
              "data": {
                "source": "record",
                "field": "success.content.type"
              }
            }
          ]
        }
      },
      {
        "field": "success.content.field",
        "label": "字段",
        "type": "text",
        "condition": {
          "template": "${enable} === true && ${type} === 'modal' && ${content} === 'field'",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            },
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "success.type"
              }
            },
            {
              "field": "content",
              "data": {
                "source": "record",
                "field": "success.content.type"
              }
            }
          ]
        }
      },
      {
        "field": "fail.type",
        "label": "失败时",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "none",
              "label": "无操作"
            },
            {
              "value": "modal",
              "label": "弹窗"
            }
          ]
        },
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
        "field": "fail.content.type",
        "label": "提示",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "static",
              "label": "固定值"
            },
            {
              "value": "field",
              "label": "下发值"
            }
          ]
        },
        "condition": {
          "template": "${enable} === true && ${type} === 'modal'",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            },
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "fail.type"
              }
            }
          ]
        }
      },
      {
        "field": "fail.content.content",
        "label": "内容",
        "type": "text",
        "condition": {
          "template": "${enable} === true && ${type} === 'modal' && ${content} === 'static'",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            },
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "fail.type"
              }
            },
            {
              "field": "content",
              "data": {
                "source": "record",
                "field": "fail.content.type"
              }
            }
          ]
        }
      },
      {
        "field": "fail.content.field",
        "label": "字段",
        "type": "text",
        "condition": {
          "template": "${enable} === true && ${type} === 'modal' && ${content} === 'field'",
          "params": [
            {
              "field": "enable",
              "data": {
                "source": "record",
                "field": "enable"
              }
            },
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "fail.type"
              }
            },
            {
              "field": "content",
              "data": {
                "source": "record",
                "field": "fail.content.type"
              }
            }
          ]
        }
      }
    ]
  },
  {
    "field": "response",
    "label": "响应",
    "type": "form",
    "primaryField": 'field',
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "field",
        "label": "目标字段",
        "type": "text"
      },
      {
        "field": "path",
        "label": "来源字段",
        "type": "text"
      }
    ]
  },
  {
    "field": "cache.disable",
    "label": "禁用缓存",
    "type": "switch"
  }
]

export default config