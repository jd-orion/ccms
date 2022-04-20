import { get } from 'lodash'
import qs from 'query-string'
import { ParamConfig } from '../interface'
import { getChainPath } from '../util/value'
import { Field } from '../components/formFields/common'

export default function ParamHelper (config: ParamConfig, datas: { record?: object, data: object[], step: { [field: string]: unknown }, extraContainerPath?: string }, _this?: Field<any, any, any>) { // 1.3.0新增 step由索引变为formValue
  switch (config.source) {
    case 'record':
      if (datas.record) {
        if (_this) {
          const fullPath = datas.extraContainerPath ? getChainPath(_this.props.containerPath, datas.extraContainerPath, config.field) : getChainPath(_this.props.containerPath, config.field)
          _this.handleReportFields && _this.handleReportFields(getChainPath(fullPath))
        }
        if (config.field === '') {
          return datas.record
        } else {
          return get(datas.record, config.field)
        }
      }
      break
    case 'data':
      if (datas.step) {
        _this && _this.handleReportFields && _this.handleReportFields(`${config.field}`)
        if (config.field === '') {
          return datas.step
        } else {
          return get(datas.step, config.field)
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
        _this && _this.handleReportFields && _this.handleReportFields(`${config.field}`)
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
      break
    case 'static':
      return config.value
      break
  }
  return undefined
}
