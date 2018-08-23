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

let deviceToken = "3ACE6E867FAA671A3FDE66B4140B5F2390BCAE986FB08CF1E9E0562DFC4FA966"

function sendNotification(title, payload) {
    var notification = new apn.Notification()

    notification.expiry = Math.floor(Date.now() / 1000) + 3600
    notification.badge = 1
    notification.sound = "ping.aiff"
    notification.alert = title
    notification.payload = payload
    notification.topic = "Octavian.Festival-App"

    apnProvider.send(notification, deviceToken).then((result) => {
        console.log(result)
    })
}

module.exports = {
    sendNotification
}
    