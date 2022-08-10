import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'from',
    label: '数据来源',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          value: 'manual',
          label: '手动配置'
        },
        {
          value: 'interface',
          label: '接口下发'
        },
        {
          value: 'data',
          label: '已有数据'
        }
      ]
    }
  },
  {
    field: 'data',
    label: '选项数据',
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
        field: 'value',
        label: '值',
        type: 'any'
      },
      {
        field: 'extra',
        label: '其他',
        type: 'form',
        primaryField: 'field',
        canInsert: true,
        canRemove: true,
        canCollapse: true,
        fields: [
          {
            field: 'field',
            label: '字段名',
            type: 'text'
          },
          {
            field: 'value',
            label: '值',
            type: 'any'
          }
        ]
      }
    ],
    condition: {
      template: "${from} === 'manual'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        }
      ]
    }
  },
  {
    field: 'interface',
    label: '接口配置',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/InterfaceConfig.json',
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
        global: 'CCMS_CONFIG_common_InterfaceConfig'
      }
    },
    condition: {
      template: "${from} === 'interface'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        }
      ]
    }
  },
  {
    field: 'sourceConfig',
    label: '选项数据',
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
    },
    condition: {
      template: "${from} === 'data'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        }
      ]
    }
  },
  {
    field: 'format.type',
    label: '数据格式',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          value: 'kv',
          label: '名值对'
        },
        {
          value: 'list',
          label: '列表'
        }
      ]
    },
    condition: {
      template: "${from} === 'interface' || ${from} === 'data'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        }
      ]
    }
  },
  {
    field: 'format.keyField',
    label: '取值字段',
    type: 'text',
    condition: {
      template: "(${from} === 'data' || ${from} === 'interface') && ${type} === 'list'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        },
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'format.type'
          }
        }
      ]
    }
  },
  {
    field: 'format.labelField',
    label: '描述字段',
    type: 'text',
    condition: {
      template: "(${from} === 'data' || ${from} === 'interface') && ${type} === 'list'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        },
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'format.type'
          }
        }
      ]
    }
  },
  {
    field: 'format.extra',
    label: '其他字段',
    type: 'form',
    primaryField: 'targetField',
    canInsert: true,
    canRemove: true,
    canCollapse: true,
    fields: [
      {
        field: 'sourceField',
        label: '来源',
        type: 'text'
      },
      {
        field: 'targetField',
        label: '目标',
        type: 'text'
      }
    ],
    condition: {
      template: "(${from} === 'data' || ${from} === 'interface') && ${type} === 'list'",
      params: [
        {
          field: 'from',
          data: {
            source: 'record',
            field: 'from'
          }
        },
        {
          field: 'type',
          data: {
            source: 'record',
            field: 'format.type'
          }
        }
      ]
    }
  }
]

export default config
