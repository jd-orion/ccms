import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'type',
    label: '事件类型',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          value: 'ccms',
          label: '通用事件'
        },
        {
          value: 'form-table-update',
          label: '更新事件'
        },
        {
          value: 'form-table-remove',
          label: '删除事件'
        }
      ]
    }
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/OperationConfig.json',
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
        global: 'CCMS_CONFIG_common_OperationConfig'
      }
    },
    condition: {
      template: '${type} === "ccms"',
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
    field: 'fields',
    label: '更新表单项',
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
    },
    condition: {
      template: '${type} === "form-table-update"',
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

export default config
