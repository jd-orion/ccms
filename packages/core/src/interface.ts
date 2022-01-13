/**
 * 富文本内容配置合适定义
 * - type: 类型
 * - * plain: 纯文本
 * - * markdown: Markdown语法
 * - * html: HTML语法
 * - content: 内容
 */
export interface RichStringConfig {
  type: 'plain' | 'markdown' | 'html'
  content: string
}

export type ParamConfig = RecordParamConfig | DataParamConfig | StepParamConfig | SourceParamConfig | URLParamConfig | QueryParamConfig | HashParamConfig | InterfaceParamConfig | StaticParamConfig

interface RecordParamConfig {
  source: 'record'
  field: string
}

interface DataParamConfig {
  source: 'data'
  field: string
}

interface StepParamConfig {
  source: 'step'
  step: number
  field: string
}

interface SourceParamConfig {
  source: 'source',
  field: string
}

interface URLParamConfig {
  source: 'url',
  field: string
}
interface QueryParamConfig {
  source: 'query',
  filed: any
}
interface HashParamConfig {
  source: 'hash',
  filed: any
}
interface InterfaceParamConfig {
  source: 'interface',
  // api: {
  //   url: string,
  //   method: 'POST',
  //   contentType: 'json',
  //   withCredentials: true
  // },
  api: object,
  apiResponse: string
}
interface StaticParamConfig {
  source: 'static',
  value: any
}

/**
 * 表单/详情分栏配置定义
* - * type: 分栏类型
* - * - * span: 固定分栏
* - * - * width: 宽度分栏
* - * value: 分栏相关配置值
* - * wrap: 分栏后是否换行
* - * gap: 分栏边距
*/
export interface ColumnsConfig {
  enable?: boolean
  type?: 'span' | 'width'
  value?: number | string,
  wrap?: boolean
  gap?: number | string
  rowGap?: number | string
}
