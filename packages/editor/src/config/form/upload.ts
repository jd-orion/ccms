import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "interface",
    "label": "接口配置",
    "type": "import_subform",
    "interface": {
      "url": "${configDomain}/common/InterfaceConfig.json",
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
        "global": "CCMS_CONFIG_common_InterfaceConfig"
      }
    }
  },
  {
    "field": "requireField",
    "label": "入参字段",
    "type": "text"
  },
  {
    "field": "responseField",
    "label": "出参字段",
    "type": "text"
  },
  {
    "field": "extraResponseField",
    "label": "拓展字段",
    "type": "form",
    "primaryField": "to",
    "canInsert": true,
    "canRemove": true,
    "canSort": true,
    "canCollapse": true,
    "fields": [
      {
      "field": "from",
      "label": "接口字段",
      "type": "text"
      },
      {
      "field": "to",
      "label": "目标字段",
      "type": "text"
      }
    ]
  },
  {
    "field": "mode",
    "label": "模式",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "file",
          "label": "文件上传"
        },
        {
          "value": "image",
          "label": "图片上传"
        }
      ]
    }
  },
  {
    "field": "imagePrefix",
    "label": "图片URL前缀",
    "type": "text",
    "condition": {
      "template": "${mode} === 'image'",
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
    "field": "sizeCheck",
    "label": "图片校验",
    "type": "group",
    "fields": [
      {
        "field": "width",
        "label": "宽度校验",
        "type": "number"
      },
      {
        "field": "height",
        "label": "高度校验",
        "type": "number"
      },
      {
        "field": "maxSize",
        "label": "大小校验",
        "type": "number"
      },
      {
        "field": "sizeUnit",
        "label": "大小单位",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "label": "B",
              "value": "B"
            },
            {
              "label": "KB",
              "value": "K"
            },
            {
              "label": "MB",
              "value": "M"
            },
            {
              "label": "GB",
              "value": "G"
            },
            {
              "label": "TB",
              "value": "T"
            }
          ]
        }
      }
    ],
    "condition": {
      "template": "${mode} === 'image'",
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
    "field": "sizeCheck",
    "label": "文件校验",
    "type": "group",
    "fields": [
      {
        "field": "maxSize",
        "label": "大小校验",
        "type": "number"
      },
      {
        "field": "sizeUnit",
        "label": "大小单位",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "label": "B",
              "value": "B"
            },
            {
              "label": "KB",
              "value": "K"
            },
            {
              "label": "MB",
              "value": "M"
            },
            {
              "label": "GB",
              "value": "G"
            },
            {
              "label": "TB",
              "value": "T"
            }
          ]
        }
      }
    ],
    "condition": {
      "template": "${mode} === 'file'",
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