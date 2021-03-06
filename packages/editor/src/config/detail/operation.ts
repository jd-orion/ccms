import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'type',
    label: '操作类型',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          value: 'link',
          label: '链接'
        },
        {
          value: 'button',
          label: '按钮'
        }
      ]
    }
  },
  {
    field: 'label',
    label: '名称',
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
    field: 'handle',
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
    }
  }
]

export default config
