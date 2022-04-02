/*
 * @Author: zjt
 * @Date: 2022-02-22 16:21:54
 * @LastEditTime: 2022-02-24 10:22:09
 * @LastEditors: zjt
 * @Description: Do not edit
 */
import { FetchConfig } from "ccms/dist/src/steps/fetch";
import { FormConfig } from "ccms/dist/src/steps/form";

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
        "url": "https://cdn.jsdelivr.net/npm/ccms-editor@${version}/dist/config/common/InterfaceConfig.json",
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
          "global": "CCMS_CONFIG_common_InterfaceConfig"
        }
      }
    }
  ],
  "defaultValue": {
    "source": "data",
    "field": ""
  },
  "actions": []
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