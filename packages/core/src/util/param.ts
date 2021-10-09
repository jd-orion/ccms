import { get, set } from "lodash"
import qs from "query-string"
import { ParamConfig } from "../interface";

export default function ParamHelper ( config: ParamConfig, datas: { record?: object, data: object[], step: number }) {
  switch (config.source) {
    case 'record':
      if (datas.record) {
        if (config.field === '') {
          return datas.record
        } else {
          return get(datas.record, config.field)
        }
      }
      break
    case 'data':
      if (datas.data[datas.step]) {
        if (config.field === '') {
          return datas.data[datas.step]
        } else {
          return get(datas.data[datas.step], config.field)
        }
      }
      break
    case 'source':
      if (datas.data[0]) {
        if (config.field === '') {
          return datas.data[0]
        } else {
          return get(datas.data[0], config.field)
        }
      }
      break
    case 'step':
      if (datas.data[config.step]) {
        if (config.field === '') {
          return datas.data[config.step]
        } else {
          return get(datas.data[config.step], config.field)
        }
      }
      break
    case 'url':
      if (config.field === '') {
        return qs.parse(window.location.search, { arrayFormat: 'bracket' })
      } else {
        return get(qs.parse(window.location.search, { arrayFormat: 'bracket' }), config.field)
      }
    case 'static':
      return config.value
  }
  return undefined
}