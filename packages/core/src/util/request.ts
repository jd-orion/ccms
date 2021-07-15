import React from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { APIConditionConfig, APIConfig } from '../interface'
import { getValue } from './value'

export const request: (config: APIConfig, data?: any) => Promise<any> = (config, data) => {
  return new Promise((resolve, reject) => {
    if (config.globalInterface && window[config.globalInterface]) {
      resolve(window[config.globalInterface])
      return
    }

    let url = config.url
    if (config.concatUrl) {
      if (url.slice(url.length - 1) !== '/') { url += '/' }
      if (Object.prototype.toString.call(config.concatUrl) === '[object Array]') {
        config.concatUrl.forEach((value, index) => {
          const concatMst = data?.[value] && config.concatUrl?.length === index + 1
            ? `${data[value]}`
            : data?.[value]
              ? `${data[value]}/`
              : ''
          url += concatMst
        })
      }
    }

    const request: AxiosRequestConfig = {
      url,
      method: config.method || 'GET',
      withCredentials: config.withCredentials || false
    }

    if (config.method === 'GET') {
      request.params = data
    } else {
      request.data = data
    }

    axios(request).then((response) => {
      /* istanbul ignore next */
      if (response.status !== 200) {
        reject(new Error('Network Error'))
      } else {
        if (config.globalInterface) {
          window[config.globalInterface] = response.data
        }
        resolve(response.data)
      }
    })
  })
}

export interface IAPIConditionSuccessModal {
  message: string
  onOk: () => void
}

export interface IAPIConditionFailModal {
  message: string
  onOk: () => void
}

/* istanbul ignore file */
export const requestCondition: (config: APIConditionConfig, data: any, renderSuccessModal: (props: IAPIConditionSuccessModal) => React.ReactNode | void, renderFailModal: (props: IAPIConditionFailModal) => React.ReactNode | void) => Promise<boolean> = (config, data, renderSuccessModal, renderFailModal) => {
  return new Promise((resolve, reject) => {
    if (getValue(data, config.field).toString() === config.value.toString()) {
      if (config.success.type === 'none') {
        resolve(true)
      } else if (config.success.type === 'modal') {
        if (config.success.content) {
          renderSuccessModal({
            message: config.success.content.type === 'static' ? config.success.content.content : getValue(data, config.success.content.field || ''),
            onOk: () => resolve(true)
          })
        } else {
          reject(new Error('condition.success.content 未配置。'))
        }
      }
    } else {
      if (config.fail.type === 'none') {
        resolve(false)
      } else if (config.fail.type === 'modal') {
        if (config.fail.content) {
          renderFailModal({
            message: config.fail.content.type === 'static' ? config.fail.content.content : getValue(data, config.fail.content.field || ''),
            onOk: () => resolve(false)
          })
        } else {
          reject(new Error('condition.fail.content 未配置。'))
        }
      }
    }
  })
}

export const set = (obj: any, path: any, value: any) => {
  if (path === undefined || path === null) return
  const array = path.split('.')
  const key = array.shift()
  if (key === '') {
    obj = value
  } else {
    if ((1 * key).toString() === key) {
      if (Object.prototype.toString.call(obj) !== '[object Array]') {
        obj = []
      }
    } else {
      if (Object.prototype.toString.call(obj) !== '[object Object]') {
        obj = {}
      }
    }
    if (array.length > 0) {
      obj[key] = set(obj[key], array.join('.'), value)
    } else {
      obj[key] = value
    }
  }
  return obj
}
