initialNeighborhoods = [
	//KO  neighborhood objects are build off of these JS objects.
	{
		name: "Grandma's House",
		address: "591 E. Ridge Circle, Kalamazoo, MI, 49009",
		latLng: {lat: 42.2913880, lng: -85.6697760},
		markerObj: null,
		markers: [{ 
			name: 'Chipotle Grill',
			position: {lat: 42.295412, lng: -85.655212},
			yID : 'chipotle-mexican-grill-kalamazoo',
			description: 'This is where all the white girls hang out.\
							Just kidding, though, other girls hang out here too.',
		},
		{
			name: 'Kalamazoo 10',
			position: {lat: 42.298611 , lng: -85.657182},
			yID : 'kalamazoo-10-kalamazoo-2',
			description: 'I used to go here as a tiny kid and watch movies and matinees.\
							It was pretty fun but I eventually became an adult',				
		},
		{
			name: 'Steak and Shake',
			position: {lat: 42.295554, lng: -85.655910},
			yID : 'steak-n-shake-kalamazoo-township',
			description: 'This is where I got all my steaks and my shakes.',	
		},
		{
			name: 'Aldi',
			position: {lat: 42.295257, lng: -85.654827},
			yID : 'aldi-kalamazoo',
			description: "I've never been here.",
		},
		{
			name: '"The Praries" Golf Course',
			position: {lat: 42.291601, lng: -85.655894},
			yID : null,
			description: 'I used to play golf here a bit when I was the king of the golf game\
							ever since stopping I have not set a single foot on the course.',		
		}]
	},
	{
		name: "Flint House",
		address: "424 Avon Street, Flint, MI, 48503",
		latLng: {lat: 43.020528, lng: -83.681480},
		markers: [{
			name: "Flint Farmer's Market",
			position: {lat: 43.016913, lng: -83.687040},
			yID : 'flint-farmers-market-flint-2',
			description: "This is the location of the Flint Farmer's Market"
		},
		{
			name: "Cafe Rhema",
			position: {lat: 43.016336, lng: -83.691326},
			yID : 'cafe-rhema-flint',
			description: "Really good coffee shop that I was only able to go to a couple times"
		},
		{
			name: "Flint Drive Road",
			position: {lat: 43.015871, lng: -83.690624},
			yID : null,
			description: "The old car drive starts on this road. It's actually pretty cool to watch"
		},
		{
			name: "University of Michigan - Flint",
			position: {lat: 43.019317, lng: -83.688290},
			yID : 'university-of-michigan-flint-flint',
			description: "A lot of kids went here to learn shit"
		}]
	},
	{
		name: "Francesca's House",
		address: "2217 Stonehedge Ave, East Lansing, MI, 48823",
		latLng: {lat: 42.761935, lng: -84.498405},
		markers: [{
			name: 'Michigan State University - Pokemon Go Spot',
			position: {lat: 42.734200 , lng: -84.482825},
			yID : 'michigan-state-university-east-lansing',
			description: "This is some PRIME pokemon go territory right here"
		},
		{
			name: "Meijer",
			position: {lat: 42.762973, lng: -84.500506},
			yID : 'meijer-east-lansing-2',
			description: "This meijers is in walking distance to Francesca's House"
		},
		{
			name: "Movie Theatre - NCG Cinema",
			position: {lat: 42.764737, lng: -84.515526},
			yID : 'ncg-cinemas-lansing',
			description: "I watched James Bond: Spectre with Francesca Here"
		},
		{
			name: "Sam's Club",
			position: {lat: 42.763555, lng: -84.52019},
			yID : 'sams-club-lansing-2',
			description: "I never went to this sams club except to be able to get some gas for mah car."
		}]
	}
]

