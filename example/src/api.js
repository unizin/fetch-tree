import Chance from 'chance'

export function getTimeline(username) {
    return new Promise(resolve => {
        const chance = new Chance(username)
        const timeline = chance.n(chance.guid, 10)
        resolve(timeline)
    })
}

export function getStory(guid) {
    return new Promise(resolve => {
        const chance = new Chance(guid)

        const numComments = chance.natural({ max: 20 })

        function generateComment() {
            return {
                user: chance.name(),
                comment: chance.sentence(),
            }
        }

        resolve({
            id: guid,
            name: chance.name(),
            content: chance.paragraph(),
            comments: chance.n(generateComment, numComments),
        })
    })
}
