/* global Module */

/* Magic Mirror
 * Module: septa-regional-rail
 *
 * By 
 * MIT Licensed.
 */

Module.register("septa-regional-rail", {
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		//Flag for check if module is loaded
		this.loaded = false;

		this.sendSocketNotification("SEPTA-FETCH-EVENTS", {
			departureStation: this.config.departureStation,
			arrivalStation: this.config.arrivalStation,
		});


	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			var wrapperDataRequest = document.createElement("div");
			// check format https://jsonplaceholder.typicode.com/posts/1
			wrapperDataRequest.innerHTML = this.dataRequest;
		}

		// Data from helper
		if (this.dataNotification) {
			const { departureStation, arrivalStation, trains } = this.dataNotification;
			const wrapperDataNotification = document.createElement("div");

			const title = document.createElement("div");
			title.className = "title medium regular normal";
			title.innerHTML = `${departureStation} to ${arrivalStation}`;
			wrapperDataNotification.appendChild(title);

			for (x in trains) {
				const train = trains[x];

				const trainStatus = document.createElement("div");
				trainStatus.className = train.orig_delay === "On time" ? "train-status large bold" : "train-status small bold";
				trainStatus.innerHTML = train.orig_delay === "On time" ? ":)" : train.orig_delay;

				const trainStatusContainer = document.createElement("div");
				trainStatusContainer.className = "train-status-container";
				trainStatusContainer.appendChild(trainStatus);

				const roundedRect = document.createElement("div");
				roundedRect.className = "rounded-rect";
				roundedRect.appendChild(trainStatusContainer);

				const trainName = document.createElement("div");
				trainName.className = "train-name";
				trainName.innerHTML = "# " + train.orig_train;

				const trainDeparture = document.createElement("div");
				trainDeparture.className = "train-departure bold bright";
				trainDeparture.innerHTML = "Departs: " + train.orig_departure_time;

				const trainArrival = document.createElement("div");
				trainArrival.className = "train-arrival";
				trainArrival.innerHTML = "Arrives: " + train.orig_arrival_time;

				const trainInfoWrapper = document.createElement("div");
				trainInfoWrapper.className = "train-info small thin bright";
				trainInfoWrapper.appendChild(trainName);
				trainInfoWrapper.appendChild(trainDeparture);
				trainInfoWrapper.appendChild(trainArrival);

				const trainSlotContainer = document.createElement("div");
				trainSlotContainer.className = "train-slot-container";
				trainSlotContainer.appendChild(roundedRect);
				trainSlotContainer.appendChild(trainInfoWrapper);

				wrapperDataNotification.appendChild(trainSlotContainer);
			}

			wrapper.appendChild(wrapperDataNotification);
		}

		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"septa-regional-rail.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
    if (this.dataNotification) self.updateDom(self.config.animationSpeed);  

	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "SEPTA-EVENTS") {
			this.dataNotification = payload;	
			console.log(payload);
			this.processData();
		}
	},
});
