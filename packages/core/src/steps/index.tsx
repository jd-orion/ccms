import FetchStep, { FetchConfig } from './fetch'
import FilterStep, { FilterConfig } from './filter'
import FormStep, { FormConfig } from './form'
import SkipStep, { SkipConfig } from './skip'
import TableStep, { TableConfig } from './table'

export type StepConfigs = FetchConfig | FormConfig | SkipConfig | TableConfig | FilterConfig

export default {
  fetch: FetchStep,
  form: FormStep,
  skip: SkipStep,
  table: TableStep,
  filter: FilterStep
}
