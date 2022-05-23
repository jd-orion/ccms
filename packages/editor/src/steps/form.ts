import { FormConfig } from "ccms/dist/src/steps/form";

export const Config: FormConfig = {
  "type": "form",
  "fields": [
    {
      "field": "type",
      "label": "类型",
      "type": "hidden",
      "defaultValue": {
        "source": "static",
        "value": "form"
      }
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
        "method": "GET",
        "cache": {
          "global": "CCMS_CONFIG_common_ColumnsConfig"
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
      "field": "columns.gap",
      "label": "分栏边距",
      "type": "number",
      "defaultValue": {
        "source": "static",
        "value": 32
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
      "field": "columns.rowGap",
      "label": "分栏下边距",
      "type": "number",
      "defaultValue": {
        "source": "static",
        "value": 0
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
            "url": "${configDomain}/form/index.json",
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
            "method": "GET",
            "cache": {
              "global": "CCMS_CONFIG_form"
            }
          }
        }
      ],
      "initialValues": {
        "label": "",
        "field": ""
      }
    },
    {
      "field": "validations",
      "label": "全局校验",
      "type": "form",
      "primaryField": "condition.template",
      "fields": [
        {
          "field": "condition",
          "label": "校验条件",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/common/ConditionConfig.json",
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
            "method": "GET",
            "cache": {
              "global": "CCMS_CONFIG_common_ConditionConfig"
            }
          }
        },
        {
          "label": "失败提示信息",
          "field": "message",
          "type": "group",
          "fields": [
            {
              "field": "statement",
              "type": "text",
              "label": "提示文案"
            },
            {
              "field": "params",
              "type": "form",
              "label": "失败提示参数",
              "primaryField": "field",
              "fields": [
                {
                  "label": "参数",
                  "field": "field",
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
                    "method": "GET",
                    "cache": {
                      "global": "CCMS_CONFIG_common_ParamConfig"
                    }
                  }
                }
              ],
              "canInsert": true,
              "canRemove": true,
              "canCollapse": true,
              "canSort": true
            }
          ]
        }
      ],
      "canInsert": true,
      "canRemove": true,
      "canCollapse": true,
      "canSort": true
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
            "method": "GET",
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
        }
      ]
    },
    {
      "field": "stringify",
      "label": "序列化数据",
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
    {
      "type": "form",
      "field": "actions",
      "label": "左下表单按钮列表",
      "primaryField": "label",
      "canInsert": true,
      "canRemove": true,
      "canSort": true,
      "canCollapse": true,
      "fields": [
        {
          "field": "type",
          "label": "按钮操作类型",
          "type": "select_single",
          "mode": "button",
          "defaultValue": {
            "source": "static",
            "value": "submit"
          },
          "options": {
            "from": "manual",
            "data": [
              {
                "value": "submit",
                "label": "提交"
              },
              {
                "value": "cancel",
                "label": "取消"
              },
              {
                "value": "ccms",
                "label": "自定义"
              }
            ]
          }
        },
        {
          "field": "label",
          "label": "按钮文案",
          "type": "text"
        },
        {
          "field": "mode",
          "label": "按钮形式",
          "type": "select_single",
          "mode": "button",
          "defaultValue": {
            "source": "static",
            "value": "normal"
          },
          "options": {
            "from": "manual",
            "data": [
              {
                "value": "normal",
                "label": "普通按钮"
              },
              {
                "value": "primary",
                "label": "主按钮"
              },
              {
                "value": "link",
                "label": "链接"
              }
            ]
          }
        },
        {
          "field": "submitValidate",
          "label": "点击前校验",
          "type": "switch",
          "condition": {
            "template": "${type} === 'ccms'",
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
          "field": "condition",
          "label": "展示条件",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/common/ConditionConfig.json",
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
            "method": "GET",
            "cache": {
              "global": "CCMS_CONFIG_common_ConditionConfig"
            }
          }
        },
        {
          "label": "",
          "field": "handle",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/common/OperationConfig.json",
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
            "method": "GET",
            "cache": {
              "global": "CCMS_CONFIG_common_OperationConfig"
            }
          },
          "condition": {
            "template": "${type} === 'ccms'",
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
          "field": "callback",
          "label": "回调",
          "type": "group",
          "fields": [
            {
              "field": "type",
              "label": "回调操作",
              "type": "select_single",
              "mode": "button",
              "defaultValue": {
                "source": "static",
                "value": "none"
              },
              "options": {
                "from": "manual",
                "data": [
                  {
                    "value": "none",
                    "label": "无操作"
                  },
                  {
                    "value": "submit",
                    "label": "提交"
                  },
                  {
                    "value": "cancel",
                    "label": "取消"
                  }
                ]
              }
            }
          ],
          "condition": {
            "template": "${type} === 'ccms'",
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
      "type": "form",
      "field": "rightTopActions",
      "label": "右上表单按钮列表",
      "primaryField": "label",
      "canInsert": true,
      "canRemove": true,
      "canSort": true,
      "canCollapse": true,
      "fields": [
        {
          "field": "type",
          "label": "按钮操作类型",
          "type": "select_single",
          "mode": "button",
          "defaultValue": {
            "source": "static",
            "value": "submit"
          },
          "options": {
            "from": "manual",
            "data": [
              {
                "value": "submit",
                "label": "提交"
              },
              {
                "value": "cancel",
                "label": "取消"
              },
              {
                "value": "ccms",
                "label": "自定义"
              }
            ]
          }
        },
        {
          "field": "label",
          "label": "按钮文案",
          "type": "text"
        },
        {
          "field": "mode",
          "label": "按钮形式",
          "type": "select_single",
          "mode": "button",
          "defaultValue": {
            "source": "static",
            "value": "normal"
          },
          "options": {
            "from": "manual",
            "data": [
              {
                "value": "normal",
                "label": "普通按钮"
              },
              {
                "value": "primary",
                "label": "主按钮"
              },
              {
                "value": "link",
                "label": "链接"
              }
            ]
          }
        },
        {
          "field": "submitValidate",
          "label": "点击前校验",
          "type": "switch",
          "condition": {
            "template": "${type} === 'ccms'",
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
          "field": "condition",
          "label": "展示条件",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/common/ConditionConfig.json",
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
            "method": "GET",
            "cache": {
              "global": "CCMS_CONFIG_common_ConditionConfig"
            }
          }
        },
        {
          "label": "",
          "field": "handle",
          "type": "import_subform",
          "interface": {
            "url": "${configDomain}/common/OperationConfig.json",
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
            "method": "GET",
            "cache": {
              "global": "CCMS_CONFIG_common_OperationConfig"
            }
          },
          "condition": {
            "template": "${type} === 'ccms'",
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
          "field": "callback",
          "label": "回调",
          "type": "group",
          "fields": [
            {
              "field": "type",
              "label": "回调操作",
              "type": "select_single",
              "mode": "button",
              "defaultValue": {
                "source": "static",
                "value": "none"
              },
              "options": {
                "from": "manual",
                "data": [
                  {
                    "value": "none",
                    "label": "无操作"
                  },
                  {
                    "value": "submit",
                    "label": "提交"
                  },
                  {
                    "value": "cancel",
                    "label": "取消"
                  }
                ]
              }
            }
          ],
          "condition": {
            "template": "${type} === 'ccms'",
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
    }
  ],
  "defaultValue": {
    "source": "data",
    "field": ""
  },
  "actions": [],
  "rightTopActions": []
}

export const Template: FormConfig = {
  "type": "form",
  "actions": [
    {
      "type": "submit",
      "label": "提交",
      "mode": "primary",
      "submitValidate": false
    },
    {
      "type": "cancel",
      "label": "取消",
      "mode": "normal",
      "submitValidate": false
    }
  ],
  "rightTopActions": []
}
