import { FetchConfig } from "ccms/dist/steps/fetch";
import { FormConfig } from "ccms/dist/steps/form";

export const Config: FormConfig = {
  "type": "form",
  "fields": [
    {
      "field": "type",
      "label": "类型",
      "type": "hidden",
      "defaultValue": {
        "source": "static",
        "value": "fetch"
      }
    },
    {
      "field": "interface",
      "label": "",
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
    }
  ],
  "defaultValue": {
    "source": "data",
    "field": ""
  },
  "actions": [],
  "rightTopActions": []
}

export const Template: FetchConfig = {
  "type": 'fetch',
  "interface": {
    "url": "",
    "method": "GET",
    "withCredentials": true,
    "condition": {
      "enable": false,
      "field": "code",
      "value": 1000,
      "success": {
        "type": 'modal',
        "content": {
          "type": 'static',
          "content": '成功'
        }
      },
      "fail": {
        "type": 'modal',
        "content": {
          "type": 'field',
          "field": 'msg'
        }
      }
    }
  },
  "nextStep": false
}