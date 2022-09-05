import { lazy } from 'react'

export default {
  text: lazy(() => import('./text')),
  form: lazy(() => import('./form')),
  radio: lazy(() => import('./radio')),
  select_single: lazy(() => import('./select/single')),
  select_multiple: lazy(() => import('./select/multiple')),
  longtext: lazy(() => import('./longtext')),
  desc: lazy(() => import('./description')),
  tree_select: lazy(() => import('./treeSelect')),
  import_subform: lazy(() => import('./importSubform')),
  group: lazy(() => import('./group')),
  any: lazy(() => import('./any')),
  number: lazy(() => import('./number')),
  switch: lazy(() => import('./switch')),
  object: lazy(() => import('./object')),
  hidden: lazy(() => import('./hidden')),
  datetime: lazy(() => import('./datetime')),
  datetimeRange: lazy(() => import('./datetimeRange')),
  tabs: lazy(() => import('./tabs')),
  color: lazy(() => import('./color')),
  custom: lazy(() => import('./custom'))
}
