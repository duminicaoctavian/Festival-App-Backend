let mongoose = require('mongoose')
let validator = require('validator')
let jwt = require('jsonwebtoken')
let _ = require('lodash')
let bcrypt = require('bcryptjs')
let { modelName, userSerializationKey, documentMethod } = require('./../utils/constants')

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 6,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isAlphanumeric,
			message: '{VALUE} is not a valid username'
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
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	imageUrl: {
		type: String,
		required: false,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: '{VALUE} is not a valid URL'
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
	var user = this
	var userObject = user.toObject()

	return _.pick(userObject, [
		userSerializationKey.id,
		userSerializationKey.username,
		userSerializationKey.email,
		userSerializationKey.imageUrl
	])
}

UserSchema.methods.generateAuthToken = function () {
	var user = this
	var access = 'auth'
	var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString()

	user.tokens = user.tokens.concat([{
		access: access,
		token: token
	}]);

	return user.save().then(() => {
		return token
	})
}

UserSchema.statics.findByToken = function (token) {
	var User = this
	var decoded

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET)
	} catch (e) {
		return Promise.reject()
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
}

UserSchema.statics.findByCredentials = function (email, password) {
	var User = this

	return User.findOne({ email }).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user)
				} else {
					reject(user)
				}
			})
		})
	})
}

UserSchema.methods.removeToken = function (token) {
	var user = this

	return user.update({
		$pull: {
			tokens: {
				token
			}
		}
	})
}

UserSchema.pre(documentMethod.save, function (next) {
	var user = this

	if (user.isModified(userSerializationKey.password)) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

var User = mongoose.model(modelName.user, UserSchema)

module.exports = {
	User
}
