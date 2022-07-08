// import { FieldConfigs } from "ccms/dist/src/components/formFields";
import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'type',
    label: '类型',
    type: 'hidden'
  },
  {
    field: 'width',
    label: '表格宽度',
    type: 'number'
  },
  {
    field: 'primary',
    label: '主键字段',
    type: 'text'
  },
  {
    field: 'tableColumns',
    label: '表格字段',
    type: 'form',
    primaryField: 'label',
    canInsert: true,
    canRemove: true,
    canSort: true,
    canCollapse: true,
    fields: [
      {
        field: 'label',
        label: '列描述',
        type: 'text'
      },
      {
        field: 'field',
        label: '列字段',
        type: 'text'
      },
      {
        field: 'type',
        type: 'select_single',
        mode: 'dropdown',
        canClear: true,
        options: {
          from: 'manual',
          data: [
            {
              value: 'text',
              label: '文本'
            },
            {
              value: 'multirowText',
              label: '多行文本'
            },
            {
              value: 'number',
              label: '数值'
            },
            {
              value: 'datetime',
              label: '日期时间'
            },
            {
              value: 'datetimeRange',
              label: '日期时间范围'
            },
            {
              value: 'Aenum',
              label: '选项'
            },
            {
              value: 'image',
              label: '图片'
            }
          ]
        },
        label: '列类型'
      },
      {
        field: 'align',
        label: '列对齐方式',
        type: 'select_single',
        mode: 'button',
        canClear: true,
        defaultValue: {
          source: 'static',
          value: 'left'
        },
        options: {
          from: 'manual',
          data: [
            {
              value: 'left',
              label: '左对齐'
            },
            {
              value: 'center',
              label: '居中'
            },
            {
              value: 'right',
              label: '右对齐'
            }
          ]
        }
      },
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/column/text.json',
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
            global: 'CCMS_CONFIG_column_text'
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
          url: '${configDomain}/column/datetime.json',
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
            global: 'CCMS_CONFIG_column_datetime'
          }
        },
        condition: {
          template: "${type} === 'datetime'",
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
          url: '${configDomain}/column/datetimeRange.json',
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
            global: 'CCMS_CONFIG_column_datetimeRange'
          }
        },
        condition: {
          template: "${type} === 'datetimeRange'",
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
          url: '${configDomain}/column/enum.json',
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
            global: 'CCMS_CONFIG_column_enum'
          }
        },
        condition: {
          template: "${type} === 'Aenum'",
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
          url: '${configDomain}/column/image.json',
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
            global: 'CCMS_CONFIG_column_image'
          }
        },
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
      }
    ],
    initialValues: {
      label: '',
      field: '',
      type: 'text'
    }
  },
  {
    field: 'pagination',
    label: '分页',
    type: 'group',
    fields: [
      {
        field: 'mode',
        label: '模式',
        type: 'select_single',
        mode: 'button',
        options: {
          from: 'manual',
          data: [
            {
              value: 'none',
              label: '无分页'
            },
            {
              value: 'server',
              label: '服务端分页'
            }
          ]
        }
      },
      {
        field: 'current',
        label: '当前页码入参',
        type: 'text',
        condition: {
          template: "${mode} === 'server'",
          params: [
            {
              field: 'mode',
              data: {
                source: 'record',
                field: 'mode'
              }
            }
          ]
        }
      },
      {
        field: 'pageSize',
        label: '每页条数入参',
        type: 'text',
        condition: {
          template: "${mode} === 'server'",
          params: [
            {
              field: 'mode',
              data: {
                source: 'record',
                field: 'mode'
              }
            }
          ]
        }
      },
      {
        field: 'total',
        label: '总条数出参',
        type: 'text',
        condition: {
          template: "${mode} === 'server'",
          params: [
            {
              field: 'mode',
              data: {
                source: 'record',
                field: 'mode'
              }
            }
          ]
        }
      }
    ]
  },
  {
    field: 'operations.rowOperations',
    label: '记录操作按钮',
    type: 'form',
    primaryField: 'label',
    canInsert: true,
    canRemove: true,
    canSort: true,
    canCollapse: true,
    fields: [
      {
        field: 'label',
        label: '描述',
        type: 'text'
      },
      {
        field: 'type',
        label: '类型',
        type: 'select_single',
        mode: 'button',
        options: {
          from: 'manual',
          data: [
            {
              value: 'button',
              label: '按钮'
            },
            {
              value: 'dropdown',
              label: '下拉按钮'
            }
          ]
        }
      },
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/common/TableOperationConfig.json',
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
            global: 'CCMS_CONFIG_common_TableOperationConfig'
          }
        },
        condition: {
          template: "${type} === 'button'",
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
          url: '${configDomain}/common/PullbuttonConfig.json',
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
            global: 'CCMS_CONFIG_common_PullbuttonConfig'
          }
        },
        condition: {
          template: "${type} === 'dropdown'",
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
        field: 'operations',
        label: '子按钮',
        type: 'form',
        primaryField: 'label',
        canInsert: true,
        canRemove: true,
        canSort: true,
        canCollapse: true,
        fields: [
          {
            field: 'label',
            label: '描述',
            type: 'text'
          },
          {
            field: 'level',
            label: '按钮级别',
            type: 'select_single',
            mode: 'button',
            options: {
              from: 'manual',
              data: [
                {
                  value: 'normal',
                  label: '默认'
                },
                {
                  value: 'primary',
                  label: '主按钮'
                },
                {
                  value: 'danger',
                  label: '危险按钮'
                }
              ]
            }
          },
          {
            field: '',
            label: '',
            type: 'import_subform',
            interface: {
              url: '${configDomain}/common/TableOperationConfig.json',
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
                global: 'CCMS_CONFIG_common_TableOperationConfig'
              }
            }
          }
        ],
        condition: {
          template: "${type} === 'dropdown'",
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
      }
    ]
  }
]
export default config
