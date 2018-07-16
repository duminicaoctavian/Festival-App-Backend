let modelName = {
    artist: 'Artist',
    channel: 'Channel',
    location: 'Location',
    message: 'Message',
    news: 'News',
    product: 'Product',
    user: 'User'
}

let userSerializationKey = {
    id: '_id',
    username: 'username',
    password: 'password',
    email: 'email',
    imageUrl: 'imageUrl'
}

let documentMethod = {
    init: 'init',
    validate: 'validate',
    save: 'save',
    remove: 'remove'
}

module.exports = {
    modelName,
    documentMethod,
    userSerializationKey
}