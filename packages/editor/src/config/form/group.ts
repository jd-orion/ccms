import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "fields",
    "label": "子表单项",
    "type": "form",
    "primaryField": "label",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "label",
        "label": "字段描述",
        "type": "text"
      },
      {
        "field": "field",
        "label": "字段名",
        "type": "text"
      },
      {
        "field": "",
        "label": "",
        "type": "import_subform",
        "interface": {
          "url": "${configDomain}/form/index.json",
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
            "global": "CCMS_CONFIG_form"
          }
        }
      }
    ],
    "initialValues": {
      "field": "",
      "label": ""
    }
  }
]

export default config