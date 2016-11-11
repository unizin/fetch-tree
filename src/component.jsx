import React from 'react'
import { connect } from 'react-redux'
import loaderContext from './loader_context'
import processor from './processor'
import withProps from './node_types/with-props'
import withDispatch from './node_types/with-dispatch'

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
const DISPATCH_PROXY = '--loader:dispatchProxy'

export default function ({ component: Component, busy: Busy, resources, mapDispatchToProps }) {
    if (mapDispatchToProps) {
        throw new Error('mapDispatchToProps was removed. Use the dispatch node type instead')
    }
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
            const {
                [DISPATCH]: dispatch,
                [DISPATCH_PROXY]: dispatchProxy,
            } = props
            dispatchProxy.dispatch = dispatch
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

        componentWillReceiveProps(nextProps) {
            const {
                [DISPATCH]: dispatch,
                [DISPATCH_PROXY]: dispatchProxy,
            } = nextProps
            dispatchProxy.dispatch = dispatch
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
                [ACTION_QUEUE]: ignoredActionQueue,
                [DISPATCH_PROXY]: ignoredDispatchProxy,
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

    function mapStateToProps() {
        // Each instance gets its own `dispatchProxy` function that never changes
        const dispatchProxy = (action) => {
            // dispatchProxy.dispatch will get attached in the component's constructor
            // and updated in componentWillReceiveProps
            if (!dispatchProxy.dispatch) {
                throw new Error(`Dispatch can't be called yet`)
            }
            return dispatchProxy.dispatch(action)
        }

        return (state, props) => {
            const localResources = withProps(props,
                withDispatch(dispatchProxy, resources)
            )
            const { isReady, actionQueue, value } = processor(localResources, state)

            return {
                ...value,
                [IS_READY]: isReady,
                [ACTION_QUEUE]: actionQueue,
                [DISPATCH_PROXY]: dispatchProxy,
            }
        }
    }

    const mapDispatch = {
        [DISPATCH]: (action) => action,
    }

    return connect(mapStateToProps, mapDispatch)(LoaderComponent)
}
