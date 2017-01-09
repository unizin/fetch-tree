import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { getCounts } from './src/api'

const instanceId = (function instanceIIFE() {
    let nextId = 1
    const map = new WeakMap()

    return (object) => {
        if (!map.has(object)) {
            map.set(object, nextId++)
        }
        return map.get(object)
    }
}())

class TestMonitor extends React.Component {
    static displayName = 'TestMonitor'
    static propTypes = {
        onReady: React.PropTypes.func.isRequired,
        children: React.PropTypes.node.isRequired,
    }

    static childContextTypes = {
        testMonitor: React.PropTypes.shape({
            setStatus: React.PropTypes.func.isRequired,
            unregister: React.PropTypes.func.isRequired,
        }).isRequired,
    }

    getChildContext() {
        return {
            testMonitor: {
                setStatus: this.setStatus,
                unregister: this.unregister,
            },
        }
    }

    setStatus = (instance, ready) => {
        const id = instanceId(instance)
        if (!ready && this.instanceStatus[id] == null) {
            this.report.loadingScreens++
        }
        this.instanceStatus[id] = ready
        this.checkReady()
    }

    checkReady = () => {
        const waiting = Object.keys(this.instanceStatus).reduce(
            (total, key) => (total + (this.instanceStatus[key] ? 0 : 1)),
            0
        )

        if (waiting === 0) {
            // if onReady is called synchronously the Promise resolves while
            // component is undefined
            process.nextTick(() => {
                this.props.onReady({
                    ...this.report,
                    apiRequests: getCounts(),
                })
            })
        }
    }

    instanceStatus = {}
    report = {
        loadingScreens: 0,
    }

    unregister = (instance) => {
        const id = instanceId(instance)
        delete this.instanceStatus[id]
        this.checkReady()
    }

    render() {
        return this.props.children
    }
}

export default (store) => (jsx) => {
    let component
    return new Promise(resolve => {
        const onReady = (report) => resolve({
            tree: component.toJSON(),
            ...report,
        })
        component = renderer.create(
            <Provider store={store}>
                <TestMonitor onReady={onReady}>
                    {jsx}
                </TestMonitor>
            </Provider>
        )
    })
}
