// import { isEqual, cloneDeep, template, get, set, merge } from "lodash"
import { isEqual, template, get, merge } from 'lodash'
import axios, { AxiosRequestConfig } from 'axios'
import { set } from './produce'
import { ParamConfig } from '../interface'
import ParamHelper from './param'
import { getValue } from './value'
import { Field } from '../components/formFields/common'

export interface InterfaceConfig {
  domain?: string
  url?: string
  urlParams?: { field: string; data: ParamConfig }[]

  method?: 'GET' | 'POST'
  contentType?: 'json' | 'form-data'
  withCredentials?: boolean

  params?: { field: string; data: ParamConfig }[]
  data?: { field: string; data: ParamConfig }[]

  condition?: {
    enable?: boolean
    field?: string
    value?: unknown
    success?:
      | { type: 'none' }
      | { type: 'modal'; content?: { type: 'static'; content?: string } | { type: 'field'; field?: string } }
    fail?:
      | { type: 'none' }
      | { type: 'modal'; content?: { type: 'static'; content?: string } | { type: 'field'; field?: string } }
  }

  response?:
    | {
        root?: string
      }
    | { field?: string; path?: string }[]

  cache?: {
    global?: string
    disabled?: boolean
  }
}

export interface IRenderSuccessModal {
  message: string
}

export interface IRenderFailModal {
  message: string
}

export default class InterfaceHelper {
  public static cacheResolve: { [key: string]: ((value: unknown) => void)[] } = {}

  public static cache: { [key: string]: unknown } = {}

  private _config: InterfaceConfig = {}

  private _url = ''

  private _params: object = {}

  private _data: object = {}

  private _response: unknown

  protected renderSuccessModal: (props: IRenderSuccessModal) => Promise<void> = () => {
    return new Promise((resolve) => {
      const mask = document.createElement('DIV')
      mask.style.position = 'fixed'
      mask.style.left = '0px'
      mask.style.top = '0px'
      mask.style.width = '100%'
      mask.style.height = '100%'
      mask.style.backgroundColor = 'white'
      mask.innerText = '您当前使用的UI版本没有实现Fetch的SuccessModal组件。'
      mask.onclick = () => {
        mask.remove()
        resolve()
      }

      document.body.appendChild(mask)
    })
  }

  protected renderFailModal: (props: IRenderFailModal) => Promise<void> = () => {
    return new Promise((resolve) => {
      const mask = document.createElement('DIV')
      mask.style.position = 'fixed'
      mask.style.left = '0px'
      mask.style.top = '0px'
      mask.style.width = '100%'
      mask.style.height = '100%'
      mask.style.backgroundColor = 'white'
      mask.innerText = '您当前使用的UI版本没有实现Fetch的SuccessModal组件。'
      mask.onclick = () => {
        mask.remove()
        resolve()
      }

      document.body.appendChild(mask)
    })
  }

