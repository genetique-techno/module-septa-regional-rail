/* Magic Mirror
 * Node Helper: septa-regional-rail
 *
 * By 
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		if (notification === "SEPTA-FETCH-EVENTS") {
			this.createFetcher();
		}
	},

	createFetcher: function() {
		console.log("Creating fetcher for Septa Regional Rail API");
		var self = this;
		var urlBase = "https://www3.septa.org/hackathon/NextToArrive/?req1=Ivy+Ridge&req2=Suburban+Station&req3=3&_=";

		function doFetch() {
		  request({
		  	url: urlBase+Date.now(),
		  	json: true,
		  }, (err, res, body) => {
		  	if (!err && res.statusCode === 200) {
		  		console.log("got successful fetch");
						self.sendSocketNotification("SEPTA-EVENTS", body);
		  	} else {
						self.sendSocketNotification("SEPTA-FETCH-ERROR", {});
		  	}
		  })	
		}

		doFetch();
		setInterval(doFetch, 30000);
	},

});
