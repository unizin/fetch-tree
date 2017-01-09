import Chance from 'chance'

export function getUser(id) {
    const chance = new Chance(id)

    return {
        id,
        username: chance.username(),
    }
}

export function fetchTodo(id) {
    const chance = new Chance(`todo-${id}`)

    return Promise.resolve({
        id,
        done: chance.bool(),
        note: chance.sentence(),
    })
}

export function fetchBranch(id) {
    const chance = new Chance(`branch-${id}`)

    return Promise.resolve({
        id,
        name: chance.word(),
        leafAId: chance.integer({ min: 1, max: 100 }),
        leafBId: chance.integer({ min: 1, max: 100 }),
    })
}

export function fetchLeaf(id) {
    const chance = new Chance(`leaf-${id}`)

    return Promise.resolve({
        id,
        note: chance.sentence(),
    })
}

export function fetchUser(username) {
    const chance = new Chance(username)

    return Promise.resolve({
        username,
        name: chance.name(),
        avatar: chance.avatar(),
        todos: chance.unique(chance.integer, 5, {
            min: 1,
            max: 100,
        }),
    })
}
