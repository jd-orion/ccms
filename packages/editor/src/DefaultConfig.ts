import { CCMSConfig } from 'ccms/dist/main'

const DefaultConfig: CCMSConfig = {
  steps: [
    {
      type: 'header',
      title: {
        statement: 'TITLE',
        params: []
      }
    },
    {
      type: 'form',
      fields: [
        {
          label: '文本框',
          field: 'text',
          type: 'text'
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
        source: 'data',
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
