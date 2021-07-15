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

/**
 *
 */
export interface APIConfig {
  url: string
  method: 'GET' | 'POST'
  contentType?: 'json' | 'form-data'
  /** 拼接URL 例：jd.com/url/{id} */
  concatUrl?: Array<string>
  /** 将参数配置为全局数据 */
  globalInterface?: string
  withCredentials?: boolean
}

/**
 *
 */
export interface APIResponseConfig {
  response: string
  format?: 'array' | 'key'
  responseArrayKey?: string
  responseArrayValue?: string
}

/**
 *
 */
export interface APIConditionConfig {
  enable: true,
  field: string,
  value: any,
  success: {
    type: 'none' | 'modal',
    content?: {
      type: 'static' | 'field',
      content?: string,
      field?: string
    }
  },
  fail: {
    type: 'none' | 'modal',
    content?: {
      type: 'static' | 'field',
      content?: string,
      field?: string
    }
  }
}

export type ParamConfig = RecordParamConfig | DataParamConfig | StepParamConfig | SourceParamConfig | URLParamConfig | StaticParamConfig

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

interface StaticParamConfig {
  source: 'static'
  field: string
  value: string
}
