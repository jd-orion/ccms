import { FieldConfigs } from 'ccms/dist/src/components/formFields'

const config: FieldConfigs[] = [
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
  },
  {
    field: 'urlKey',
    type: 'text',
    label: '对象字段名'
  }
]

export default config
