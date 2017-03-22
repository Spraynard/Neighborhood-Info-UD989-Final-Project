initialNeighborhoods = [
	{
		name: "Grandma's House",
		address: "591 E. Ridge Circle, Kalamazoo, MI, 49009",
		info: null,
		latLng: {lat: 42.2913880, lng: -85.6697760},
		markerObj: null,
		markers: [{ 
			name: 'Chipotle Grill',
			position: {lat: 42.295412, lng: -85.655212},
			description: 'This is where all the white girls hang out.\
							Just kidding, though, other girls hang out here too.',
			markerObj: null,
			info: null
		},
		{
			name: 'Kalamazoo 10',
			position: {lat: 42.298611 , lng: -85.657182},
			description: 'I used to go here as a tiny kid and watch movies and matinees.\
							It was pretty fun but I eventually became an adult',
			markerObj: null,
			info: null				
		},
		{
			name: 'Steak and Shake',
			position: {lat: 42.295554, lng: -85.655910},
			description: 'This is where I got all my steaks and my shakes.',	
			markerObj: null,
			info: null	
		},
		{
			name: 'Aldi',
			position: {lat: 42.295257, lng: -85.654827},
			description: "I've never been here.",
			markerObj: null,
			info: null
		},
		{
			name: '"The Praries" Golf Course',
			position: {lat: 42.291601, lng: -85.655894},
			description: 'I used to play golf here a bit when I was the king of the golf game\
							ever since stopping I have not set a single foot on the course.',
			markerObj: null,
			info: null			
		}]
	},
	{
		name: "Flint House",
		address: "424 Avon Street, Flint, MI, 48503",
		info: null,
		latLng: {lat: 43.020528, lng: -83.681480},
		markers: [{
			name: "Flint Farmer's Market",
			position: {lat: 43.016913, lng: -83.687040},
			description: "This is the location of the Flint Farmer's Market"
		},
		{
			name: "Cafe Rhema",
			position: {lat: 43.016336, lng: -83.691326},
			description: "Really good coffee shop that I was only able to go to a couple times"
		},
		{
			name: "Flint Drive Road",
			position: {lat: 43.015871, lng: -83.690624},
			description: "The old car drive starts on this road. It's actually pretty cool to watch"
		},
		{
			name: "University of Michigan - Flint",
			position: {lat: 43.019317, lng: -83.688290},
			description: "A lot of kids went here to learn shit"
		}]
	},
	{
		name: "Francesca's House",
		address: "2217 Stonehedge Ave, East Lansing, MI, 48823",
		info: null,
		latLng: {lat: 42.761935, lng: -84.498405},
		markers: [{
			name: 'Michigan State University - Pokemon Go Spot',
			position: {lat: 42.734200 , lng: -84.482825},
			description: "This is some PRIME pokemon go territory right here"
		},
		{
			name: "Meijer",
			position: {lat: 42.762973, lng: -84.500506},
			description: "This meijers is in walking distance to Francesca's House"
		},
		{
			name: "Movie Theatre - NCG Cinema",
			position: {lat: 42.764737, lng: -84.515526},
			description: "I watched James Bond: Spectre with Francesca Here"
		},
		{
			name: "Sam's Club",
			position: {lat: 42.763555, lng: -84.52019},
			description: "I never went to this sams club except to be able to get some gas for mah car."
		}]
	}
]

