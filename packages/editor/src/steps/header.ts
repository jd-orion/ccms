import { FormConfig } from "ccms/dist/src/steps/form";
import { HeaderConfig } from "ccms/dist/src/steps/header";

export const Config: FormConfig = {
  "type": "form",
  "fields": [
    {
      "field": "type",
      "label": "类型",
      "type": "hidden",
      "defaultValue": {
        "source": "static",
        "value": "header"
      }
    },
    {
      "label": "主标题",
      "field": "title",
      "type": "group",
      "fields": [
        {
          "label": "文案",
          "field": "statement",
          "type": "text"
        },
        {
          "label": "参数",
          "field": "params",
          "type": "form",
          "primaryField": "field",
          "fields": [
            {
              "label": "字段名",
              "field": "field",
              "type": "text"
            },
            {
              "label": "数据来源",
              "field": "data",
              "type": "import_subform",
              "interface": {
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/ParamConfig.json",
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
          "canCollapse": true,
          "canSort": true
        }
      ]
    },
    {
      "label": "副标题",
      "field": "subTitle",
      "type": "group",
      "fields": [
        {
          "label": "文案",
          "field": "statement",
          "type": "text"
        },
        {
          "label": "参数",
          "field": "params",
          "type": "form",
          "primaryField": "field",
          "fields": [
            {
              "label": "字段名",
              "field": "field",
              "type": "text"
            },
            {
              "label": "数据来源",
              "field": "data",
              "type": "import_subform",
              "interface": {
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/ParamConfig.json",
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
          "canCollapse": true,
          "canSort": true
        }
      ]
    },
    {
      "label": "返回按钮",
      "field": "back",
      "type": "group",
      "fields": [
        {
          "label": "启用",
          "field": "enable",
          "type": "switch"
        }
      ]
    },
    {
      "label": "面包屑",
      "field": "breadcrumb",
      "type": "group",
      "fields": [
        {
          "label": "启用",
          "field": "enable",
          "type": "switch"
        },
        {
          "label": "分隔符",
          "field": "separator",
          "type": "text",
          "defaultValue": {
            "source": "static",
            "value": ">"
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
          "label": "面包屑项",
          "field": "items",
          "type": "form",
          "primaryField": "label",
          "fields": [
            {
              "label": "文案",
              "field": "label",
              "type": "text"
            },
            {
              "label": "样式",
              "field": "type",
              "type": "select_single",
              "mode": "button",
              "options": {
                "from": "manual",
                "data": [
                  {
                    "label": "默认",
                    "value": "normal"
                  },
                  {
                    "label": "加粗",
                    "value": "bold"
                  }
                ]
              },
              "defaultValue": {
                "source": "static",
                "value": "noamrl"
              }
            },
            {
              "label": "操作",
              "field": "action",
              "type": "import_subform",
              "interface": {
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/OperationConfig.json",
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
                  "global": "CCMS_CONFIG_common_OperationConfig"
                }
              }
            }
          ],
          "canInsert": true,
          "canRemove": true,
          "canCollapse": true,
          "canSort": true,
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
    },
    {
      "label": "主内容",
      "field": "mainContent",
      "type": "group",
      "fields": [
        {
          "label": "启用",
          "field": "enable",
          "type": "switch"
        },
        {
          "label": "类型",
          "field": "type",
          "type": "select_single",
          "mode": "dropdown",
          "canClear": true,
          "options": {
            "from": "manual",
            "data": [
              {
                "label": "纯文本",
                "value": "plain"
              },
              {
                "label": "Markdown格式文本",
                "value": "markdown"
              },
              {
                "label": "HTML格式文本",
                "value": "html"
              },
              {
                "label": "详情内容",
                "value": "detail"
              },
              {
                "label": "统计内容",
                "value": "statistic"
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
          "label": "文本内容",
          "field": "content",
          "type": "longtext",
          "condition": {
            "template": "${enable} === true && ['plain','markdown','html'].includes(${type})",
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
                  "field": "type"
                }
              }
            ]
          }
        },
        {
          "label": "文本参数",
          "field": "params",
          "type": "form",
          "primaryField": "field",
          "fields": [
            {
              "label": "字段名",
              "field": "field",
              "type": "text"
            },
            {
              "label": "数据来源",
              "field": "data",
              "type": "import_subform",
              "interface": {
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/ParamConfig.json",
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
          "canCollapse": true,
          "canSort": true,
          "condition": {
            "template": "${enable} === true && ['plain','markdown','html'].includes(${type})",
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
                  "field": "type"
                }
              }
            ]
          }
        },
        {
          "field": "defaultValue",
          "label": "数据来源",
          "type": "import_subform",
          "interface": {
            "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/ParamConfig.json",
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
          },
          "condition": {
            "template": "${enable} === true && ${type} === 'detail'",
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
                  "field": "type"
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
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/detail/index.json",
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
                  "global": "CCMS_CONFIG_detail"
                }
              }
            },
          ],
          "canInsert": true,
          "canRemove": true,
          "canCollapse": true,
          "canSort": true,
          "initialValues": {
            "label": "",
            "field": ""
          },
          "condition": {
            "template": "${enable} === true && ${type} === 'detail'",
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
                  "field": "type"
                }
              }
            ]
          }
        },
        {
          "label": "统计内容",
          "field": "statistics",
          "type": "form",
          "primaryField": "label",
          "fields": [
            {
              "label": "标题",
              "field": "label",
              "type": "text"
            },
            {
              "label": "类型",
              "field": "type",
              "type": "select_single",
              "mode": "button",
              "options": {
                "from": "manual",
                "data": [
                  {
                    "label": "值",
                    "value": "value"
                  },
                  {
                    "label": "映射值",
                    "value": "enumeration"
                  }
                ]
              },
              "defaultValue": {
                "source": "static",
                "value": "value"
              }
            },
            {
              "label": "数据来源",
              "field": "value",
              "type": "import_subform",
              "interface": {
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/ParamConfig.json",
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
                    "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/EnumerationConfig.json",
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
              ],
              "condition": {
                "template": "${type} === 'enumeration'",
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
          ],
          "canInsert": true,
          "canRemove": true,
          "canCollapse": true,
          "canSort": true,
          "condition": {
            "template": "${enable} === true && ${type} === 'statistic'",
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
                  "field": "type"
                }
              }
            ]
          }
        }
      ]
    },
    {
      "label": "扩展内容",
      "field": "extraContent",
      "type": "group",
      "fields": [
        {
          "label": "启用",
          "field": "enable",
          "type": "switch"
        },
        {
          "label": "类型",
          "field": "type",
          "type": "select_single",
          "mode": "dropdown",
          "canClear": true,
          "options": {
            "from": "manual",
            "data": [
              {
                "label": "统计内容",
                "value": "statistic"
              },
              {
                "label": "图片内容",
                "value": "image"
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
          "label": "统计内容",
          "field": "statistics",
          "type": "form",
          "primaryField": "label",
          "fields": [
            {
              "label": "标题",
              "field": "label",
              "type": "text"
            },
            {
              "label": "类型",
              "field": "type",
              "type": "select_single",
              "mode": "button",
              "options": {
                "from": "manual",
                "data": [
                  {
                    "label": "值",
                    "value": "value"
                  },
                  {
                    "label": "映射值",
                    "value": "enumeration"
                  }
                ]
              },
              "defaultValue": {
                "source": "static",
                "value": "value"
              }
            },
            {
              "label": "数据来源",
              "field": "value",
              "type": "import_subform",
              "interface": {
                "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/ParamConfig.json",
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
          "canCollapse": true,
          "canSort": true,
          "condition": {
            "template": "${enable} === true && ${type} === 'statistic'",
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
                  "field": "type"
                }
              }
            ]
          }
        },
        {
          "label": "图片内容",
          "field": "image",
          "type": "group",
          "fields": [
            {
              "label": "图片URL",
              "field": "src",
              "type": "text"
            },
            {
              "label": "最大宽度",
              "field": "maxWidth",
              "type": "text"
            },
            {
              "label": "最大高度",
              "field": "maxHeight",
              "type": "text"
            }
          ],
          "condition": {
            "template": "${enable} === true && ${type} === 'image'",
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
  "actions": []
}

export const Template: HeaderConfig = {
  "type": "header"
}