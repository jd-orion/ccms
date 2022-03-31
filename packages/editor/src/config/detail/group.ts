import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [{
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
      "type": "text",
      "defaultValue": {
        "source": "static",
        "value": ""
      }
    },
    {
      "field": "",
      "label": "",
      "type": "import_subform",
      "interface": {
        "url": "/ccms/config/${version}/${subversion}/detail/index.json",
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
          "global": "CCMS_CONFIG_detail"
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