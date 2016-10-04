import { register } from '../processor'
import group from './group'
import withProps from './with-props'
import virtual from './virtual'

const TYPE = 'preload'

export default register({
    TYPE,
    factory(factory) {
        console.error('Deprecated: preload has been deprecated. It is simply a `virtual(group(factory))`') // eslint-disable-line no-console
        return virtual(group(
            (...args) => factory(withProps, ...args)
        ))
    },
    nodeProcessor() {
        throw new Error('Deprecated')
    },
})
