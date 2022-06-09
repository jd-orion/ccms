import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'width',
    type: 'number',
    label: '宽度'
  },
  {
    field: 'height',
    type: 'number',
    label: '高度'
  },
  {
    field: '',
    label: '',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/detail/statement.json',
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
        global: 'CCMS_CONFIG_detail_statement'
      }
    },
    condition: {
      template: "${type} === 'iframe'",
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
