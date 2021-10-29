import { isEqual, cloneDeep, template, get, set, merge } from "lodash"
import axios, { AxiosRequestConfig } from 'axios'
import { ParamConfig } from "../interface";
import ParamHelper from "./param";
import { getValue } from "./value";

export interface InterfaceConfig {
  domain?: string
  url?: string
  urlParams?: { field: string, data: ParamConfig }[]

  method?: 'GET' | 'POST'
  contentType?: 'json' | 'form-data'
  withCredentials?: boolean

  params?: { field: string, data: ParamConfig }[]
  data?: { field: string, data: ParamConfig }[]

  condition?: {
    enable?: boolean,
    field?: string,
    value?: any,
    success?: { type: 'none' } | 
              { type: 'modal', content?: { type: 'static', content?: string } | 
                                         { type: 'field',  field?: string }},
    fail?: { type: 'none' } | 
           { type: 'modal', content?: {type: 'static', content?: string } |
                                      {type: 'field',  field?: string }}
  }

  response?: {
    root?: string
  } | { field: string, path: string }[]

  cache?: {
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
  private _config: InterfaceConfig = {}
  private _url: string = ''
  private _params: any = {}
  private _data: any = {}
  private _response: any

  protected renderSuccessModal (props: IRenderSuccessModal) {
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
        resolve(null)
      }

      document.body.appendChild(mask)
    })
  }

  protected renderFailModal (props: IRenderFailModal) {
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
        resolve(null)
      }

      document.body.appendChild(mask)
    })
  }

  public request (
    config: InterfaceConfig,
    source: any,
    datas: { record?: object, data: object[], step: number },
    option?: {
      loadDomain?: (domain: string) => Promise<string>
      extra_data?: { params?: any, data?: any }
    }
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // 处理URL
      const urlTemplate = template(config.url)
      let urlParams = {}
      if (config.urlParams) {
        config.urlParams.forEach((param) => {
          if (param.field !== undefined && param.data !== undefined) {
            if (param.field === '') {
              urlParams = ParamHelper(param.data, datas)
            } else {
              set(urlParams, param.field, ParamHelper(param.data, datas))
            }
          }
        })
      }
      const url = (
        config.domain
          ? (option && option.loadDomain
              ? (await option.loadDomain(config.domain))
              : '')
          : ''
      ) + urlTemplate(urlParams)

      // 数据处理
      let params = {}
      let data = config.contentType === 'form-data' ? new FormData() : {}
      if ((config.method || 'GET') === 'GET') {
        params = source || {}
      } else {
        if (config.contentType === 'form-data') {
          for (const [key, value] of Object.entries(source || {})) {
            (data as FormData).append(key, value as any)
          }
        } else {
          data = source || {}
        }
      }
      if (config.params) {
        config.params.forEach((param) => {
          if (param.field !== undefined && param.data !== undefined) {
            if (param.field === '') {
              params = ParamHelper(param.data, datas)
            } else {
              set(params, param.field, ParamHelper(param.data, datas))
            }
          }
        })
      }
      if (option && option.extra_data && option.extra_data.params) {
        merge(params, option.extra_data.params)
      }
      if (config.contentType === 'form-data') {
        if (config.data) {
          config.data.forEach((param) => {
            if (param.field !== undefined && param.data !== undefined) {
              (data as FormData).append(param.field, ParamHelper(param.data, datas))
            }
          })
        }
        if (option && option.extra_data && option.extra_data.data) {
          for (const field in option.extra_data.data) {
            (data as FormData).append(field, option.extra_data.data[field])
          }
        }
      } else {
        if (config.data) {
          config.data.forEach((param) => {
            if (param.field !== undefined && param.data !== undefined) {
              if (param.field === '') {
                data = ParamHelper(param.data, datas)
              } else {
                set(data, param.field, ParamHelper(param.data, datas))
              }
            }
          })
        }
        if (option && option.extra_data && option.extra_data.data) {
          merge(data, option.extra_data.data)
        }
      }
      
      // 缓存判断
      if (
        (!config.cache || !config.cache.disabled) && 
        isEqual(this._config, config) &&
        isEqual(this._url, url) &&
        isEqual(this._params, params) &&
        isEqual(this._data, data)
      ) {
        return this._response
      } else {
        this._config = cloneDeep(config)
        this._url = url
        this._params = cloneDeep(params)
        this._data = cloneDeep(data)
  
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
          const response = await axios(request).then((response) => response.data)
  
          if (config.condition && config.condition.enable) {
            if (get(response, config.condition.field || '') === config.condition.value) {
              if (config.condition.success) {
                if (config.condition.success.type === 'modal') {
                  if (config.condition.success.content) {
                    if (config.condition.success.content.type === 'static') {
                      await this.renderSuccessModal({ message: config.condition.success.content.content || '' })
                    } else if (config.condition.success.content.type === 'field') {
                      await this.renderSuccessModal({ message: get(response, config.condition.success.content.field || '', '') })
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
                      await this.renderFailModal({ message: get(response, config.condition.fail.content.field || '', '') })
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
                const value = path === '' ? response : get(response, path)
                if (field === '') {
                  content = value
                } else {
                  set(content, field, value)
                }
              }
              this._response = cloneDeep(content)
              resolve(content)
            } else {
              const content = getValue(response, config.response.root || '')
              this._response = cloneDeep(content)
              resolve(content)
            }
          } else {
            this._response = cloneDeep(response)
            resolve(response)
          }
        } catch (e: any) {
          await this.renderFailModal({
            message: `网络错误 - ${e.message}`
          })
          reject()
        }
      }
    })
  }
}