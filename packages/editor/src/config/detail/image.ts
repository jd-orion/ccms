import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
  {
    label: '图片数量',
    field: 'imageType',
    type: 'select_single',
    mode: 'button',
    options: {
      from: 'manual',
      data: [
        {
          label: '单图',
          value: 'single'
        },
        {
          label: '多图',
          value: 'multiple'
        }
      ]
    },
    defaultValue: {
      source: 'static',
      value: 'single'
    }
  },
  {
    field: 'urlKey',
    type: 'text',
    label: '对象字段名',
    condition: {
      template: "${imageType} === 'multiple'",
      params: [
        {
          field: 'imageType',
          data: {
            source: 'record',
            field: 'imageType'
          }
        }
      ]
    }
  },
  {
    field: 'width',
    type: 'number',
    label: '图片宽度'
  },
  {
    field: 'height',
    type: 'number',
    label: '图片高度'
  },
  {
    field: 'preview',
    type: 'switch',
    label: '图片预览'
  }
]

export default config
