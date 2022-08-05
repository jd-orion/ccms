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
          label: '通用'
        },
        {
          value: 'form-table-update',
          label: '更新'
        },
        {
          value: 'form-table-move',
          label: '移动'
        },
        {
          value: 'form-table-remove',
          label: '删除'
        },
        {
          value: false,
          label: '空'
        }
      ]
    },
    defaultValue: {
      source: 'static',
      value: false
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
  },
  {
    field: 'mode',
    label: '移动方式',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          value: 'up',
          label: '上移'
        },
        {
          value: 'down',
          label: '下移'
        },
        {
          value: 'top',
          label: '置顶'
        },
        {
          value: 'bottom',
          label: '置底'
        }
      ]
    },
    condition: {
      template: '${type} === "form-table-move"',
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
