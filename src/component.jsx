import React from 'react'
import { connect } from 'react-redux'
import loaderContext from './loader_context'
import processor from './processor'

const getDisplayName = Component => (
  Component.displayName ||
  Component.name ||
  (typeof Component === 'string' ? Component : 'Component')
)


const contextShape = React.PropTypes.shape({
    execute: React.PropTypes.func.isRequired,
    hasExecuted: React.PropTypes.func.isRequired,
})

// These need to get passed as props and we need to avoid name conflicts with
// any props the user is passing through to Component. Using the dashes and
// colons ensures that we can't accidentally conflict with JSX props.
const IS_READY = '--loader:is-ready'
const ACTION_QUEUE = '--loader:action-queue'
const DISPATCH = '--loader:dispatch'

export default function ({ component: Component, busy: Busy, resources, mapDispatchToProps = {} }) {
    const displayName = `Loader(${getDisplayName(Component)})`

    if (resources.TYPE !== 'group') {
        if (resources.TYPE === 'debug' && resources.child.TYPE === 'group') {
            // It's ok to wrap the group in a debug node
        } else {
            throw new Error('resources must be a `group()`')
        }
    }

    class LoaderComponent extends React.Component {
        static displayName = displayName

        static childContextTypes = {
            loaderContext: contextShape,
        }

        static contextTypes = {
            loaderContext: contextShape,
        }

        constructor(props, context) {
            super(props, context)
            this.loaderContext = loaderContext(context.loaderContext)
        }

        getChildContext() {
            return {
                loaderContext: this.loaderContext,
            }
        }

        componentDidMount() {
            const {
                [ACTION_QUEUE]: actionQueue,
                [DISPATCH]: dispatch,
            } = this.props
            this.loaderContext.execute(dispatch, actionQueue)
        }

        componentDidUpdate() {
            const {
                [ACTION_QUEUE]: actionQueue,
                [DISPATCH]: dispatch,
            } = this.props
            this.loaderContext.execute(dispatch, actionQueue)
        }

        render() {
            const {
                [IS_READY]: isReady,
                [ACTION_QUEUE]: actionQueue, // eslint-disable-line no-unused-vars
                ...props,
            } = this.props

            if (!isReady) {
                if (Busy) {
                    return (<Busy />)
                }

                return (<noscript></noscript>)
            }

            return (
                <Component {...props} />
            )
        }
    }

    function mapStateToProps(state, props) {
        const { isReady, actionQueue, value } = processor(resources, state, props)

        return {
            ...value,
            [IS_READY]: isReady,
            [ACTION_QUEUE]: actionQueue,
        }
    }

    if (typeof mapDispatchToProps === 'function') {
        throw new Error('not implemented')
    }
    mapDispatchToProps[DISPATCH] = (action) => action

    return connect(mapStateToProps, mapDispatchToProps)(LoaderComponent)
}