var viewModel = function () {

	//Setting the self scope
	var self = this;

	this.neighborhoodList = ko.observableArray([]);
	initialNeighborhoods.forEach(function(neighborhood) {
		self.neighborhoodList.push(new Neighborhood(neighborhood));
	});

	this.currentNeighborhood = ko.observable(this.neighborhoodList()[0]);

	this.currentgMap = ko.observable(createMap(this.currentNeighborhood().latLng()))
	this.currentMarkers = ko.observableArray(createMarkers(this.currentgMap, this.currentNeighborhood));

	//Listens to click event on the main page and switches the current neighborhood to the clicked div
	//After neighborhood is switched, a new map is made (sadly can't cache it) and the markers located on the 
		//current neighborhood object are rendered on to the map.
	this.switchCurrentNeighborhood = function (neighborhood) {
		// summary: Will be used in the DOM as a data-bind when clicked. Used to change 'this.current
		//			neighborhood' to the selected neighborhood. Loads up a new map with new markers
		//			based on the object.
		// parameters: neighborhood - a 'Neighborhood' object
		self.currentNeighborhood(neighborhood);
		self.currentgMap(createMap(self.currentNeighborhood().latLng()));
		self.currentMarkers(createMarkers(self.currentgMap, self.currentNeighborhood));
	}

	this.toggleInfoWindow = function(marker) {
		// sumary: opens an info window, linked to DOM w/ data-bind 
		// parameters: marker - a 'marker' object
		var picoCall, originalContent, windowContent, object 
		var latChange = marker.position().lat + .005
		var panPosition = {lat: latChange, lng: marker.position().lng}
		self.currentgMap().panTo(panPosition);

		// Marker Operations
		// Multiple things that could happen:
		// 	1. Open up the window, and then call the pico function. When function loads, I inject
		//		the html and all of that into the info window. User will see, but info window will
		//		come up faster.
		//	2. Call the pico function, then on load, open up the marker's infowindow. All of the
		//		info will be displayed perfectly when it does open it up. Lets try this first, and then
		//		if the performance is shit, change it over. Easy enough.
		if (marker.windowBool()) {
			marker.infoWindow().close();
			marker.windowBool(false);
		}
		else {
			if (marker.yID() !== null && marker.query() === 0) {
				marker.infoWindow().open(self.currentgMap, marker.marker);
				picoCall = apiCall(marker.yID());
				marker.query(1);
				picoCall.onload = function () {
					object = JSON.parse(JSON.parse(picoCall.response));
					windowContent = '<h1>' + object.name + '</h1>\
									<br>\
									<h3>' + marker.description() + '</h3>\
									<br>\
									<p>This place has ' + object.rating + ' out of 5 stars</p>';

					marker.infoWindow().setContent(windowContent);
				}
			}
			else if (marker.query() === 1) {
				marker.infoWindow().open(self.currentgMap, marker.marker);
			}
			else {
				marker.infoWindow().setContent('<h3>' + marker.description() + '</h3>');
				marker.infoWindow().open(self.currentgMap, marker.marker);
			}
			marker.windowBool(true);
		}
	}

	//Search Bar Functionality
	// 'this.query' is updated on markup, due to a data bind in the index.html.
	//  starts as ""
	this.query = ko.observable("");

	//This filters throughout the markers and displays/hides the markers that are searched for.
	//Thank you stack overflow!!!
	this.filteredMarkers = ko.computed(function () {
		var filter = self.query().toLowerCase();

		return ko.utils.arrayFilter(self.currentMarkers(), function(marker) {
			//Used to filter an array of marker objects. Takes the current markers available,
			// 'doesMatch' when '.indexOf(filter)' returns any number. -1 counts as a null, I guess.
			// 	Based on 'doesMatch', changes 'isVisible' prop of the marker

			var doesMatch = marker.name().toLowerCase().indexOf(filter) !== -1;

			marker.isVisible(doesMatch);

			return doesMatch
		})
	});
}

