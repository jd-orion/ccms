import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "mode",
    "label": "展示方式",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "same",
          "label": "各Tab相同"
        },
        {
          "value": "diff",
          "label": "各Tab不同"
        }
      ]
    }
  },
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
    },
    "condition": {
      "template": "${mode} === 'same'",
      "params": [
        {
          "field": "mode",
          "data": {
            "source": "record",
            "field": "mode"
          }
        }
      ]
    }
  },
  {
    "field": "tabs",
    "label": "Tabs",
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
      }
    ],
    "initialValues": {
      "field": "",
      "label": ""
    },
    "condition": {
      "template": "${mode} === 'same'",
      "params": [
        {
          "field": "mode",
          "data": {
            "source": "record",
            "field": "mode"
          }
        }
      ]
    }
  },
  {
    "field": "tabs",
    "label": "Tabs",
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
    ],
    "initialValues": {
      "field": "",
      "label": ""
    },
    "condition": {
      "template": "${mode} === 'diff'",
      "params": [
        {
          "field": "mode",
          "data": {
            "source": "record",
            "field": "mode"
          }
        }
      ]
    }
  }
]

export default config