import { lazy } from 'react'

export default {
  text: lazy(() => import('./text')),
  group: lazy(() => import('./group')),
  statement: lazy(() => import('./statement')),
  image: lazy(() => import('./image')),
  detail_enum: lazy(() => import('./enum')),
  import_subform: lazy(() => import('./importSubform')),
  custom: lazy(() => import('./custom')),
  table: lazy(() => import('./table')),
  code: lazy(() => import('./code')),
  detail_info: lazy(() => import('./detailInfo')),
  detail_color: lazy(() => import('./detailColor')),
  iframe: lazy(() => import('./iframe')),
  link: lazy(() => import('./link')),
  operation: lazy(() => import('./operation'))
}
