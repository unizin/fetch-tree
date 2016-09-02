import test from 'ava'
import entity from '../entity'

function missing(t, errorRegex, node) {
    t.throws(() => entity(node), errorRegex)
}
missing.title = (providedTitle, regex) => `error: ${regex}`

test(missing, /id.*function/, { id: 'static-id' })
test(missing, /apiFunction.*function/, { id: (id) => `key-${id}` })