var viewModel = function () {
	var self = this;

	this.neighborhoodList = ko.observableArray([]);
	initialNeighborhoods.forEach(function(neighborhood) {
		self.neighborhoodList.push(new Neighborhood(neighborhood));
	});

	this.currentNeighborhood = ko.observable(this.neighborhoodList()[0]);

	this.currentgMap = ko.observable(createMap(this.currentNeighborhood().latLng()))

	createNeighborhoodMarkers(this.currentNeighborhood, this.currentgMap());

	// console.log(this.neighborhoodList());
	// console.log(this.currentgMap);
	// console.log(this.currentNeighborhood())
	// console.log(this.currentNeighborhood().latLng())
	//These are the initial map options!!!!
	// var mapOptions = {
	// 	center: initialNeighborhoods[0].latLon,
	// 	zoom: 15
	// }

	// //create map
	// var initialgMap = createMap(mapOptions.center);
	// //create marker of the initial 'neighborhood' place address
	// var homeMarker = createMarker(initialNeighborhoods[0].latLon, initialgMap, initialNeighborhoods[0].name);
	// //create all of the markers on the map from the given object, which is the initial view
	// var homeInfo = createInfoWindow(initialNeighborhoods[0].address)

	// addIWindowOpenListener(homeInfo, initialgMap, homeMarker);
	// addIWindowCloseListener(homeInfo, homeMarker);

	// for (var i = 0; i < initialNeighborhoods[0].markers.length; i++) {
	// 	(function () {
	// 		var neighborhoodMarker = createMarker(initialNeighborhoods[0].markers[i].position, initialgMap, initialNeighborhoods[0].markers[i].name);
	// 		var neighborhoodInfo = createInfoWindow(initialNeighborhoods[0].markers[i].description);
	// 		addIWindowOpenListener(neighborhoodInfo, initialgMap, neighborhoodMarker);
	// 		addIWindowCloseListener(neighborhoodInfo, neighborhoodMarker);
	// 	})()
	// }

	// //initial neighborhood List
	// this.neighborhoodList = ko.observableArray([]);
	// //builds the neighborhoods in the neighborhood list
	// initialNeighborhoods.forEach(function(neighborhood) {
	// 	self.neighborhoodList.push(new Neighborhood(neighborhood));
	// });

	// //initial current neighborhood
	// this.currentNeighborhood = ko.observable(this.neighborhoodList()[0]);
	// this.currentgMap = google.gmap.getMap('map-container');
	// console.log(this.currentgMap);

	//Listens to click event on the main page and switches the current neighborhood to the clicked div
	//After neighborhood is switched, a new map is made (sadly can't cache it) and the markers located on the 
		//current neighborhood object are rendered on to the map.
	this.switchCurrentNeighborhood = function (neighborhood) {
		self.currentNeighborhood(neighborhood);
		self.currentgMap(createMap(self.currentNeighborhood().latLng()));
		createNeighborhoodMarkers(self.currentNeighborhood, self.currentgMap());
	}

	this.showInfoWindow = function(landmark) {
		var latChange = landmark.position.lat + .005
		var panPosition = {lat: latChange, lng: landmark.position.lng}
		self.currentgMap().panTo(panPosition);
		landmark.info.open(self.currentgMap, landmark.markerObj);
	}

	this.closeInfoWindow = function(landmark) {
		console.log("this shit should close");
		if (landmark.info.open()) {
			landmark.info.close();
		}
	}
}
// Creates neighborhood markers 
function createNeighborhoodMarkers(neighborhoodObj, gMap) {
	neighborhoodObj().markerObj(createMarker(neighborhoodObj().latLng(), gMap, neighborhoodObj().address()));
	neighborhoodObj().info(createInfoWindow(neighborhoodObj().address()))
	addIWindowOpenListener(neighborhoodObj().info(), gMap, neighborhoodObj().markerObj())
	addIWindowCloseListener(neighborhoodObj().info(), neighborhoodObj().markerObj())
	neighborhoodObj().markers().forEach(function(markerObj) {
		markerObj.markerObj = createMarker(markerObj.position, gMap, markerObj.name);
		markerObj.info = createInfoWindow(markerObj.description)
		addIWindowOpenListener(markerObj.info, gMap, markerObj.markerObj)
		addIWindowCloseListener(markerObj.info, markerObj.markerObj);
	});
}
// Neighborhood Objects, which will bind with knockout.js
var Neighborhood = function (data) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.info = ko.observable(data.info);
	this.latLng = ko.observable(data.latLng);
	this.markerObj = ko.observable(data.markerObj);
	this.markers = ko.observable(data.markers);
}

//This creates and updates the map data
function createMap(latLng) {
	return new google.maps.Map(document.getElementById('map-container'), {
		center: latLng,
		zoom: 15
	});
}

//Creates marker for specific Place Name
function createMarker(latLng, gmap, gtitle) {
	return new google.maps.Marker({
		position: latLng,
		map: gmap,
		animation: google.maps.Animation.DROP,
		title: gtitle
	});
}

function createInfoWindow(markerContent) {
	return new google.maps.InfoWindow( {
		content: markerContent
	})
}

function addIWindowOpenListener(infoWindow, gMap, marker) {
	marker.addListener('click', function () {
		infoWindow.open(gMap, marker)
	});
}

function addIWindowCloseListener(infoWindow, marker) {
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