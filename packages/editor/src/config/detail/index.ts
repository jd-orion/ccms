import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'type',
    label: '字段类型',
    type: 'select_single',
    mode: 'dropdown',
    canClear: true,
    options: {
      from: 'manual',
      data: [
        {
          value: 'text',
          label: '短文本'
        },
        {
          value: 'link',
          label: '链接'
        },
        {
          value: 'group',
          label: '群组'
        },
        {
          value: 'statement',
          label: '模板字符串'
        },
        {
          value: 'detail_enum',
          label: '选项枚举值'
        },
        {
          value: 'import_subform',
          label: '动态加载子表单'
        },
        {
          value: 'detail_info',
          label: '详情信息'
        },
        {
          value: 'detail_color',
          label: '颜色详情'
        },
        {
          value: 'image',
          label: '图片'
        },
        {
          value: 'custom',
          label: '自定义组件'
        },
        {
          value: 'table',
          label: '表格'
        },
        {
          value: 'iframe',
          label: 'iframe嵌入'
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/import_subform.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_import_subform'
      }
    },
    condition: {
      template: "${type} === 'import_subform'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  // {
  //   "field": "defaultValue",
  //   "label": "默认值",
  //   "type": "text"
  // },
  {
    field: 'columns.enable',
    label: '分栏配置',
    type: 'switch'
  },
  {
    field: 'columns',
    label: '分栏配置',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/ColumnsConfig.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_common_ColumnsConfig'
      }
    },
    condition: {
      template: '${enable} === true',
      params: [
        {
          field: 'enable',
          data: {
            source: 'record',
            field: 'columns.enable'
          }
        }
      ]
    }
  },
  {
    field: 'columns.gap',
    label: '分栏边距',
    type: 'number',
    defaultValue: {
      source: 'static',
      value: 32
    },
    condition: {
      template: '${enable} === true',
      params: [
        {
          field: 'enable',
          data: {
            source: 'record',
            field: 'columns.enable'
          }
        }
      ]
    }
  },
  {
    field: 'columns.rowGap',
    label: '分栏下边距',
    type: 'number',
    defaultValue: {
      source: 'static',
      value: 0
    },
    condition: {
      template: '${enable} === true',
      params: [
        {
          field: 'enable',
          data: {
            source: 'record',
            field: 'columns.enable'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: 'iframe组件特定参数',
    type: 'group',
    fields: [
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/detail/iframe.json',
          urlParams: [
            {
              field: 'version',
              data: {
                source: 'source',
                field: 'version'
              }
            },
            {
              field: 'configDomain',
              data: {
                source: 'source',
                field: 'configDomain'
              }
            }
          ],
          method: 'GET',
          cache: {
            global: 'CCMS_CONFIG_detail_iframe'
          }
        }
      }
    ],
    condition: {
      template: "${type} === 'iframe'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '图片特定参数',
    type: 'group',
    fields: [
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/detail/image.json',
          urlParams: [
            {
              field: 'version',
              data: {
                source: 'source',
                field: 'version'
              }
            },
            {
              field: 'configDomain',
              data: {
                source: 'source',
                field: 'configDomain'
              }
            }
          ],
          method: 'GET',
          cache: {
            global: 'CCMS_CONFIG_detail_image'
          }
        }
      }
    ],
    condition: {
      template: "${type} === 'image'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '链接特定参数',
    type: 'group',
    fields: [
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/detail/link.json',
          urlParams: [
            {
              field: 'version',
              data: {
                source: 'source',
                field: 'version'
              }
            },
            {
              field: 'configDomain',
              data: {
                source: 'source',
                field: 'configDomain'
              }
            }
          ],
          method: 'GET',
          cache: {
            global: 'CCMS_CONFIG_detail_link'
          }
        }
      }
    ],
    condition: {
      template: "${type} === 'link'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: 'description',
    label: '详情信息',
    type: 'group',
    condition: {
      template: "${type} === 'detail_info'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    },
    fields: [
      {
        field: 'descType',
        label: '描述类型',
        type: 'select_single',
        mode: 'dropdown',
        defaultValue: {
          source: 'static',
          value: 'text'
        },
        options: {
          from: 'manual',
          data: [
            {
              value: 'text',
              label: '仅描述文案'
            },
            {
              value: 'tooltip',
              label: '文案及气泡弹层'
            },
            {
              value: 'modal',
              label: '文案及详情弹窗'
            }
          ]
        }
      },
      {
        label: '描述内容',
        field: 'label',
        type: 'group',
        fields: [
          {
            label: '文案',
            field: 'statement',
            type: 'text'
          },
          {
            label: '参数',
            field: 'params',
            type: 'form',
            primaryField: 'field',
            fields: [
              {
                label: '字段名',
                field: 'field',
                type: 'text'
              },
              {
                label: '数据来源',
                field: 'data',
                type: 'import_subform',
                interface: {
                  url: '${configDomain}/common/ParamConfig.json',
                  urlParams: [
                    {
                      field: 'version',
                      data: {
                        source: 'source',
                        field: 'version'
                      }
                    },
                    {
                      field: 'configDomain',
                      data: {
                        source: 'source',
                        field: 'configDomain'
                      }
                    }
                  ],
                  method: 'GET',
                  cache: {
                    global: 'CCMS_CONFIG_common_ParamConfig'
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
        field: 'mode',
        label: '详情类型',
        type: 'select_single',
        mode: 'button',
        condition: {
          template: "${descType} !== 'text'",
          params: [
            {
              field: 'descType',
              data: {
                source: 'record',
                field: 'descType'
              }
            }
          ]
        },
        defaultValue: {
          source: 'static',
          value: 'plain'
        },
        options: {
          from: 'manual',
          data: [
            {
              value: 'plain',
              label: '纯文本'
            },
            {
              value: 'markdown',
              label: 'Markdown'
            },
            {
              value: 'html',
              label: 'HTML'
            }
          ]
        }
      },
      {
        label: '详情内容',
        field: 'content',
        type: 'group',
        condition: {
          template: "${descType} !== 'text'",
          params: [
            {
              field: 'descType',
              data: {
                source: 'record',
                field: 'descType'
              }
            }
          ]
        },
        fields: [
          {
            label: '文案',
            field: 'statement',
            type: 'text'
          },
          {
            label: '参数',
            field: 'params',
            type: 'form',
            primaryField: 'field',
            fields: [
              {
                label: '字段名',
                field: 'field',
                type: 'text'
              },
              {
                label: '数据来源',
                field: 'data',
                type: 'import_subform',
                interface: {
                  url: '${configDomain}/common/ParamConfig.json',
                  urlParams: [
                    {
                      field: 'version',
                      data: {
                        source: 'source',
                        field: 'version'
                      }
                    },
                    {
                      field: 'configDomain',
                      data: {
                        source: 'source',
                        field: 'configDomain'
                      }
                    }
                  ],
                  method: 'GET',
                  cache: {
                    global: 'CCMS_CONFIG_common_ParamConfig'
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
        field: 'showIcon',
        label: '描述icon',
        type: 'switch'
      }
    ]
  },
  // // 颜色详情项
  // {
  //   "field": "typeColor",
  //   "label": "颜色详情",
  //   "type": "text",
  //   "condition": {
  //     "template": "${type} === 'detail_color'",
  //     "params": [
  //       {
  //         "field": "type",
  //         "data": {
  //           "source": "record",
  //           "field": "type"
  //         }
  //       }
  //     ]
  //   },
  // },
  {
    field: 'childColumns',
    label: '子项分栏',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/ColumnsConfig.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_common_ColumnsConfig'
      }
    },
    condition: {
      template: "${enable} === true && (${type} === 'group' || ${type} === 'import_subform')",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        },
        {
          field: 'enable',
          data: {
            source: 'record',
            field: 'columns.enable'
          }
        }
      ]
    }
  },
  {
    field: 'columns.gap',
    label: '分栏边距',
    type: 'number',
    defaultValue: {
      source: 'static',
      value: 0
    },
    condition: {
      template: '${enable} === true',
      params: [
        {
          field: 'enable',
          data: {
            source: 'record',
            field: 'columns.enable'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/text.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_text'
      }
    },
    condition: {
      template: "${type} === 'text'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/group.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_group'
      }
    },
    condition: {
      template: "${type} === 'group'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: 'statement',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/statement.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_statement'
      }
    },
    condition: {
      template: "${type} === 'statement'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/enum.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_enum'
      }
    },
    condition: {
      template: "${type} === 'detail_enum'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: 'defaultValue',
    label: '默认值',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/ParamConfig.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_common_ParamConfig'
      }
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/custom.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_custom'
      }
    },
    condition: {
      template: "${type} === 'custom'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/table.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_detail_table'
      }
    },
    condition: {
      template: "${type} === 'table'",
      params: [
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'type'
          }
        }
      ]
    }
  },
  {
    field: '',
    label: '其他配置',
    type: 'group',
    fields: [
      {
        field: 'condition',
        label: '展示条件',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/common/ConditionConfig.json',
          urlParams: [
            {
              field: 'version',
              data: {
                source: 'source',
                field: 'version'
              }
            },
            {
              field: 'configDomain',
              data: {
                source: 'source',
                field: 'configDomain'
              }
            }
          ],
          method: 'GET',
          cache: {
            global: 'CCMS_CONFIG_common_ConditionConfig'
          }
        }
      }
    ]
  },
  {
    field: 'styles',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/StyleConfig.json',
      urlParams: [
        {
          field: 'version',
          data: {
            source: 'source',
            field: 'version'
          }
        },
        {
          field: 'configDomain',
          data: {
            source: 'source',
            field: 'configDomain'
          }
        }
      ],
      method: 'GET',
      cache: {
        global: 'CCMS_CONFIG_common_style'
      }
    }
  }
]

export default config
