import { lazy } from 'react'

export default {
  text: lazy(() => import('./text')),
  form: lazy(() => import('./form')),
  radio: lazy(() => import('./radio')),
  longtext: lazy(() => import('./longtext')),
  number: lazy(() => import('./number')),
  switch: lazy(() => import('./switch')),
  datetime: lazy(() => import('./datetime')),
  datetimeRange: lazy(() => import('./datetimeRange')),
  select_single: lazy(() => import('./select/single')),
  select_multiple: lazy(() => import('./select/multiple')),
  desc: lazy(() => import('./description')),
  tree_select: lazy(() => import('./treeSelect')),
  color: lazy(() => import('./color')),
  upload: lazy(() => import('./upload')),
  imageurl: lazy(() => import('./imageurl')),
  group: lazy(() => import('./group')),
  hidden: lazy(() => import('./hidden')),
  tabs: lazy(() => import('./tabs')),
  multiple_text: lazy(() => import('./multipleText')),
  custom: lazy(() => import('./custom')),
  import_subform: lazy(() => import('./importSubform')),
  any: lazy(() => import('./any')),
  code: lazy(() => import('./code')),
  diffcode: lazy(() => import('./diffCode')),
  table: lazy(() => import('./table'))
}

export const display = {
  text: lazy(() => import('./text/display')),
  form: lazy(() => import('./form/display')),
  radio: lazy(() => import('./radio/display')),
  longtext: lazy(() => import('./longtext/display')),
  number: lazy(() => import('./number/display')),
  switch: lazy(() => import('./switch/display')),
  datetime: lazy(() => import('./datetime/display')),
  datetimeRange: lazy(() => import('./datetimeRange/display')),
  select_single: lazy(() => import('./select/single/display')),
  select_multiple: lazy(() => import('./select/multiple/display')),
  color: lazy(() => import('./color/display')),
  upload: lazy(() => import('./upload/display')),
  group: lazy(() => import('./group/display')),
  tabs: lazy(() => import('./tabs/display')),
  multiple_text: lazy(() => import('./multipleText/display')),
  import_subform: lazy(() => import('./importSubform/display')),
  table: lazy(() => import('./table'))
}
