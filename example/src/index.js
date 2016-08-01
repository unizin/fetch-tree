import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './configure_store'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import Chance from 'chance'
import Timeline from './components/timeline.jsx'

import * as api from './api'

global.api = api

const store = configureStore()

function onRoot(tmp, redirect) {
    const chance = new Chance()
    redirect(`/${chance.first()}_${chance.last()}`)
}

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" onEnter={onRoot} />
            <Route path="/:username" component={Timeline} />
        </Router>
    </Provider>
), document.getElementById('react-app-placeholder'))
