import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "enable",
    "label": "启用",
    "type": "switch",
    "defaultValue": {
      "source": "static",
      "value": false
    },
    "required": true
  },
  {
    "field": "field",
    "label": "判断字段",
    "type": "text",
    "required": true,
    "condition": {
      "template": "${enable} === true",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        }
      ]
    }
  },
  {
    "field": "value",
    "label": "判断值",
    "type": "any",
    "condition": {
      "template": "${enable} === true",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        }
      ]
    }
  },
  {
    "field": "success.type",
    "label": "通过时",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "none",
          "label": "无操作"
        },
        {
          "value": "modal",
          "label": "弹窗"
        }
      ]
    },
    "condition": {
      "template": "${enable} === true",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        }
      ]
    }
  },
  {
    "field": "success.content.type",
    "label": "提示",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "static",
          "label": "固定文案"
        },
        {
          "value": "field",
          "label": "下发文案"
        }
      ]
    },
    "condition": {
      "template": "${enable} === true && ${modal} === 'modal'",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        },
        {
          "field": "modal",
          "data": {
            "source": "record",
            "field": "success.type"
          }
        }
      ]
    }
  },
  {
    "field": "success.content.content",
    "label": "文案内容",
    "type": "text",
    "condition": {
      "template": "${enable} === true && ${modal} === 'modal' && ${type} === 'static'",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        },
        {
          "field": "modal",
          "data": {
            "source": "record",
            "field": "success.type"
          }
        },
        {
          "field": "type",
          "data": {
            "source": "record",
            "field": "success.content.type"
          }
        }
      ]
    }
  },
  {
    "field": "success.content.field",
    "label": "下发字段",
    "type": "text",
    "condition": {
      "template": "${enable} === true && ${modal} === 'modal' && ${type} === 'field'",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        },
        {
          "field": "modal",
          "data": {
            "source": "record",
            "field": "success.type"
          }
        },
        {
          "field": "type",
          "data": {
            "source": "record",
            "field": "success.content.type"
          }
        }
      ]
    }
  },
  {
    "field": "fail.type",
    "label": "失败时",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "none",
          "label": "无操作"
        },
        {
          "value": "modal",
          "label": "弹窗"
        }
      ]
    },
    "condition": {
      "template": "${enable} === true",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        }
      ]
    }
  },
  {
    "field": "fail.content.type",
    "label": "提示",
    "type": "select_single",
    "mode": "button",
    "options": {
      "from": "manual",
      "data": [
        {
          "value": "static",
          "label": "固定文案"
        },
        {
          "value": "field",
          "label": "下发文案"
        }
      ]
    },
    "condition": {
      "template": "${enable} === true && ${modal} === 'modal'",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        },
        {
          "field": "modal",
          "data": {
            "source": "record",
            "field": "fail.type"
          }
        }
      ]
    }
  },
  {
    "field": "fail.content.content",
    "label": "文案内容",
    "type": "text",
    "condition": {
      "template": "${enable} === true && ${modal} === 'modal' && ${type} === 'static'",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        },
        {
          "field": "modal",
          "data": {
            "source": "record",
            "field": "fail.type"
          }
        },
        {
          "field": "type",
          "data": {
            "source": "record",
            "field": "fail.content.type"
          }
        }
      ]
    }
  },
  {
    "field": "fail.content.field",
    "label": "下发字段",
    "type": "text",
    "condition": {
      "template": "${enable} === true && ${modal} === 'modal' && ${type} === 'field'",
      "params": [
        {
          "field": "enable",
          "data": {
            "source": "record",
            "field": "enable"
          }
        },
        {
          "field": "modal",
          "data": {
            "source": "record",
            "field": "fail.type"
          }
        },
        {
          "field": "type",
          "data": {
            "source": "record",
            "field": "fail.content.type"
          }
        }
      ]
    }
  }
]

export default config
