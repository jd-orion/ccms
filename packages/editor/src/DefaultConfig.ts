import { CCMSConfig } from 'ccms/dist/src/main';






const DefaultConfig3 = {
  basic: {},
  steps: [
    {
      type: 'header',
    },
    {
      type: 'form',
      columns: {},
      fields: [
        {
          label: '菜单',
          field: 'menus',
          type: 'tree_select',
          treeData: {
            from: 'manual',
            data: [
              {
                title: '基础架构',
                value: 851,
                children: [
                  {
                    title: 'ccms1',
                    value: 900,
                  },
                  {
                    title: 'ccms2',
                    value: 901,
                    children: [
                      {
                        title: 'ccm1000',
                        value: 1000,
                      },
                    ],
                  },
                  {
                    title: 'ccms3',
                    value: 902,
                  },
                ],
              },
              {
                title: '基础架构2',
                value: 800,
                children: [
                  {
                    title: 'ccms8',
                    value: 801,
                  },
                ],
              },
            ],
          },
          mode: 'table',
          titleColumn: '菜单名称',
          multiple: {
            type: 'array',
          },
        },
        {
          label: 'multiselect',
          field: 'multiselect',
          type: 'select_multiple',
          mode: 'dropdown',
          multiple: {
            type: 'array',
          },
          options: {
            from: 'manual',
            data: [
              {
                label: '第一',
                value: 1,
              },
              {
                label: '第二',
                value: 2,
              },
            ],
          },
        },
      ],
      actions: [
        {
          type: 'submit',
          label: '提交',
          mode: 'primary',
        },
        {
          type: 'cancel',
          label: '取消',
          mode: 'normal',
        },
      ],
      applicationName: 'example',
      businessSuffix: '',
      version: '1.0.0',
      subversion: '0',
    },
    {
      type: 'fetch',
      interface: {
        url: 'www.jd.com',
        method: 'POST',
        withCredentials: true,
        condition: {
          enable: false,
          field: 'code',
          value: 1000,
          success: {
            type: 'modal',
            content: {
              type: 'static',
              content: '成功',
            },
          },
          fail: {
            type: 'modal',
            content: {
              type: 'field',
              field: 'msg',
            },
          },
        },
        cache: {
          disabled: true,
        },
        contentType: 'json',
      },
    },
  ],
  ui: 'antd',
};

const DefaultConfig = {
  "steps": [
    {
      "type": "header"
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
        },
        "cache": {
          "disabled": true
        }
      },
      "nextStep": false
    },
    {
      "type": "table",
      "field": "",
      "label": "",
      "description": {
        "type": "text"
      },
      "primary": "id",
      "rowOperationsPosition": "left",
      "columns": [
        {
          "label": "ID",
          "field": "id",
          "type": "text",
          "align": "left",
          "linkUrl": false
        }
      ],
      "operations": {
        "leftTableOperations": [
          {
            "label": "创建",
            "type": "button",
            "handle": {
              "type": "ccms",
              "page": 0,
              "target": "current"
            },
            "confirm": {
              "enable": false
            },
            "level": "primary"
          }
        ]
      }
    }
  ],
  "ui": "antd"
}
export default DefaultConfig;
