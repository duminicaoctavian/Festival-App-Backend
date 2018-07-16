// Serialization Keys
let UserSerializationKey = {
    id: '_id',
    username: 'username',
    password: 'password',
    email: 'email',
    imageUrl: 'imageUrl'
}

// Headers
let Header = {
    admin: 'Access-Admin',
    client: 'Access-Client',
    artist: 'Access-Artist',
    employee: 'Access-Employee',
    organizer: 'Access-Organizer'
}

// Access Type
let AccessType = {
    admin: 'admin',
    client: 'client',
    artist: 'artist',
    employee: 'employee',
    organizer: 'organizer'
}

// Model Names
let ModelName = {
    artist: 'Artist',
    channel: 'Channel',
    location: 'Location',
    message: 'Message',
    news: 'News',
    product: 'Product',
    user: 'User'
}

// Document Methods
let DocumentMethod = {
    init: 'init',
    validate: 'validate',
    save: 'save',
    remove: 'remove'
}

// Storage Paths
let StoragePath = {
    defaultProfilePictureURL: 'https://firebasestorage.googleapis.com/v0/b/granis-fbe83.appspot.com/o/ProfileImages%2Fprofile-default.jpg?alt=media&token=9d9d275b-710b-4637-ae95-5944a5fb2948'
}

// Date Constants
let DateConstants = {
    dateFormatter: 'DD MMM YYYY hh:mm',
    endOfDayTime: '08:00',
    dayUnitOfTime: 'day'
}

module.exports = {
    UserSerializationKey,
    Header,
    AccessType,
    ModelName,
    DocumentMethod,
    StoragePath,
    DateConstants
}