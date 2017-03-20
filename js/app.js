var viewModel = function (map, neighborhoods) {
	var self = this;
	//initial neighborhood List
	this.neighborhoodList = ko.observableArray([]);
	//builds the neighborhoods in the neighborhood list
	neighborhoods.forEach(function(neighborhood) {
		self.neighborhoodList.push(new Neighborhood(neighborhood));
	});

	//initial current neighborhood
	this.currentNeighborhood = ko.observable(this.neighborhoodList()[0]);

	//Listens to click event on the main page and switches the current neighborhood to the clicked div
	//After neighborhood is switched, a new map is made (sadly can't cache it) and the markers located on the 
		//current neighborhood object are rendered on to the map.
	this.switchCurrentNeighborhood = function (neighborhood) {
		self.currentNeighborhood(neighborhood);
		var newgmap = createMap(self.currentNeighborhood().latLon())
		var addressMarker = createMarker(self.currentNeighborhood().latLon(), newgmap)
		self.currentNeighborhood().markers().forEach(function(markerObject) {
			createMarker(markerObject.position, newgmap)
		})
	}
}

// Neighborhood Objects, which will bind with knockout.js
var Neighborhood = function (data) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.latLon = ko.observable(data.latLon);
	this.markers = ko.observable(data.markers);
}

//This creates and updates the map data
function createMap(latLng) {
	return new google.maps.Map(document.getElementById('map-container'), {
		center: latLng,
		zoom: 15
	});
}

function createMarker(latLng, gmap) {
	return new google.maps.Marker({
		position: latLng,
		map: gmap
	});
}
// This is the map initializer that is used in the google API callback
function initApp() {
	// Object full of initial neighborhoods. Possibly add neighborhoods with user input?
	var initialNeighborhoods = [
		{
			name: "Grandma's House",
			address: "591 E. Ridge Circle, Kalamazoo, MI, 49009",
			latLon: {lat: 42.2913880, lng: -85.6697760},
			markers: [{ 
				name: 'Chipotle Grill',
				position: {lat: 42.295412, lng: -85.655212},
				description: 'This is where all the white girls hang out.\
								Just kidding, though, other girls hang out here too.'
			},
			{
				name: 'Kalamazoo 10',
				position: {lat: 42.298611 , lng: -85.657182},
				description: 'I used to go here as a tiny kid and watch movies and matinees.\
								It was pretty fun but I eventually became an adult'
			},
			{
				name: 'Steak and Shake',
				position: {lat: 42.295554, lng: -85.6555910},
				description: 'This is where I got all my steaks and my shakes.'
			},
			{
				name: 'Aldi',
				position: {lat: 42.295257, lng: -85.654827},
				description: "I've never been here."
			},
			{
				name: '"The Praries" Golf Course',
				position: {lat: 42.291601, lng: -85.655894},
				description: 'I used to play golf here a bit when I was the king of the golf game\
								ever since stopping I have not set a single foot on the course.'
			}]
		},
		{
			name: "Flint House",
			address: "424 Avon Street, Flint, MI, 48503",
			latLon: {lat: 43.020528, lng: -83.681480},
			markers: [{}]
		},
		{
			name: "Francesca's House",
			address: "2217 Stonehedge Ave, East Lansing, MI, 48823",
			latLon: {lat: 42.761935, lng: -84.498405},
			markers: [{}]
		}
	]

	//These are the initial map options!!!!
	var mapOptions = {
		center: initialNeighborhoods[0].latLon,
		zoom: 15
	}

	//create map
	var initialgMap = createMap(mapOptions.center);
	//create marker of the initial 'neighborhood' place address
	createMarker(initialNeighborhoods[0].latLon, initialgMap);
	//create all of the markers on the map from the given object, which is the initial view
	for (var i = 0; i < initialNeighborhoods[0].markers.length; i++) {
		createMarker(initialNeighborhoods[0].markers[i].position, initialgMap)
	}

	ko.applyBindings(new viewModel(initialgMap, initialNeighborhoods));
}