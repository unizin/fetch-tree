import group from './node_types/group'
import loader from './node_types/loader'
import selector from './node_types/selector'
import depends from './node_types/depends'
import preload from './node_types/preload'
import debug from './node_types/debug'
import virtual from './node_types/virtual'
import lazy from './node_types/lazy'

import component from './component'
import reducer from './actions-reducer'

import { register as registerNodeType } from './processor.js'

export { group, loader, selector, depends, preload, reducer, debug, virtual, lazy }

export { registerNodeType }
export default component
