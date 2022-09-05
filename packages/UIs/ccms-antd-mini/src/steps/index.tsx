import { lazy } from 'react'

export default {
  fetch: lazy(() => import('./fetch')),
  form: lazy(() => import('./form')),
  table: lazy(() => import('./table')),
  filter: lazy(() => import('./filter')),
  detail: lazy(() => import('./detail'))
}
