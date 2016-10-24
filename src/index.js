import group from './node_types/group'
import loader from './node_types/loader'
import selector from './node_types/selector'
import depends from './node_types/depends'
import debug from './node_types/debug'
import virtual from './node_types/virtual'
import entity from './node_types/entity'
import withProps from './node_types/with-props'
import fromProps from './node_types/from-props'

import component from './component'
import reducer from './actions-reducer'

import { register as registerNodeType } from './processor.js'

export { group, loader, selector, depends, reducer, debug, virtual, entity, withProps, fromProps }

export { registerNodeType }
export default component
