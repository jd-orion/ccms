import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'primary',
    label: '主键字段',
    type: 'text'
  },
  {
    field: 'tableSort',
    label: '拖动排序',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          value: true,
          label: '开启'
        },
        {
          value: false,
          label: '关闭'
        }
      ]
    },
    defaultValue: {
      source: 'static',
      value: false
    }
  },
  {
    field: 'tableColumns',
    label: '表格列',
    type: 'form',
    primaryField: 'label',
    canInsert: true,
    canRemove: true,
    canSort: true,
    canCollapse: true,
    fields: [
      {
        field: 'label',
        label: '字段描述',
        type: 'text'
      },
      {
        field: 'field',
        label: '字段名',
        type: 'text'
      },
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/form/index.json',
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
            global: 'CCMS_CONFIG_form'
          }
        }
      }
    ],
    initialValues: {
      field: '',
      label: ''
    }
  },
  {
    field: 'tableExpand',
    label: '表格展开内容',
    type: 'form',
    canInsert: true,
    canRemove: true,
    canSort: true,
    canCollapse: true,
    primaryField: '_index',
    fields: [
      {
        field: 'fields',
        label: '内容',
        type: 'form',
        primaryField: 'field',
        canInsert: true,
        canRemove: true,
        canSort: true,
        canCollapse: true,
        fields: [
          {
            field: 'label',
            label: '字段描述',
            type: 'text'
          },
          {
            field: 'field',
            label: '字段名',
            type: 'text'
          },
          {
            field: '',
            label: '',
            type: 'import_subform',
            interface: {
              url: '${configDomain}/form/index.json',
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
                global: 'CCMS_CONFIG_form'
              }
            }
          }
        ]
      },
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
    field: 'operations',
    label: '表格操作',
    type: 'group',
    fields: [
      {
        field: 'tableOperations',
        label: '表格级操作',
        type: 'group',
        fields: [
          {
            field: 'topLeft',
            label: '顶部左侧',
            type: 'form',
            primaryField: 'label',
            canInsert: true,
            canRemove: true,
            canSort: true,
            canCollapse: true,
            fields: [
              {
                field: '_operation_config',
                label: '',
                type: 'hidden',
                defaultValue: {
                  source: 'static',
                  value: '/form/tableTableOperation'
                }
              },
              {
                field: '',
                label: '',
                type: 'import_subform',
                interface: {
                  url: '${configDomain}/common/OperationsConfig.json',
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
                    global: 'CCMS_CONFIG_common_OperationsConfig'
                  }
                }
              }
            ]
          },
          {
            field: 'topRight',
            label: '顶部右侧',
            type: 'form',
            primaryField: 'label',
            canInsert: true,
            canRemove: true,
            canSort: true,
            canCollapse: true,
            fields: [
              {
                field: '_operation_config',
                label: '',
                type: 'hidden',
                defaultValue: {
                  source: 'static',
                  value: '/form/tableTableOperation'
                }
              },
              {
                field: '',
                label: '',
                type: 'import_subform',
                interface: {
                  url: '${configDomain}/common/OperationsConfig.json',
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
                    global: 'CCMS_CONFIG_common_OperationsConfig'
                  }
                }
              }
            ]
          },
          {
            field: 'bottomLeft',
            label: '底部左侧',
            type: 'form',
            primaryField: 'label',
            canInsert: true,
            canRemove: true,
            canSort: true,
            canCollapse: true,
            fields: [
              {
                field: '_operation_config',
                label: '',
                type: 'hidden',
                defaultValue: {
                  source: 'static',
                  value: '/form/tableTableOperation'
                }
              },
              {
                field: '',
                label: '',
                type: 'import_subform',
                interface: {
                  url: '${configDomain}/common/OperationsConfig.json',
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
                    global: 'CCMS_CONFIG_common_OperationsConfig'
                  }
                }
              }
            ]
          },
          {
            field: 'bottomRight',
            label: '底部右侧',
            type: 'form',
            primaryField: 'label',
            canInsert: true,
            canRemove: true,
            canSort: true,
            canCollapse: true,
            fields: [
              {
                field: '_operation_config',
                label: '',
                type: 'hidden',
                defaultValue: {
                  source: 'static',
                  value: '/form/tableTableOperation'
                }
              },
              {
                field: '',
                label: '',
                type: 'import_subform',
                interface: {
                  url: '${configDomain}/common/OperationsConfig.json',
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
                    global: 'CCMS_CONFIG_common_OperationsConfig'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        field: 'rowOperations',
        label: '记录内操作',
        type: 'form',
        primaryField: 'label',
        canInsert: true,
        canRemove: true,
        canSort: true,
        canCollapse: true,
        fields: [
          {
            field: '_operation_config',
            label: '',
            type: 'hidden',
            defaultValue: {
              source: 'static',
              value: '/form/tableRowOperation'
            }
          },
          {
            field: '',
            label: '',
            type: 'import_subform',
            interface: {
              url: '${configDomain}/common/OperationsConfig.json',
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
                global: 'CCMS_CONFIG_common_OperationsConfig'
              }
            }
          }
        ]
      }
    ]
  }
]

export default config
