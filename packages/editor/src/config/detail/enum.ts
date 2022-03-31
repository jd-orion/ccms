import { FieldConfigs } from "ccms/dist/src/components/formFields";

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
          "url": "/ccms/config/${version}/${subversion}/common/EnumerationConfig.json",
          "urlParams": [
            {
              "field": "version",
              "data": {
                "source": "source",
                "field": "version"
              }
            },
            {
              "field": "subversion",
              "data": {
                "source": "source",
                "field": "subversion"
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
  },
]

export default config