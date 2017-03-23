testViewModel = function() {

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


	var self = this;

	this.neighborhoodList = ko.observableArray([]);

	initialNeighborhoods.forEach(function(hood) {
		self.neighborhoodList.push(new testHood(hood));
	});

	console.log(this.neighborhoodList);
	this.currentNeighborhood = ko.observable(this.neighborhoodList()[0]);

	this.switchCurrentNeighborhood = function (hood) {
		self.currentNeighborhood(hood);
	}
}

var testHood = function(data) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
}

ko.applyBindings(new testViewModel());

