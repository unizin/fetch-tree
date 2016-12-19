import entity from '../entity'

function missing(t, errorRegex, node) {
    expect(() => entity(node)).toThrowError(errorRegex)
}
missing.title = (providedTitle, regex) => `error: ${regex}`

it(missing, /id.*function/, { id: 'static-id' })
it(missing, /apiFunction.*function/, { id: (id) => `key-${id}` })
