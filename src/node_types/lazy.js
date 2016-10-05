import { register } from '../processor'
import group from './group'

const TYPE = 'lazy'

export default register({
    TYPE,
    factory(factory) {
        console.error('deprecated: lazy() has been replaced by group(factory)') // eslint-disable-line no-console
        return group((...args) => {
            const tmp = factory(...args)

            if (tmp.TYPE !== group.TYPE) {
                // The old implementation required you to wrap your return in a
                // `group`.
                throw new Error('Invalid lazy call')
            }
            return tmp.children
        })
    },
    nodeProcessor() {
        throw new Error('deprecated')
    },
})
