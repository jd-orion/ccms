import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'url',
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
    }
  },
  {
    field: 'width',
    type: 'number',
    label: '宽度'
  },
  {
    field: 'height',
    type: 'number',
    label: '高度'
  }
]

export default config
