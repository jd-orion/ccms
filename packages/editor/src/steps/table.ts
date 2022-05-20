import { FormConfig } from "ccms/dist/src/steps/form"
import { TableConfig } from "ccms/dist/src/steps/table"

export const Config: FormConfig = {
  type: "form",
  fields: [
    {
      field: "type",
      label: "类型",
      type: "hidden"
    },
    {
      field: "field",
      label: "数据字段",
      type: "text"
    },
    {
      field: "label",
      label: "表格标题",
      type: "text"
    },
    {
      field: "description",
      label: "表格说明",
      type: "group",
      fields: [
        {
          field: "type",
          label: "描述类型",
          type: "select_single",
          mode: "dropdown",
          defaultValue: {
            source: "static",
            value: "text"
          },
          options: {
            from: "manual",
            data: [
              {
                value: "text",
                label: "仅描述文案"
              },
              {
                value: "tooltip",
                label: "文案及气泡弹层"
              },
              {
                value: "modal",
                label: "文案及详情弹窗"
              }
            ]
          }
        },
        {
          label: "描述内容",
          field: "label",
          type: "group",
          fields: [
            {
              label: "文案",
              field: "statement",
              type: "text"
            },
            {
              label: "参数",
              field: "params",
              type: "form",
              primaryField: "field",
              fields: [
                {
                  label: "字段名",
                  field: "field",
                  type: "text"
                },
                {
                  label: "数据来源",
                  field: "data",
                  type: "import_subform",
                  interface: {
                    url: "${configDomain}/common/ParamConfig.json",
                    urlParams: [
                      {
                        field: "version",
                        data: {
                          source: "source",
                          field: "version"
                        }
                      },
                      {
                        field: "configDomain",
                        data: {
                          source: "source",
                          field: "configDomain"
                        }
                      }
                    ],
                    method: "GET",
                    cache: {
                      global: "CCMS_CONFIG_common_ParamConfig"
                    }
                  }
                }
              ],
              canInsert: true,
              canRemove: true,
              canCollapse: true,
              canSort: true
            }
          ]
        },
        {
          field: "mode",
          label: "详情类型",
          type: "select_single",
          mode: "button",
          condition: {
            template: "${type} !== 'text'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          },
          defaultValue: {
            source: "static",
            value: "plain"
          },
          options: {
            from: "manual",
            data: [
              {
                value: "plain",
                label: "纯文本"
              },
              {
                value: "markdown",
                label: "Markdown"
              },
              {
                value: "html",
                label: "HTML"
              }
            ]
          }
        },
        {
          label: "详情内容",
          field: "content",
          type: "group",
          condition: {
            template: "${type} !== 'text'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          },
          fields: [
            {
              label: "文案",
              field: "statement",
              type: "text"
            },
            {
              label: "参数",
              field: "params",
              type: "form",
              primaryField: "field",
              fields: [
                {
                  label: "字段名",
                  field: "field",
                  type: "text"
                },
                {
                  label: "数据来源",
                  field: "data",
                  type: "import_subform",
                  interface: {
                    url: "${configDomain}/common/ParamConfig.json",
                    urlParams: [
                      {
                        field: "version",
                        data: {
                          source: "source",
                          field: "version"
                        }
                      },
                      {
                        field: "configDomain",
                        data: {
                          source: "source",
                          field: "configDomain"
                        }
                      }
                    ],
                    method: "GET",
                    cache: {
                      global: "CCMS_CONFIG_common_ParamConfig"
                    }
                  }
                }
              ],
              canInsert: true,
              canRemove: true,
              canCollapse: true,
              canSort: true
            }
          ]
        },
        {
          field: "showIcon",
          label: "描述icon",
          type: "switch"
        }
      ]
    },
    {
      field: "primary",
      label: "主键字段",
      type: "text"
    },
    {
      field: "rowOperationsPosition",
      label: "操作栏位置",
      type: "select_single",
      mode: "button",
      options: {
        from: "manual",
        data: [
          {
            value: "left",
            label: "左侧"
          },
          {
            value: "",
            label: "右侧"
          }
        ]
      }
    },
    {
      field: "columns",
      label: "表格字段",
      type: "form",
      primaryField: "label",
      canInsert: true,
      canRemove: true,
      canSort: true,
      canCollapse: true,
      fields: [
        {
          field: "label",
          label: "列描述",
          type: "text"
        },
        {
          field: "field",
          label: "列字段",
          type: "text"
        },
        {
          field: "type",
          type: "select_single",
          mode: "dropdown",
          canClear: true,
          options: {
            from: "manual",
            data: [
              {
                value: "text",
                label: "文本"
              },
              {
                value: "multirowText",
                label: "多行文本"
              },
              {
                value: "number",
                label: "数值"
              },
              {
                value: "datetime",
                label: "日期时间"
              },
              {
                value: "datetimeRange",
                label: "日期时间范围"
              },
              {
                value: "Aenum",
                label: "选项"
              },
              {
                value: "image",
                label: "图片"
              },
              {
                value: "custom",
                label: "自定义组件"
              },
              {
                value: "operation",
                label: "操作"
              }
            ]
          },
          label: "列类型"
        },
        {
          field: "align",
          label: "列对齐方式",
          type: "select_single",
          mode: "button",
          canClear: true,
          defaultValue: {
            source: "static",
            value: "left"
          },
          options: {
            from: "manual",
            data: [
              {
                value: "left",
                label: "左对齐"
              },
              {
                value: "center",
                label: "居中"
              },
              {
                value: "right",
                label: "右对齐"
              }
            ]
          }
        },
        {
          field: "style.customStyle.width",
          label: "列宽",
          type: "text",
          defaultValue: {
            source: "static",
            value: ""
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/text.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_text"
            }
          },
          condition: {
            template: "${type} === 'text'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/datetime.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_datetime"
            }
          },
          condition: {
            template: "${type} === 'datetime'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/datetimeRange.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_datetimeRange"
            }
          },
          condition: {
            template: "${type} === 'datetimeRange'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/enum.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_enum"
            }
          },
          condition: {
            template: "${type} === 'Aenum'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/image.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_image"
            }
          },
          condition: {
            template: "${type} === 'image'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/custom.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_custom"
            }
          },
          condition: {
            template: "${type} === 'custom'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/column/operation.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_column_operation"
            }
          },
          condition: {
            template: "${type} === 'operation'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        }
      ],
      initialValues: {
        label: "",
        field: "",
        type: "text"
      }
    },
    {
      field: "pagination",
      label: "分页",
      type: "group",
      fields: [
        {
          field: "mode",
          label: "模式",
          type: "select_single",
          mode: "button",
          options: {
            from: "manual",
            data: [
              {
                value: "none",
                label: "无分页"
              },
              {
                value: "server",
                label: "服务端分页"
              }
            ]
          }
        },
        {
          field: "current",
          label: "当前页码入参",
          type: "text",
          condition: {
            template: "${mode} === 'server'",
            params: [
              {
                field: "mode",
                data: {
                  source: "record",
                  field: "mode"
                }
              }
            ]
          }
        },
        {
          field: "pageSize",
          label: "每页条数入参",
          type: "text",
          condition: {
            template: "${mode} === 'server'",
            params: [
              {
                field: "mode",
                data: {
                  source: "record",
                  field: "mode"
                }
              }
            ]
          }
        },
        {
          field: "total",
          label: "总条数出参",
          type: "text",
          condition: {
            template: "${mode} === 'server'",
            params: [
              {
                field: "mode",
                data: {
                  source: "record",
                  field: "mode"
                }
              }
            ]
          }
        }
      ]
    },
    {
      field: "operations.leftTableOperations",
      label: "页面级按钮(左侧)",
      type: "form",
      primaryField: "label",
      canInsert: true,
      canRemove: true,
      canSort: true,
      canCollapse: true,
      fields: [
        {
          field: "label",
          label: "描述",
          type: "text"
        },
        {
          field: "type",
          label: "类型",
          type: "select_single",
          mode: "button",
          options: {
            from: "manual",
            data: [
              {
                value: "button",
                label: "按钮"
              },
              {
                value: "group",
                label: "按钮组"
              },
              {
                value: "dropdown",
                label: "下拉按钮"
              }
            ]
          }
        },
        {
          field: "level",
          label: "按钮级别",
          type: "select_single",
          mode: "button",
          options: {
            from: "manual",
            data: [
              {
                value: "normal",
                label: "默认"
              },
              {
                value: "primary",
                label: "主按钮"
              },
              {
                value: "danger",
                label: "危险按钮"
              }
            ]
          },
          condition: {
            template: "${type} === 'button' || ${type} === 'dropdown'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/common/TableOperationConfig.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_common_TableOperationConfig"
            }
          },
          condition: {
            template: "${type} === 'button' || ${type} === 'dropdown'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "modalWidthMode",
          label: "弹窗宽度限制方式",
          type: "select_single",
          mode: "button",
          defaultValue: {
            source: "static",
            value: "none"
          },
          options: {
            from: "manual",
            data: [
              {
                value: "none",
                label: "不限制"
              },
              {
                value: "percentage",
                label: "百分比"
              },
              {
                value: "pixel",
                label: "像素值"
              }
            ]
          },
          condition: {
            template: "${target} === 'current'",
            params: [
              {
                field: "target",
                data: {
                  source: "record",
                  field: "handle.target"
                }
              }
            ]
          }
        },
        {
          field: "modalWidthValue",
          label: "弹窗宽度限制值",
          type: "text",
          condition: {
            template: "${target} === 'current' && ${modalWidthMode} !== 'none'",
            params: [
              {
                field: "target",
                data: {
                  source: "record",
                  field: "handle.target"
                }
              },
              {
                field: "modalWidthMode",
                data: {
                  source: "record",
                  field: "modalWidthMode"
                }
              }
            ]
          }
        },
        {
          field: "operations",
          label: "子按钮",
          type: "form",
          primaryField: "label",
          canInsert: true,
          canRemove: true,
          canSort: true,
          canCollapse: true,
          fields: [
            {
              field: "label",
              label: "描述",
              type: "text"
            },
            {
              field: "level",
              label: "按钮级别",
              type: "select_single",
              mode: "button",
              options: {
                from: "manual",
                data: [
                  {
                    value: "normal",
                    label: "默认"
                  },
                  {
                    value: "primary",
                    label: "主按钮"
                  },
                  {
                    value: "danger",
                    label: "危险按钮"
                  }
                ]
              }
            },
            {
              field: "",
              label: "",
              type: "import_subform",
              interface: {
                url: "${configDomain}/common/TableOperationConfig.json",
                urlParams: [
                  {
                    field: "version",
                    data: {
                      source: "source",
                      field: "version"
                    }
                  },
                  {
                    field: "configDomain",
                    data: {
                      source: "source",
                      field: "configDomain"
                    }
                  }
                ],
                method: "GET",
                cache: {
                  global: "CCMS_CONFIG_common_TableOperationConfig"
                }
              }
            },
            {
              field: "modalWidthMode",
              label: "弹窗宽度限制方式",
              type: "select_single",
              mode: "button",
              defaultValue: {
                source: "static",
                value: "none"
              },
              options: {
                from: "manual",
                data: [
                  {
                    value: "none",
                    label: "不限制"
                  },
                  {
                    value: "percentage",
                    label: "百分比"
                  },
                  {
                    value: "pixel",
                    label: "像素值"
                  }
                ]
              },
              condition: {
                template: "${target} === 'current'",
                params: [
                  {
                    field: "target",
                    data: {
                      source: "record",
                      field: "handle.target"
                    }
                  }
                ]
              }
            },
            {
              field: "modalWidthValue",
              label: "弹窗宽度限制值",
              type: "text",
              condition: {
                template: "${target} === 'current' && ${modalWidthMode} !== 'none'",
                params: [
                  {
                    field: "target",
                    data: {
                      source: "record",
                      field: "handle.target"
                    }
                  },
                  {
                    field: "modalWidthMode",
                    data: {
                      source: "record",
                      field: "modalWidthMode"
                    }
                  }
                ]
              }
            }
          ],
          condition: {
            template: "${type} === 'group' || ${type} === 'dropdown'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        }
      ]
    },
    {
      field: "operations.tableOperations",
      label: "页面级按钮(右侧)",
      type: "form",
      primaryField: "label",
      canInsert: true,
      canRemove: true,
      canSort: true,
      canCollapse: true,
      fields: [
        {
          field: "label",
          label: "描述",
          type: "text"
        },
        {
          field: "type",
          label: "类型",
          type: "select_single",
          mode: "button",
          options: {
            from: "manual",
            data: [
              {
                value: "button",
                label: "按钮"
              },
              {
                value: "group",
                label: "按钮组"
              },
              {
                value: "dropdown",
                label: "下拉按钮"
              }
            ]
          }
        },
        {
          field: "level",
          label: "按钮级别",
          type: "select_single",
          mode: "button",
          options: {
            from: "manual",
            data: [
              {
                value: "normal",
                label: "默认"
              },
              {
                value: "primary",
                label: "主按钮"
              },
              {
                value: "danger",
                label: "危险按钮"
              }
            ]
          },
          condition: {
            template: "${type} === 'button' || ${type} === 'dropdown'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/common/TableOperationConfig.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_common_TableOperationConfig"
            }
          },
          condition: {
            template: "${type} === 'button'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "modalWidthMode",
          label: "弹窗宽度限制方式",
          type: "select_single",
          mode: "button",
          defaultValue: {
            source: "static",
            value: "none"
          },
          options: {
            from: "manual",
            data: [
              {
                value: "none",
                label: "不限制"
              },
              {
                value: "percentage",
                label: "百分比"
              },
              {
                value: "pixel",
                label: "像素值"
              }
            ]
          },
          condition: {
            template: "${target} === 'current'",
            params: [
              {
                field: "target",
                data: {
                  source: "record",
                  field: "handle.target"
                }
              }
            ]
          }
        },
        {
          field: "modalWidthValue",
          label: "弹窗宽度限制值",
          type: "text",
          condition: {
            template: "${target} === 'current' && ${modalWidthMode} !== 'none'",
            params: [
              {
                field: "target",
                data: {
                  source: "record",
                  field: "handle.target"
                }
              },
              {
                field: "modalWidthMode",
                data: {
                  source: "record",
                  field: "modalWidthMode"
                }
              }
            ]
          }
        },
        {
          field: "operations",
          label: "子按钮",
          type: "form",
          primaryField: "label",
          canInsert: true,
          canRemove: true,
          canSort: true,
          canCollapse: true,
          fields: [
            {
              field: "label",
              label: "描述",
              type: "text"
            },
            {
              field: "level",
              label: "按钮级别",
              type: "select_single",
              mode: "button",
              options: {
                from: "manual",
                data: [
                  {
                    value: "normal",
                    label: "默认"
                  },
                  {
                    value: "primary",
                    label: "主按钮"
                  },
                  {
                    value: "danger",
                    label: "危险按钮"
                  }
                ]
              },
              condition: {
                template: "${type} === 'button' || ${type} === 'dropdown'",
                params: [
                  {
                    field: "type",
                    data: {
                      source: "record",
                      field: "type"
                    }
                  }
                ]
              }
            },
            {
              field: "",
              label: "",
              type: "import_subform",
              interface: {
                url: "${configDomain}/common/TableOperationConfig.json",
                urlParams: [
                  {
                    field: "version",
                    data: {
                      source: "source",
                      field: "version"
                    }
                  },
                  {
                    field: "configDomain",
                    data: {
                      source: "source",
                      field: "configDomain"
                    }
                  }
                ],
                method: "GET",
                cache: {
                  global: "CCMS_CONFIG_common_TableOperationConfig"
                }
              }
            },
            {
              field: "modalWidthMode",
              label: "弹窗宽度限制方式",
              type: "select_single",
              mode: "button",
              defaultValue: {
                source: "static",
                value: "none"
              },
              options: {
                from: "manual",
                data: [
                  {
                    value: "none",
                    label: "不限制"
                  },
                  {
                    value: "percentage",
                    label: "百分比"
                  },
                  {
                    value: "pixel",
                    label: "像素值"
                  }
                ]
              },
              condition: {
                template: "${target} === 'current'",
                params: [
                  {
                    field: "target",
                    data: {
                      source: "record",
                      field: "handle.target"
                    }
                  }
                ]
              }
            },
            {
              field: "modalWidthValue",
              label: "弹窗宽度限制值",
              type: "text",
              condition: {
                template: "${target} === 'current' && ${modalWidthMode} !== 'none'",
                params: [
                  {
                    field: "target",
                    data: {
                      source: "record",
                      field: "handle.target"
                    }
                  },
                  {
                    field: "modalWidthMode",
                    data: {
                      source: "record",
                      field: "modalWidthMode"
                    }
                  }
                ]
              }
            }
          ],
          condition: {
            template: "${type} === 'group' || ${type} === 'dropdown'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        }
      ]
    },
    {
      field: "operations.rowOperations",
      label: "记录操作按钮",
      type: "form",
      primaryField: "label",
      canInsert: true,
      canRemove: true,
      canSort: true,
      canCollapse: true,
      fields: [
        {
          field: "label",
          label: "描述",
          type: "text"
        },
        {
          field: "type",
          label: "类型",
          type: "select_single",
          mode: "button",
          options: {
            from: "manual",
            data: [
              {
                value: "button",
                label: "按钮"
              },
              {
                value: "dropdown",
                label: "下拉按钮"
              }
            ]
          }
        },
        {
          field: "",
          label: "",
          type: "import_subform",
          interface: {
            url: "${configDomain}/common/TableOperationConfig.json",
            urlParams: [
              {
                field: "version",
                data: {
                  source: "source",
                  field: "version"
                }
              },
              {
                field: "configDomain",
                data: {
                  source: "source",
                  field: "configDomain"
                }
              }
            ],
            method: "GET",
            cache: {
              global: "CCMS_CONFIG_common_TableOperationConfig"
            }
          },
          condition: {
            template: "${type} === 'button'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        },
        {
          field: "modalWidthMode",
          label: "弹窗宽度限制方式",
          type: "select_single",
          mode: "button",
          defaultValue: {
            source: "static",
            value: "none"
          },
          options: {
            from: "manual",
            data: [
              {
                value: "none",
                label: "不限制"
              },
              {
                value: "percentage",
                label: "百分比"
              },
              {
                value: "pixel",
                label: "像素值"
              }
            ]
          },
          condition: {
            template: "${target} === 'current'",
            params: [
              {
                field: "target",
                data: {
                  source: "record",
                  field: "handle.target"
                }
              }
            ]
          }
        },
        {
          field: "modalWidthValue",
          label: "弹窗宽度限制值",
          type: "text",
          condition: {
            template: "${target} === 'current' && ${modalWidthMode} !== 'none'",
            params: [
              {
                field: "target",
                data: {
                  source: "record",
                  field: "handle.target"
                }
              },
              {
                field: "modalWidthMode",
                data: {
                  source: "record",
                  field: "modalWidthMode"
                }
              }
            ]
          }
        },
        {
          field: "operations",
          label: "子按钮",
          type: "form",
          primaryField: "label",
          canInsert: true,
          canRemove: true,
          canSort: true,
          canCollapse: true,
          fields: [
            {
              field: "label",
              label: "描述",
              type: "text"
            },
            {
              field: "level",
              label: "按钮级别",
              type: "select_single",
              mode: "button",
              options: {
                from: "manual",
                data: [
                  {
                    value: "normal",
                    label: "默认"
                  },
                  {
                    value: "primary",
                    label: "主按钮"
                  },
                  {
                    value: "danger",
                    label: "危险按钮"
                  }
                ]
              }
            },
            {
              field: "",
              label: "",
              type: "import_subform",
              interface: {
                url: "${configDomain}/common/TableOperationConfig.json",
                urlParams: [
                  {
                    field: "version",
                    data: {
                      source: "source",
                      field: "version"
                    }
                  },
                  {
                    field: "configDomain",
                    data: {
                      source: "source",
                      field: "configDomain"
                    }
                  }
                ],
                method: "GET",
                cache: {
                  global: "CCMS_CONFIG_common_TableOperationConfig"
                }
              }
            },
            {
              field: "modalWidthMode",
              label: "弹窗宽度限制方式",
              type: "select_single",
              mode: "button",
              defaultValue: {
                source: "static",
                value: "none"
              },
              options: {
                from: "manual",
                data: [
                  {
                    value: "none",
                    label: "不限制"
                  },
                  {
                    value: "percentage",
                    label: "百分比"
                  },
                  {
                    value: "pixel",
                    label: "像素值"
                  }
                ]
              },
              condition: {
                template: "${target} === 'current'",
                params: [
                  {
                    field: "target",
                    data: {
                      source: "record",
                      field: "handle.target"
                    }
                  }
                ]
              }
            },
            {
              field: "modalWidthValue",
              label: "弹窗宽度限制值",
              type: "text",
              condition: {
                template: "${target} === 'current' && ${modalWidthMode} !== 'none'",
                params: [
                  {
                    field: "target",
                    data: {
                      source: "record",
                      field: "handle.target"
                    }
                  },
                  {
                    field: "modalWidthMode",
                    data: {
                      source: "record",
                      field: "modalWidthMode"
                    }
                  }
                ]
              }
            }
          ],
          condition: {
            template: "${type} === 'dropdown'",
            params: [
              {
                field: "type",
                data: {
                  source: "record",
                  field: "type"
                }
              }
            ]
          }
        }
      ]
    },
    {
      field: "operations.multirowOperations",
      label: "多选操作按钮",
      type: "form",
      primaryField: "label",
      canInsert: true,
      canRemove: true,
      canSort: true,
      canCollapse: true,
      fields: []
    }
  ],
  defaultValue: {
    source: "data",
    field: ""
  },
  "actions": [],
  "rightTopActions": []
}

export const Template: TableConfig = {
  type: "table",
  width: "",
  field: "",
  label: "",
  columns: [
    {
      "label": "ID",
      "field": "id",
      "type": "text",
      "linkUrl": false,
      "align": "left"
    }
  ],
  "primary": "id",
  "rowOperationsPosition": "left"
}
