import { CCMSConfig } from 'ccms/dist/src/main';








const DefaultConfig = {
  "steps": [
    {
      "type": "header"
    },
    {
      "type": "form",
      "columns": {},
      "fields": [
        {
          "label": "a",
          "field": "a",
          "type": "select_single",
          "mode": "radio",
          "options": {
            "from": "manual",
            "data": [
              {
                "label": "a",
                "value": true
              },
              {
                "label": "a",
                "value": "2"
              }
            ]
          }
        }
      ],
      "actions": [
        {
          "type": "submit",
          "label": "提交",
          "mode": "primary",
          "submitValidate": false
        },
        {
          "type": "cancel",
          "label": "取消",
          "mode": "normal",
          "submitValidate": false
        }
      ],
      "applicationName": "example",
      "businessSuffix": "",
      "version": "0.0.4-beta.20",
      "subversion": "0",
      "configDomain": "https://cdn.jsdelivr.net/npm/ccms-editor@0.0.4-beta.20/dist/config"
    },
    {
      "type": "fetch",
      "interface": {
        "url": "",
        "method": "GET",
        "withCredentials": true,
        "condition": {
          "enable": false,
          "field": "code",
          "value": 1000,
          "success": {
            "type": "modal",
            "content": {
              "type": "static",
              "content": "成功"
            }
          },
          "fail": {
            "type": "modal",
            "content": {
              "type": "field",
              "field": "msg"
            }
          }
        }
      },
      "nextStep": false
    }
  ],
  "ui": "antd"
}
export default DefaultConfig;