// Creates Markers and puts in an observable array for ease of searchability. 
function createMarkers(gMap, neighborhoodObj) {
	var markerList = [];
	markerList.push(new Marker(gMap(), neighborhoodObj().name(), null, neighborhoodObj().latLng(), neighborhoodObj().address()));
	neighborhoodObj().markers().forEach(function(markerObj) {
		markerList.push(new Marker(gMap(), markerObj.name, markerObj.yID, markerObj.position, markerObj.description))
	});
	return markerList
}


// Neighborhood Objects, which will bind with knockout.js
var Neighborhood = function (neighborhoodObj) {
	// summary: Creates a Neighborhood observable object
	// Parameters: neighborhoodObj - an object with all the props on it
	this.name = ko.observable(neighborhoodObj.name);
	this.address = ko.observable(neighborhoodObj.address);
	this.info = ko.observable(neighborhoodObj.info);
	this.latLng = ko.observable(neighborhoodObj.latLng);
	this.markers = ko.observable(neighborhoodObj.markers);
}

//Marker ko objects to use for observabiliy. Creates infoWindows on the same marker object.
var Marker = function(gmap, name, yID, latLng, description) {
			// summary:
		// Parameters:
	var self = this;

	this.name = ko.observable(name);
	this.position = ko.observable(latLng);
	this.description = ko.observable(description);
	this.infoWindow = ko.observable(createInfoWindow());
	this.windowBool = ko.observable(false);
	this.query = ko.observable(0);
	this.yID = ko.observable(yID);
	this.marker = new google.maps.Marker({
		position: self.position(),
		map: gmap,
		animation: google.maps.Animation.DROP
	});
	addMarkerClickInfoToggle(this.infoWindow(), gmap, this.marker, this.yID, this.query, this.windowBool, this.description);
	addIWindowCloseListener(this.infoWindow(), this.marker);

	//Creates dynamic visibility of markers on the google map
	this.isVisible = ko.observable(false);

	this.isVisible.subscribe(function (currentState) {
		if (currentState) {
			self.marker.setMap(gmap);
		}
		else {
			self.marker.setMap(null);
		}
	});

	this.isVisible(true);
}

function apiCall(yelpID) {
	picoCall = neighborhoodYelp.idLookup(yelpID);
	return picoCall;
}

//This creates and updates the map data
function createMap(latLng) {
	return new google.maps.Map(document.getElementById('map-container'), {
		center: latLng,
		zoom: 15
	});
}

function createInfoWindow(markerContent = "") {
	return new google.maps.InfoWindow( {
		content: markerContent
	})
}

function addMarkerClickInfoToggle(infoWindow, gMap, marker, yID, query, windowbool, description) {
	marker.addListener('click', function () {
		// console.log(marker.name);
		// infoWindow.open(gMap, marker)
		if (windowbool()) {
			infoWindow.close();
			windowbool(false);
		}
		else {
			if (yID() !== null && query() === 0) {
				infoWindow.open(gMap, marker)
				picoCall = apiCall(yID());
				query(1);
				picoCall.onload = function () {
					object = JSON.parse(JSON.parse(picoCall.response));
					windowContent = '<h1>' + object.name + '</h1>\
									<br>\
									<h3>' + description() + '</h3>\
									<br>\
									<p>This place has ' + object.rating + ' out of 5 stars</p>';
					infoWindow.setContent(windowContent);					
				}
			}
			else if (query() === 1) {
				infoWindow.open(gMap, marker)
			}
			else {
				infoWindow.setContent('<h3>' + description() + '</h3>');
				infoWindow.open(gMap, marker)
			}
			windowbool(true);
		}
	});
}

function addIWindowCloseListener(infoWindow, marker) {
			// summary:
		// Parameters:
	marker.addListener('dblclick', function () {
		if (infoWindow.open()) {
			infoWindow.close();
		}
	});
}
//
// This is the map initializer that is used in the google API callback
function init() {
	ko.applyBindings(new viewModel());
}

