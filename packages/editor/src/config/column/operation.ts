import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'actions',
    label: '按钮列表',
    type: 'form',
    primaryField: 'label',
    canInsert: true,
    canRemove: true,
    canSort: true,
    canCollapse: true,
    fields: [
      {
        field: 'type',
        label: '按钮类型',
        type: 'select_single',
        mode: 'button',
        options: {
          from: 'manual',
          data: [
            {
              value: 'button',
              label: '按钮'
            },
            {
              value: 'link',
              label: '链接'
            }
            // to do group(按钮组)、dropdown(下拉按钮)、dropLink(下拉链接)
          ]
        },
        defaultValue: {
          source: 'static',
          value: 'button'
        }
      },
      {
        field: 'level',
        label: '按钮级别',
        type: 'select_single',
        mode: 'button',
        defaultValue: {
          source: 'static',
          value: 'normal'
        },
        options: {
          from: 'manual',
          data: [
            {
              value: 'normal',
              label: '普通'
            },
            {
              value: 'primary',
              label: '主要'
            },
            {
              value: 'danger',
              label: '危险'
            }
          ]
        }
      },
      {
        field: 'label',
        label: '按钮文案',
        type: 'text'
      },
      {
        label: '',
        field: 'handle',
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
  }
]

export default config
