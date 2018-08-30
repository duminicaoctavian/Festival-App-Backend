// Serialization Keys
let UserSerializationKey = {
    id: '_id',
    username: 'username',
    password: 'password',
    email: 'email',
    imageURL: 'imageURL',
    artists: 'artists',
    deviceToken: 'deviceToken'
}

// API Routes
let APIRoute = {
	products: '/products',
	artists: '/artists',
	users: '/users',
    channels: '/channels',
    messages: '/messages',
    news: '/news',
    locations: '/locations',
    questions: '/questions'
}

// Socket Events 
let SocketEvent = {
    connection: 'connection',
    newChannel: 'newChannel',
    channelCreated: 'channelCreated',
    startType: 'startType',
    userTypingUpdate: 'userTypingUpdate',
    stopType: 'stopType',
    newMessage: 'newMessage',
    messageCreated: 'messageCreated',
    newLocation: 'newLocation',
    locationCreated: 'locationCreated',
    deleteLocation: 'deleteLocation',
    locationDeleted: 'locationDeleted',
    updateLocation: 'updateLocation',
    locationUpdated: 'locationUpdated'
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
    user: 'User',
    question: 'Question'
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
    defaultProfilePictureURL: 'https://s3.eu-central-1.amazonaws.com/octaviansuniversalbucket/profileDefault.png'
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
    DateConstants,
    APIRoute,
    SocketEvent
}