  public request(
    config: InterfaceConfig,
    source: { [key: string]: unknown },
    datas: {
      record?: object
      data: object[]
      step: { [field: string]: unknown }
      containerPath: string
      extraContainerPath?: string
    },
    option?: {
      loadDomain?: (domain: string) => Promise<string>
      extraData?: { params?: object; data?: object }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _this?: Field<any, any, any>
  ): Promise<unknown> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      // 处理URL
      const urlTemplate = template(config.url)
      let urlParams = {}
      if (config.urlParams) {
        config.urlParams.forEach((param) => {
          if (param.field !== undefined && param.data !== undefined) {
            if (param.field === '') {
              urlParams = ParamHelper(param.data, datas, _this)
            } else {
              urlParams = set(urlParams, param.field, ParamHelper(param.data, datas, _this))
            }
          }
        })
      }
      let url = ''
      if (config.domain && option && option.loadDomain) {
        url = await option.loadDomain(config.domain)
      }
      url += urlTemplate(urlParams)

      // 数据处理
      let params: { [key: string]: unknown } = {}
      let data = config.contentType === 'form-data' ? new FormData() : {}
      if ((config.method || 'GET') === 'GET') {
        params = source || {}
      } else if (config.contentType === 'form-data') {
        for (const [key, value] of Object.entries(source || {})) {
          ;(data as FormData).append(key, value as string | Blob)
        }
      } else {
        data = source || {}
      }
      if (config.params) {
        config.params.forEach((param) => {
          if (param.field !== undefined && param.data !== undefined) {
            if (param.field === '') {
              params = ParamHelper(param.data, datas, _this)
            } else {
              params = set(params, param.field, ParamHelper(param.data, datas, _this))
            }
          }
        })
      }
      if (option && option.extraData && option.extraData.params) {
        merge(params, option.extraData.params)
      }
      if (config.contentType === 'form-data') {
        if (config.data) {
          config.data.forEach((param) => {
            if (param.field !== undefined && param.data !== undefined) {
              ;(data as FormData).append(param.field, ParamHelper(param.data, datas, _this))
            }
          })
        }
        if (option && option.extraData && option.extraData.data) {
          for (const field in option.extraData.data) {
            if (Object.prototype.hasOwnProperty.call(option.extraData.data, field)) {
              ;(data as FormData).append(field, option.extraData.data[field])
            }
          }
        }
      } else {
        if (config.data) {
          config.data.forEach((param) => {
            if (param.field !== undefined && param.data !== undefined) {
              if (param.field === '') {
                data = ParamHelper(param.data, datas, _this)
              } else {
                data = set(data, param.field, ParamHelper(param.data, datas, _this))
              }
            }
          })
        }
        if (option && option.extraData && option.extraData.data) {
          merge(data, option.extraData.data)
        }
      }

      // 缓存判断
      if (config.cache && config.cache.global && Object.keys(InterfaceHelper.cache).includes(config.cache.global)) {
        resolve(InterfaceHelper.cache[config.cache.global])
      } else if (
        (!config.cache || !config.cache.disabled) &&
        isEqual(this._config, config) &&
        isEqual(this._url, url) &&
        isEqual(this._params, params) &&
        isEqual(this._data, data)
      ) {
        resolve(this._response)
      } else if (
        config.cache &&
        config.cache.global &&
        Object.keys(InterfaceHelper.cacheResolve).includes(config.cache.global) &&
        InterfaceHelper.cacheResolve[config.cache.global].length > 0
      ) {
        InterfaceHelper.cacheResolve[config.cache.global].push(resolve)
      } else {
        if (config.cache && config.cache.global) {
          InterfaceHelper.cacheResolve[config.cache.global] = [resolve]
        }
        this._config = config
        this._url = url
        this._params = params
        this._data = data

        const request: AxiosRequestConfig = {
          url,
          method: config.method || 'GET',
          withCredentials: config.withCredentials,
          params
        }

        if (config.method === 'POST') {
          request.data = data
        }

        try {
          const response = await axios(request).then((res) => res.data)

          if (config.condition && config.condition.enable) {
            if (get(response, config.condition.field || '') === config.condition.value) {
              if (config.condition.success) {
                if (config.condition.success.type === 'modal') {
                  if (config.condition.success.content) {
                    if (config.condition.success.content.type === 'static') {
                      await this.renderSuccessModal({ message: config.condition.success.content.content || '' })
                    } else if (config.condition.success.content.type === 'field') {
                      await this.renderSuccessModal({
                        message: get(response, config.condition.success.content.field || '', '')
                      })
                    }
                  }
                }
              }
            } else {
              if (config.condition.fail) {
                if (config.condition.fail.type === 'modal') {
                  if (config.condition.fail.content) {
                    if (config.condition.fail.content.type === 'static') {
                      await this.renderFailModal({ message: config.condition.fail.content.content || '' })
                    } else if (config.condition.fail.content.type === 'field') {
                      await this.renderFailModal({
                        message: get(response, config.condition.fail.content.field || '', '')
                      })
                    }
                  }
                }
              }
              reject()
              return
            }
          }

          if (config.response) {
            if (Array.isArray(config.response)) {
              let content = {}
              for (const { field, path } of config.response) {
                const value = path === undefined || path === '' ? response : get(response, path)
                if (field === undefined || field === '') {
                  content = value
                } else {
                  content = set(content, field, value)
                }
              }
              this._response = content
              if (config.cache && config.cache.global) {
                InterfaceHelper.cache[config.cache.global] = content
              }
              if (config.cache && config.cache.global) {
                while (InterfaceHelper.cacheResolve[config.cache.global].length) {
                  const _resolve = InterfaceHelper.cacheResolve[config.cache.global].shift()
                  _resolve && _resolve(content)
                }
              } else {
                resolve(content)
              }
            } else {
              const content = getValue(response, config.response.root || '')
              this._response = content
              if (config.cache && config.cache.global) {
                InterfaceHelper.cache[config.cache.global] = content
              }
              if (config.cache && config.cache.global) {
                while (InterfaceHelper.cacheResolve[config.cache.global].length) {
                  const _resolve = InterfaceHelper.cacheResolve[config.cache.global].shift()
                  _resolve && _resolve(content)
                }
              } else {
                resolve(content)
              }
            }
          } else {
            this._response = response
            if (config.cache && config.cache.global) {
              InterfaceHelper.cache[config.cache.global] = response
            }
            if (config.cache && config.cache.global) {
              while (InterfaceHelper.cacheResolve[config.cache.global].length) {
                const _resolve = InterfaceHelper.cacheResolve[config.cache.global].shift()
                _resolve && _resolve(response)
              }
            } else {
              resolve(response)
            }
          }
        } catch (e: unknown) {
          await this.renderFailModal({
            message: `网络错误 - ${(e as Error).message}`
          })
          reject()
        }
      }
    })
  }
}
