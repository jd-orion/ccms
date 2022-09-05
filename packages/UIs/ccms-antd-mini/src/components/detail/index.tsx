import { lazy } from 'react'

export default {
  text: lazy(() => import('./text')),
  group: lazy(() => import('./group'))
}
