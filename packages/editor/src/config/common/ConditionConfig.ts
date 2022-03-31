import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "template",
    "label": "判断语句",
    "type": "text"
  },
  {
    "field": "params",
    "label": "参数",
    "type": "form",
    "primaryField": "field",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
        "field": "field",
        "label": "参数名",
        "type": "text"
      },
      {
        "field": "data",
        "label": "",
        "type": "import_subform",
        "interface": {
          "url": "/ccms/config/${version}/${subversion}/common/ParamConfig.json",
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
            "global": "CCMS_CONFIG_common_ParamConfig"
          }
        }
      }
    ]
  },
  {
    "field": "debug",
    "label": "开启调试",
    "type": "switch"
  }
]

export default config