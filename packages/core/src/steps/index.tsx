import FetchStep, { FetchConfig } from './fetch'
import FilterStep, { FilterConfig } from './filter'
import FormStep, { FormConfig } from './form'
import HeaderStep, { HeaderConfig } from './header'
import SkipStep, { SkipConfig } from './skip'
import TableStep, { TableConfig } from './table'
import DetailStep, { DetailConfig } from './detail'

export type StepConfigs = FetchConfig | FormConfig | SkipConfig | TableConfig | FilterConfig | DetailConfig | HeaderConfig

export default {
  fetch: FetchStep,
  form: FormStep,
  skip: SkipStep,
  table: TableStep,
  filter: FilterStep,
  detail: DetailStep,
  header: HeaderStep
}
