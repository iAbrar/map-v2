
"use strict";

 var map;
 var initialLocation = [{
         name: "Nino",
         LatLng: {
             lat: 24.698162,
             lng: 46.686809
         },
         category: "Restaurant"
     },
     {
         name: "Centria Mall",
         LatLng: {
             lat: 24.697509,
             lng: 46.683966
         },
         category: "Shopping"
     },
     {
         name: "Al Faisaliah Mall",
         LatLng: {
             lat: 24.689536,
             lng: 46.685833
         },
         category: "Shopping"
     },
     {
         name: "Café Bateel",
         LatLng: {
             lat: 24.699741,
             lng: 46.690741
         },
         category: "Cafe"
     },
     {
         name: "Diamond Restaurant",
         LatLng: {
             lat: 24.699542,
             lng: 46.692356
         },
         category: "Restaurant"
     },
     {
         name: "Tim Hortons",
         LatLng: {
             lat: 24.69866,
             lng: 46.689851
         },
         category: "Cafe"
     },
     {
         name: "Bab Al-Yemen Restaurant",
         LatLng: {
             lat: 24.693966,
             lng: 46.678768
         },
         category: "Restaurant"
     },
     {
         name: "Panorama Mall",
         LatLng: {
             lat: 24.692129,
             lng: 46.670512
         },
         category: "Shopping"
     }
 ];
 // create Location class
 var Location = function(data) {
     this.name = ko.observable(data.name);
     this.LatLng = ko.observable(data.LatLng);
     this.category = ko.observable(data.category);
     this.visible = ko.observable(true);
 };


//foursquare api credentials
  function loaddata (location){
	//console.log("location lat");
	// console.log("location" + location);
	  alert("Hello here we are !");
	var latlng = location.LatLng;
	var client_id = 'JMBQJXEH5V0OWT1WJ4SI0HROBCEE2NZRPWDNRYZQ4ENK3RVF';
	var client_secret = 'ZWZC2S3KW4XAN33HJHCMY0L1Q0X5MOKELZHS4SVI5J5CM25D';
	$.ajax({
		url: 'https://api.foursquare.com/v2/venues/search',
		dataType: 'json',
		data: {
			limit: '1',
			ll: latlng,
			client_id: client_id,
			client_secret: client_secret,
			name: 'name',
			v: '20130815'
		},
	async:true
	}).success(function(data){
		debugger;
	var total = data.response.venues[0];
	location.name = total.name;
	if(location.name !== undefined){
		location.name = 'name not found!!';
	} else {
		location.name = total.name;
	}
	//console.log(location.name);
	
		
	    var infowindow = new google.maps.InfoWindow();
		
		
        infowindow.setContent('<h5>' + location.name + '</h5>');
		infowindow.open(map, location.marker);
}).fail(function(error){
	alert('failed to get fooursquare data');
});
 
} // end load data 
 
 // the viewModel
 // *******************************
 // *          VIEW MODEL         *
 // *******************************
 var ViewModel = function() {
     var self = this;

     //  fetchForsquare(self.allLocations, self.map, self.markers);

     // *******************************
     // *      SELECTED CATEGORY         *
     // *******************************
     self.categoryList = [];

     // dynamically retrieve categories to
     // create drop down list later
     initialLocation.map(location => {
         if (!self.categoryList.includes(location.category)) {
             self.categoryList.push(location.category);
         }
     });

     self.locationsArray = ko.observableArray(initialLocation);

     // Observable Array for drop down list
     self.categories = ko.observableArray(self.categoryList);
     // self will hold the selected value from drop down menu
     self.selectedCategory = ko.observable();

     /**
      * Filter function, return filtered location by
      * selected category from <select>
      */
     self.filteredLocation = ko.computed(() => {
         if (!self.selectedCategory()) {

             self.locationsArray().forEach(function(location) {
                 if (location.marker) {
                     location.marker.setVisible(true);
                 }

             });
             // No input found, return all location

             return self.locationsArray();

         } else {
          
             // input found, match location category to filter
             return ko.utils.arrayFilter(self.locationsArray(), location => {

                 // select all location in the same category 

                 var match = location.category === self.selectedCategory(); // return true or false 
                 location.marker.setVisible(match);
                 return match;
             });
         } //.conditional
     }); //.filteredLocation

     self.showLocation = function(location) {
         //google.maps.event.trigger() method
         // location.marker, "click"
        map.setZoom(16);
        map.setCenter(location.marker.getPosition());
        google.maps.event.trigger(location.marker, 'click');
      

     }; // end showLocation


 }; //end view

 // *******************************
 // *        FUNCTIONS            *
 // *******************************
 function initialize() {
     // Constructor creates a new map - only center and zoom are required.
     var mapOptions = {
         center: new google.maps.LatLng(24.697285134978586, 46.685779094696045),
         zoom: 12
     };
     map = new google.maps.Map(document.getElementById("map"), mapOptions);
     showMarkers(initialLocation);

 }

 function showMarkers(locations) {

     //locations = ko.observableArray([]);

     var markers = [];
     var bounds = new google.maps.LatLngBounds();
     var largeInfowindow = new google.maps.InfoWindow();

     // The following group uses the location array to create an array of markers on initialize.
     for (var i = 0; i < locations.length; i++) {
         // Get the position from the location array.
         var position = locations[i].LatLng;
         var title = locations[i].name;

         // Create a marker per location, and put into markers array.
         var marker = new google.maps.Marker({
             map: map,
             position: position,
             title: title,
             animation: google.maps.Animation.DROP,
             id: i
         });
         // Push the marker to our array of markers.
         markers.push(marker);

         vm.locationsArray()[i].marker = marker;
          marker.addListener('click', function() {
			  var mark = this;
			  loaddata(locations[i]);
			 //  toggleBounce(this);
            setTimeout(function() {
                mark.setAnimation(null);
            }, 1000);
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
     }
	 
 }

 // This function populates the infowindow when the marker is clicked. We'll only allow
 // one infowindow which will open at the marker that is clicked, and populate based
 // on that markers position.
 function populateInfoWindow(marker, infowindow) {
     // Check to make sure the infowindow is not already opened on this marker.
     if (infowindow.marker != marker) {
         infowindow.marker = marker;
         infowindow.setContent('<div>' + marker.title + '</div>');
         infowindow.open(map, marker);
         // Make sure the marker property is cleared if the infowindow is closed.
         infowindow.addListener('closeclick', function() {
             infowindow.setMarker = null;
         });
     }
 }



 // *******************************
 // *      ERROR Handling         *
 // *******************************

 function ErrorHandling() {
     alert(
         "Google Maps has failed to load. Please check your internet connection and try again."
     );
 }

 var vm = new ViewModel();
 ko.applyBindings(vm);
