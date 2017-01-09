/* eslint-env jest */
/* eslint-disable react/prop-types */
import React from 'react'

import { renderSnapshot } from './test-utils.js'
import Todo from '../src/containers/todo'
import TodoList from '../src/components/todo-list'
import TodoListWithPreloading from '../src/containers/todo-list-with-preloading'
import TodoWrapperWithPreloading from '../src/containers/todo-wrapper-with-preloading'


describe('single-connected-component', () => {
    test(`render a single connected component`, async () => {
        const report = await renderSnapshot(
            <Todo id={1} />
        )
        expect(report.apiRequests).toEqual({
            fetchTodo: 1,
        })
        expect(report.loadingScreens).toBe(1)
    })

    test(`render a list of connected components (no preloading)`, async () => {
        const report = await renderSnapshot(
            <TodoList ids={[1, 2, 3, 4, 5]} />
        )

        expect(report.apiRequests).toEqual({
            fetchTodo: 5,
        })
        expect(report.loadingScreens).toBe(5)
    })

    test(`preloading for a single child`, async () => {
        const report = await renderSnapshot(
            <TodoWrapperWithPreloading id={5} />
        )

        expect(report.apiRequests).toEqual({
            fetchTodo: 1,
        })
        expect(report.loadingScreens).toBe(1)
    })

    test(`preloading a list with connected children`, async () => {
        const report = await renderSnapshot(
            <TodoListWithPreloading ids={[1, 2, 3, 4, 5]} />
        )

        expect(report.apiRequests).toEqual({
            fetchTodo: 5,
        })
        expect(report.loadingScreens).toBe(1)
    })
})
