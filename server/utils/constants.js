// Serialization Keys
let UserSerializationKey = {
    id: '_id',
    username: 'username',
    password: 'password',
    email: 'email',
    imageURL: 'imageURL',
    deviceToken: 'deviceToken',
    offersAppliedTo: 'offersAppliedTo',
    type: 'type'
}

// API Routes
let APIRoute = {
	users: '/users',
    offers: '/offers',
    applications: '/applications'
}

// User Type
let UserType = {
    applicant: 'applicant',
    student: 'student',
    company: 'company',
    university: 'university'
}

// Headers
let Header = {
    client: 'Access-Client'
}

// Access Type
let AccessType = {
    client: 'client'
}

// Model Names
let ModelName = {
    user: 'User',
    offer: 'Offer',
    application: 'Application'
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
    UserType
}