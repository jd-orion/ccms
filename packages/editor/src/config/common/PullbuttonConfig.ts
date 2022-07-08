import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    field: 'condition',
    label: '展示条件',
    type: 'import_subform',
    interface: {
      url: '${configDomain}/common/ConditionConfig.json',
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
        global: 'CCMS_CONFIG_common_ConditionConfig'
      }
    }
  }
]

export default config
