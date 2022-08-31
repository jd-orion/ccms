import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "options",
    "label": "选项",
    "type": "group",
    "fields": [
      {
        "field": "",
        "label": "",
        "type": "import_subform",
        "interface": {
          "url": "${configDomain}/common/EnumerationConfig.json",
          "urlParams": [
            {
              "field": "version",
              "data": {
                "source": "source",
                "field": "version"
              }
            },
            {
              "field": "configDomain",
              "data": {
                "source": "source",
                "field": "configDomain"
              }
            }
          ],
          "method": 'GET',
          "cache": {
            "global": "CCMS_CONFIG_common_EnumerationConfig"
          }
        }
      }
    ]
  }
]

export default config