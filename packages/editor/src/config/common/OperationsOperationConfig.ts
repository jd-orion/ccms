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
  }
]

export default config
