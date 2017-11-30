/* Magic Mirror
 * Node Helper: module-septa-regional-rail
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
			this.createFetcher(payload);
		}
	},

	createFetcher: function({ departureStation, arrivalStation }) {
		console.log("Creating fetcher for Septa Regional Rail API");
		var self = this;
		var urlBase = `https://www3.septa.org/hackathon/NextToArrive/?req1=${departureStation.replace(" ", "+")}&req2=${arrivalStation.replace(" ", "+")}&req3=3&_=`;

		function doFetch() {
		  request({
		  	url: urlBase+Date.now(),
		  	json: true,
		  }, (err, res, body) => {
		  	if (!err && res.statusCode === 200) {
		  			const data = {
		  			  departureStation: departureStation,
		  			  arrivalStation: arrivalStation,
		  			  trains: body,
		  		  };
						self.sendSocketNotification("SEPTA-EVENTS", data);
		  	} else {
						self.sendSocketNotification("SEPTA-FETCH-ERROR", {});
		  	}
		  })	
		}

		doFetch();
		setInterval(doFetch, 30000);
	},

});
