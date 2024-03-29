import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'type',
    label: '类型',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          label: '独立操作',
          value: 'node'
        },
        {
          label: '群组操作',
          value: 'group'
        },
        {
          label: '下拉操作',
          value: 'dropdown'
        }
      ]
    }
  },
  {
    field: 'mode',
    label: '展示形式',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          label: '按钮',
          value: 'button'
        },
        {
          label: '链接',
          value: 'link'
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/OperationsOperationConfig.json',
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
        global: 'CCMS_CONFIG_common_OperationsOperationConfig'
      }
    },
    condition: {
      debug: true,
      template: '${type} === "node"',
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
    field: 'operation',
    label: '主操作项',
    type: 'group',
    fields: [
      {
        field: '_operation_config',
        label: '',
        type: 'hidden',
        defaultValue: {
          source: 'relative',
          relative: 1,
          field: '_operation_config'
        }
      },
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/common/OperationsOperationConfig.json',
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
            global: 'CCMS_CONFIG_common_OperationsOperationConfig'
          }
        }
      }
    ],
    condition: {
      debug: true,
      template: '${type} === "dropdown"',
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
    label: '子操作项',
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
          source: 'relative',
          relative: 2,
          field: '_operation_config'
        }
      },
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '${configDomain}/common/OperationsOperationConfig.json',
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
            global: 'CCMS_CONFIG_common_OperationsOperationConfig'
          }
        }
      }
    ],
    condition: {
      template: '${type} === "group" || ${type} === "dropdown"',
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
    field: 'condition',
    label: '校验条件',
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

export default config
