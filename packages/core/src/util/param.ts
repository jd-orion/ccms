import { get } from 'lodash'
import qs from 'query-string'
import { ParamConfig } from '../interface'
import { getChainPath } from './value'
import { Field } from '../components/formFields/common'

export default function ParamHelper(
  config: ParamConfig,
  datas: {
    record: { [field: string]: unknown }
    data: object[]
    step: { [field: string]: unknown }
    containerPath: string
    extraContainerPath?: string
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _this?: Field<any, any, any>
) {
  const { source } = config
  const { data, step, record, containerPath, extraContainerPath } = datas
  switch (source) {
    case 'relative':
      {
        const { relative, field: relativeField } = config
        const containerPathNode = containerPath.split('.')
        const relativeFullPath = getChainPath(
          ...containerPathNode.slice(0, containerPathNode.length - relative),
          relativeField
        )
        return get(step, relativeFullPath)
      }
      break
    case 'record':
      {
        const { field: recordField } = config
        if (record) {
          if (_this) {
            const recordFullPath = extraContainerPath
              ? getChainPath(_this.props.containerPath, extraContainerPath, recordField)
              : getChainPath(_this.props.containerPath, recordField)
            _this.handleReportFields && _this.handleReportFields(getChainPath(recordFullPath))
          }
          if (recordField === '') {
            return record
          }
          return get(record, recordField)
        }
      }
      break
    case 'data':
      {
        const { field: dataField } = config
        if (step) {
          _this && _this.handleReportFields && _this.handleReportFields(`${dataField}`)
          if (dataField === '') {
            return step
          }
          return get(step, dataField)
        }
      }
      break
    case 'source':
      {
        const { field: sourceField } = config
        if (data[0]) {
          if (sourceField === '') {
            return data[0]
          }
          return get(data[0], sourceField)
        }
      }
      break
    case 'step':
      {
        const { step: stepStep, field: stepField } = config
        if (data[stepStep]) {
          _this && _this.handleReportFields && _this.handleReportFields(`${stepField}`)
          if (stepField === '') {
            return data[stepStep]
          }
          return get(data[stepStep], stepField)
        }
      }
      break
    case 'url':
      {
        const { field: urlField } = config
        if (urlField === '') {
          return qs.parse(window.location.search, { arrayFormat: 'bracket' })
        }
        return get(qs.parse(window.location.search, { arrayFormat: 'bracket' }), urlField)
      }
      break
    case 'static':
      {
        const { value: staticValue } = config
        return staticValue
      }
      break
    default: {
      return null
    }
  }
  return undefined
}
