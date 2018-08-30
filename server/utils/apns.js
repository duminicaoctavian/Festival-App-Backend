let apn = require('apn')

var options = {
	token: {
		key: "apns.p8",
		keyId: "52338BR324",
		teamId: "PX5AU8YC45"
	},
	production: false
}

var apnProvider = new apn.Provider(options)

function sendNotification(message, payload, deviceToken) {
    var notification = new apn.Notification()

    notification.expiry = Math.floor(Date.now() / 1000) + 3600
    notification.badge = 1
    notification.sound = "ping.aiff"
    notification.alert = message
    notification.payload = payload
    notification.topic = "Octavian.Festival-App"

    apnProvider.send(notification, deviceToken).then((result) => {
        console.log(result)
    })
}

module.exports = {
    sendNotification
}
    