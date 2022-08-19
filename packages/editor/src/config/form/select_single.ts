import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: '',
    label: '展示配置',
    type: 'group',
    fields: [
      {
        field: 'mode',
        label: '展示形式',
        type: 'select_single',
        mode: 'button',
        options: {
          from: 'manual',
          data: [
            {
              value: 'dropdown',
              label: '下拉选框'
            },
            {
              value: 'radio',
              label: '单选框'
            },
            {
              value: 'button',
              label: '按钮组'
            }
          ]
        }
      },
      {
        field: 'placeholder',
        label: '占位符',
        type: 'text',
        condition: {
          template: "${mode} === 'dropdown'",
          params: [
            {
              field: 'mode',
              data: {
                source: 'record',
                field: 'mode'
              }
            }
          ]
        }
      },
      {
        field: 'canClear',
        label: '允许清除',
        type: 'switch',
        condition: {
          template: "${mode} === 'dropdown'",
          params: [
            {
              field: 'mode',
              data: {
                source: 'record',
                field: 'mode'
              }
            }
          ]
        }
      },
      {
        field: 'options',
        label: '选项',
        type: 'group',
        fields: [
          {
            field: '',
            label: '',
            type: 'import_subform',
            interface: {
              url: '${configDomain}/common/EnumerationConfig.json',
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
                global: 'CCMS_CONFIG_common_EnumerationConfig'
              }
            }
          }
        ]
      },
      {
        field: 'moreSubmit',
        label: '提交更多信息',
        type: 'group',
        fields: [
          {
            field: 'valueField',
            label: '值提交字段',
            type: 'text'
          },
          {
            field: 'labelField',
            label: '描述提交字段',
            type: 'text'
          }
        ]
      },
      {
        field: 'defaultSelect',
        label: '默认选中项',
        type: 'number',
        min: 0
      }
    ]
  }
]

export default config
