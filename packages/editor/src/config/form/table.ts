import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'primary',
    label: '主键字段',
    type: 'text'
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
    field: 'operations',
    label: '表格操作',
    type: 'group',
    fields: [
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
            label: '_operation_config',
            type: 'text',
            defaultValue: {
              source: 'static',
              value: '/common/OperationConfig'
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
