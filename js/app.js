var viewModel = function (map, neighborhoods) {
	var self = this;
	//initial neighborhood List
	this.neighborhoodList = ko.observableArray([]);
	//builds the neighborhoods in the neighborhood list
	neighborhoods.forEach(function(neighborhood) {
		self.neighborhoodList.push(new Neighborhood(neighborhood));
		console.log(neighborhood)
	});

	//initial current neighborhood
	this.currentNeighborhood = ko.observable(this.neighborhoodList()[0]);

	this.switchCurrentNeighborhood = function (neighborhood) {
		self.currentNeighborhood(neighborhood);
		createMap(self.currentNeighborhood().latLon())
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

// This is the map initializer that is used in the google API callback
function initMap() {
	var initialNeighborhoods = [
		{
			name: "Grandma's House",
			address: "591 E. Ridge Circle, Kalamazoo, MI, 49009",
			latLon: {lat: 42.2913880, lng: -85.6697760},
			markers: [{}]
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

	var mapOptions = {
		center: initialNeighborhoods[0].latLon,
		zoom: 15
	}

	var gMap = createMap(mapOptions.center);
	ko.applyBindings(new viewModel(gMap, initialNeighborhoods));
}