"use strict";
var map;
var largeInfowindow;
var bounds;
var marker;
var initialLocation = [ {
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
} ];
// create Location class
var Location = function( data ) {
    this.name = ko.observable( data.name );
    this.LatLng = ko.observable( data.LatLng );
    this.category = ko.observable( data.category );
    this.visible = ko.observable( true );
};
// the viewModel
// *******************************
// *          VIEW MODEL         *
// *******************************
var ViewModel = function() {
    var self = this;
    self.currentPlace = ko.observable();
    // *******************************
    // *      SELECTED CATEGORY         *
    // *******************************
    self.categoryList = [];
    // dynamically retrieve categories to
    // create drop down list later
    initialLocation.map( location => {
        if ( !self.categoryList.includes( location.category ) ) {
            self.categoryList.push( location.category );
        }
    } );
    self.locationsArray = ko.observableArray( initialLocation );
    // Observable Array for drop down list
    self.categories = ko.observableArray( self.categoryList );
    // self will hold the selected value from drop down menu
    self.selectedCategory = ko.observable();
    /**
     * Filter function, return filtered location by
     * selected category from <select>
     */
    self.filteredLocation = ko.computed( () => {
        if ( !self.selectedCategory() ) {
            self.locationsArray().forEach( function( location ) {
                if ( location.marker ) {
                    location.marker.setVisible( true );
                }
            } );
            // No input found, return all location
            return self.locationsArray();
        } else {
            //close info window when the category changed
            largeInfowindow.close();
            // input found, match location category to filter
            return ko.utils.arrayFilter( self.locationsArray(), location => {
                // select all location in the same category 
                var match = location.category === self.selectedCategory(); // return true or false 
                location.marker.setVisible( match );
                return match;
            } );
        } //.conditional
    } ); //.filteredLocation
    // *******************************
    // *        VIEW FUNCTIONS       *
    // *******************************

    self.getVenues = function( location ) {
       map.setZoom( 16 );
        map.setCenter( location.marker.getPosition() );
       // google.maps.event.trigger( location.marker, 'click' );
           if ( location.marker.getAnimation() !== null ) {
                    location.marker.setAnimation( null );
                } else {
                    location.marker.setAnimation( google.maps.Animation.BOUNCE );
                    setTimeout(function(){ location.marker.setAnimation(null); }, 1400);  // stop after 2 bounces
                }
                // reset content 
                 largeInfowindow.setContent("");
                        largeInfowindow.open( map, location.marker );


        $.ajax( {
            url: 'https://api.foursquare.com/v2/venues/search?ll=' + location.LatLng.lat + ',' + location.LatLng.lng + '&intent=match&name=' + location.name + '&client_id=JMBQJXEH5V0OWT1WJ4SI0HROBCEE2NZRPWDNRYZQ4ENK3RVF&client_secret=ZWZC2S3KW4XAN33HJHCMY0L1Q0X5MOKELZHS4SVI5J5CM25D&v=20170526'
        } ).done( function( data ) {
            var venue = data.response.venues[ 0 ];
            //set fetched info as properties of location object
            location.id = ko.observable( venue.id );
            // use id to get photo
            $.ajax( {
                url: 'https://api.foursquare.com/v2/venues/' + location.id() + '?oauth_token=R5YPRIGI1HFJXM15BEWHFGKPVIJBTXJOKK5BMODOQFZFB115&v=20170530'
            } ).done( function( data ) {
                // set first photo url as the location photo property
                var photos = data.response.venue.photos.groups[ "0" ].items || "there is no photo";
                var url = data.response.venue.url || 'No url provided';
                var name = data.response.venue.name || 'No name provided';
                var rating = data.response.venue.rating || 'No rating provided';
            
                largeInfowindow.setContent( '<div class="infowindow"><h6>' + name + '</h6> Rating: ' + '<span class="rating">' + rating + '</span>' + '<img class="sq" src="' + photos[ 0 ].prefix + 'width200' + photos[ 0 ].suffix + '"><h8> Website <a class="web-links" href="http://' + url + '" target="_blank">' + url + '</a>' + ' </h8></div>' );
                // set current location and scroll user to information
                self.scrollTo( '#map' );
            } ).fail( function( err ) {
                // if there is an error, set error status 
                alert( "Sorry, there is an error to view the information" );
            } );
        } ).fail( function( err ) {
            // if there is an error, set error status
            alert( "Sorry, there is an error to view the information" );
        } );
    }; // end getVenues 
    self.scrollTo = function( el ) {
        $( 'html, body' ).animate( {
            scrollTop: $( el ).offset().top
        }, "slow" );
    };
}; //end view
// *******************************
// *     Initialization          *
// *******************************
function initialize() {
    // Constructor creates a new map - only center and zoom are required.
    var mapOptions = {
        center: new google.maps.LatLng( 24.697285134978586, 46.685779094696045 ),
        zoom: 12
    };
    map = new google.maps.Map( document.getElementById( "map" ), mapOptions );
    largeInfowindow = new google.maps.InfoWindow();
    showMarkers( vm.locationsArray() );
}

function showMarkers( locations ) {
    var markers = [];
    bounds = new google.maps.LatLngBounds();
    //  
    // The following group uses the location array to create an array of markers on initialize.
    for ( var i = 0; i < locations.length; i++ ) {
        // Get the position from the location array.
        var position = locations[ i ].LatLng;
        var title = locations[ i ].name;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker( {
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        } );
        // Push the marker to our array of markers.
        markers.push( marker );
        vm.locationsArray()[ i ].marker = marker;
        // click handler for google maps marker
        google.maps.event.addListener( marker, 'click', ( function( location, vm ) {
            return function() {
                // tell viewmodel to show this place
                map.setZoom( 16 );
                map.setCenter( location.marker.getPosition() );
                vm.getVenues( location );
            };
        } )( locations[ i ], vm ) );
        //google.maps.event.addListener(marker, 'click', mv.clickListener());
        bounds.extend( markers[ i ].position );
    }
}
// *******************************
// *      ERROR Handling         *
// *******************************
function ErrorHandling() {
    alert( "Google Maps has failed to load. Please check your internet connection and try again." );
}
var vm = new ViewModel();
ko.applyBindings( vm );