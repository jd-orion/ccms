import { lazy } from 'react'

export default {
  fetch: lazy(() => import(/* webpackChunkName: "ccms-antd_step_fetch" */ './fetch')),
  form: lazy(() => import(/* webpackChunkName: "ccms-antd_step_form" */ './form')),
  skip: lazy(() => import(/* webpackChunkName: "ccms-antd_step_skip" */ './skip')),
  table: lazy(() => import(/* webpackChunkName: "ccms-antd_step_table" */ './table')),
  filter: lazy(() => import(/* webpackChunkName: "ccms-antd_step_filter" */ './filter')),
  header: lazy(() => import(/* webpackChunkName: "ccms-antd_step_header" */ './header')),
  detail: lazy(() => import(/* webpackChunkName: "ccms-antd_step_detail" */ './detail'))
}
