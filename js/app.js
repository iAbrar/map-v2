"use strict";

var map;
var largeInfowindow;


var initialLocation = [{
    name: "Nino",
    LatLng: {
        lat: 24.698162,
        lng: 46.686809
    },
    category: "Restaurant"
}, {
    name: "Centria Mall",
    LatLng: {
        lat: 24.697509,
        lng: 46.683966
    },
    category: "Shopping"
}, {
    name: "Al Faisaliah Mall",
    LatLng: {
        lat: 24.689536,
        lng: 46.685833
    },
    category: "Shopping"
}, {
    name: "Café Bateel",
    LatLng: {
        lat: 24.699741,
        lng: 46.690741
    },
    category: "Cafe"
}, {
    name: "Shake Shack",
    LatLng: {
        lat: 24.699557576237797,
        lng: 46.692240926033705
    },
    category: "Restaurant"
}, {
    name: "Tim Hortons",
    LatLng: {
        lat: 24.69866,
        lng: 46.689851
    },
    category: "Cafe"
}, {
    name: "Bab Al-Yemen Restaurant",
    LatLng: {
        lat: 24.693966,
        lng: 46.678768
    },
    category: "Restaurant"
}, {
    name: "Panorama Mall",
    LatLng: {
        lat: 24.692129,
        lng: 46.670512
    },
    category: "Shopping"
}];
// create Location class
var Location = function(data) {
    this.name = ko.observable(data.name);
    this.LatLng = ko.observable(data.LatLng);
    this.category = ko.observable(data.category);
    this.visible = ko.observable(true);
};




// the viewModel
// *******************************
// *          VIEW MODEL         *
// *******************************
var ViewModel = function() {
    var self = this;
    self.currentPlace = ko.observable();
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
        // console.log(location);
        //google.maps.event.trigger() method
        // location.marker, "click"
        map.setZoom(16);
        map.setCenter(location.marker.getPosition());
        google.maps.event.trigger(location.marker, 'click');
        self.getVenues(location);

    }; // end showLocation

    self.getVenues = function(location) {
            // console.log(location.lat);
//populateInfoWindow();
            //  console.log(location);
            $.ajax({
                    url: 'https://api.foursquare.com/v2/venues/search?ll=' + location.LatLng.lat + ',' + location.LatLng.lng + '&intent=match&name=' + location.name + '&client_id=JMBQJXEH5V0OWT1WJ4SI0HROBCEE2NZRPWDNRYZQ4ENK3RVF&client_secret=ZWZC2S3KW4XAN33HJHCMY0L1Q0X5MOKELZHS4SVI5J5CM25D&v=20170526'
                })
                .done(function(data) {
                    var venue = data.response.venues[0];

                    //set fetched info as properties of location object
                    location.id = ko.observable(venue.id);


                    // use id to get photo
                    $.ajax({
                            url: 'https://api.foursquare.com/v2/venues/' + location.id() + '?oauth_token=R5YPRIGI1HFJXM15BEWHFGKPVIJBTXJOKK5BMODOQFZFB115&v=20170530'
                        })
                        .done(function(data) {
                          
                            // set first photo url as the location photo property
                            var result = data.response.venue.photos.groups["0"].items;
                          //  largeInfowindow = new google.maps.InfoWindow();

                           largeInfowindow.open(map, location.marker);


                           largeInfowindow.setContent('<div class="infowindow"><h6>' + data.response.venue.name +
                                '</h6> Rating: ' + '<span class="rating">' + data.response.venue.rating + '</span>' + '<img class="sq" src="' + result[0].prefix + 'width200' + result[0].suffix + '"><h8> Website <a class="web-links" href="http://' + data.response.venue.url +
                                '" target="_blank">' + data.response.venue.url + '</a>' + ' </h8></div>');

                            // set current location and scroll user to information
                             self.scrollTo('#map');

                        })
                        .fail(function(err) {
                            // if there is an error, set error status and scroll user to the info
                            
                            console.log("error");
                        });

                })
                .fail(function(err) {
                    // if there is an error, set error status and scroll user to the info
               
                    console.log("error");

                });

        } // end getVenues 

    self.scrollTo = function(el) {
        $('html, body').animate({
            scrollTop: $(el).offset().top
        }, "slow");
    };

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
    largeInfowindow = new google.maps.InfoWindow();

    showMarkers(vm.locationsArray());

}

function showMarkers(locations) {

    //locations = ko.observableArray([]);

    var markers = [];
    var bounds = new google.maps.LatLngBounds();
    //  
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

 
        // click handler for google maps marker
        google.maps.event.addListener(marker, 'click', (function(location, vm) {
            return function() {
                // tell viewmodel to show this place
                vm.getVenues(location);
            };
        })(locations[i], vm));

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
    } //end populateInfoWindow




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