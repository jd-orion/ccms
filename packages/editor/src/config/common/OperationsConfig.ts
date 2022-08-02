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
    field: 'operations',
    label: '操作子项',
    type: 'form',
    primaryField: 'label',
    canInsert: true,
    canRemove: true,
    canSort: true,
    canCollapse: true,
    fields: [
      {
        field: '_operation_config',
        label: '_operation_config',
        type: 'text',
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
    ]
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
