let mongoose = require('mongoose')
let validator = require('validator')
let jwt = require('jsonwebtoken')
let _ = require('lodash')
let bcrypt = require('bcryptjs')
let { ModelName, UserSerializationKey, DocumentMethod, AccessType } = require('./../utils/constants')

// TODO - Access for other user types
// TODO - Solve remaining magic strings

let ErrorMessage = {
	username: '{VALUE} is not a valid username. Only alphanumeric characters are allowed.',
	email: '{VALUE} is not a valid email.',
	URL: '{VALUE} is not a valid URL.'
}

let UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 6,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isAlphanumeric,
			message: ErrorMessage.username
		}
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: ErrorMessage.email
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	imageURL: {
		type: String,
		required: false,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: ErrorMessage.URL
		}
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
})

UserSchema.methods.toJSON = function () {
	let user = this
	let userObject = user.toObject()

	return _.pick(userObject, [
		UserSerializationKey.id,
		UserSerializationKey.username,
		UserSerializationKey.email,
		UserSerializationKey.imageUrl
	])
}

UserSchema.methods.generateAuthToken = function () {
	let user = this
	let access = AccessType.client
	let token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString()

	user.tokens = user.tokens.concat([{
		access,
		token
	}])

	return user.save().then(() => {
		return token
	})
}

UserSchema.statics.findByToken = function (token) {
	let User = this
	var decoded

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		return Promise.reject()
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.access': AccessType.client,
		'tokens.token': token
	})
}

UserSchema.statics.findByCredentials = function (email, password) {
	let User = this

	return User.findOne({ email }).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, response) => {
				if (response) {
					resolve(user)
				} else {
					reject(user)
				}
			})
		})
	})
}

UserSchema.methods.removeToken = function (token) {
	let user = this

	return user.update({
		$pull: {
			tokens: {
				token
			}
		}
	})
}

UserSchema.pre(DocumentMethod.save, function (next) {
	let user = this

	if (user.isModified(UserSerializationKey.password)) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

let User = mongoose.model(ModelName.user, UserSchema)

module.exports = {
	User
}
