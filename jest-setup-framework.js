/* eslint-env jest */
import td from 'testdouble'
import { resetCounts } from './test-example/src/api'

beforeEach(resetCounts)
afterEach(td.reset)
td.replace(console, 'group', (...args) => console.log('[group]', ...args))
td.replace(console, 'groupCollapsed', (...args) => console.log('[groupCollapsed]', ...args))
td.replace(console, 'groupEnd', (...args) => console.log('[groupEnd]', ...args))
