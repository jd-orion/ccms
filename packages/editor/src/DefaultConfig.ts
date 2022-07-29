import { CCMSConfig } from 'ccms/dist/src/main'

const DefaultConfig: CCMSConfig = {
  steps: [
    {
      type: 'fetch',
      interface: {
        url: 'http://japi.jd.com/mock/491/ccms/CCMS/demo/list',
        method: 'GET',
        withCredentials: true,
        condition: {
          enable: false,
          field: 'code',
          value: 0,
          success: {
            type: 'none'
          },
          fail: {
            type: 'modal',
            content: {
              type: 'field',
              field: 'msg'
            }
          }
        }
      }
    },
    { type: 'header' },
    {
      type: 'form',
      fields: [
        {
          label: '子表格',
          field: 'data',
          type: 'table',
          primary: 'id',
          tableColumns: [
            {
              label: 'ID',
              field: 'id',
              type: 'text'
            },
            {
              label: '状态',
              field: 'status',
              type: 'select_single',
              options: {
                from: 'manual',
                data: [
                  {
                    label: 'A',
                    value: 0
                  },
                  {
                    label: 'B',
                    value: 1
                  }
                ]
              }
            }
          ],
          operations: {
            rowOperations: [
              {
                type: 'group',
                mode: 'link',
                operations: [
                  {
                    label: 'A',
                    level: 'primary',
                    handle: {
                      type: 'ccms',
                      mode: 'popup',
                      page: 621,
                      label: 'a',
                      data: {}
                    }
                  },
                  {
                    label: 'B',
                    level: 'danger',
                    handle: {
                      type: 'ccms',
                      mode: 'popup',
                      page: 621,
                      label: 'a',
                      data: {}
                    }
                  }
                ]
              },
              {
                type: 'node',
                mode: 'link',
                label: 'C',
                level: 'normal',
                handle: {
                  type: 'ccms',
                  mode: 'popup',
                  page: 621,
                  label: 'a',
                  data: {}
                }
              }
            ]
          }
        },
        {
          label: '单项框',
          field: 'radio',
          type: 'select_single',
          mode: 'radio',
          options: {
            from: 'manual',
            data: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              }
            ]
          },
          required: true
        }
      ],
      actions: [
        {
          type: 'submit',
          label: '提交',
          mode: 'primary',
          submitValidate: false
        },
        {
          type: 'cancel',
          label: '取消',
          mode: 'normal',
          submitValidate: false
        }
      ],
      rightTopActions: [],
      defaultValue: {
        source: 'step',
        step: 1,
        field: ''
      }
    },
    {
      type: 'fetch',
      interface: {
        url: '',
        method: 'GET',
        withCredentials: true,
        condition: {
          enable: false,
          field: 'code',
          value: 1000,
          success: {
            type: 'modal',
            content: {
              type: 'static',
              content: '成功'
            }
          },
          fail: {
            type: 'modal',
            content: {
              type: 'field',
              field: 'msg'
            }
          }
        }
      },
      nextStep: false
    }
  ]
}

export default DefaultConfig
