import { lazy } from 'react'
import { FetchConfig } from './fetch'
import { FilterConfig } from './filter'
import { FormConfig } from './form'
import { HeaderConfig } from './header'
import { SkipConfig } from './skip'
import { TableConfig } from './table'
import { DetailConfig } from './detail'

export type StepConfigs = FetchConfig | FormConfig | SkipConfig | TableConfig | FilterConfig | DetailConfig | HeaderConfig

export default {
  fetch: lazy(() => import('./fetch')),
  form: lazy(() => import('./form')),
  skip: lazy(() => import('./skip')),
  table: lazy(() => import('./table')),
  filter: lazy(() => import('./filter')),
  detail: lazy(() => import('./detail')),
  header: lazy(() => import(/* webpackChunkName: "ccms_step_header" */ './header'))
}
