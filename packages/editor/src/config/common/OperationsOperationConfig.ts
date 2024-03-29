import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'label',
    label: '文案',
    type: 'text'
  },
  {
    field: 'level',
    label: '展示风格',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          label: '默认',
          value: 'normal'
        },
        {
          label: '主要',
          value: 'primary'
        },
        {
          label: '危险',
          value: 'danger'
        }
      ]
    }
  },
  {
    field: 'handle',
    label: '事件',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/${operation_config}.json',
      urlParams: [
        {
          field: 'operation_config',
          data: {
            source: 'relative',
            relative: 0,
            field: '_operation_config'
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
      method: 'GET'
    }
  },
  {
    field: 'confirm',
    label: '二次确认',
    type: 'group',
    fields: [
      {
        field: 'enable',
        label: '启用',
        type: 'switch',
        defaultValue: {
          source: 'static',
          value: false
        }
      },
      {
        field: 'titleText',
        label: '确认文案',
        type: 'text',
        condition: {
          template: '${enable} === true',
          params: [
            {
              field: 'enable',
              data: {
                source: 'record',
                field: 'enable'
              }
            }
          ]
        }
      },
      {
        field: 'titleParams',
        label: '文案参数',
        type: 'form',
        primaryField: 'field',
        canInsert: true,
        canRemove: true,
        canSort: true,
        canCollapse: true,
        fields: [
          {
            field: 'field',
            label: '参数',
            type: 'text'
          },
          {
            field: 'data',
            label: '',
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
        condition: {
          template: '${enable} === true',
          params: [
            {
              field: 'enable',
              data: {
                source: 'record',
                field: 'enable'
              }
            }
          ]
        }
      },
      {
        field: 'okText',
        label: '确定按钮',
        type: 'text',
        condition: {
          template: '${enable} === true',
          params: [
            {
              field: 'enable',
              data: {
                source: 'record',
                field: 'enable'
              }
            }
          ]
        }
      },
      {
        field: 'cancelText',
        label: '取消按钮',
        type: 'text',
        condition: {
          template: '${enable} === true',
          params: [
            {
              field: 'enable',
              data: {
                source: 'record',
                field: 'enable'
              }
            }
          ]
        }
      }
    ]
  }
]

export default config
