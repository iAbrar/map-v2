 
  // Create marker for the location "Model"
  var map;
  var initialLocation = [
    {
      name: "Nino",
      LatLng: { lat: 24.698162, lng: 46.686809 },
      category: "Restaurant"
    },
    {
      name: "Centria Mall",
      LatLng: { lat: 24.697509, lng: 46.683966 },
      category: "Shopping"
    },
    {
      name: "Al Faisaliah Mall",
      LatLng: { lat: 24.689536, lng: 46.685833 },
      category: "Shopping"
    },
    {
      name: "Café Bateel",
      LatLng: { lat: 24.699741, lng: 46.690741 },
      category: "Cafe"
    },
    {
      name: "Diamond Restaurant",
      LatLng: { lat: 24.699542, lng: 46.692356 },
      category: "Restaurant"
    },
    {
      name: "Tim Hortons",
      LatLng: { lat: 24.69866, lng: 46.689851 },
      category: "Cafe"
    },
    {
      name: "Bab Al-Yemen Restaurant",
      LatLng: { lat: 24.693966, lng: 46.678768 },
      category: "Restaurant"
    },
    {
      name: "Panorama Mall",
      LatLng: { lat: 24.692129, lng: 46.670512 },
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
  


  
  // the viewModel
  // *******************************
  // *          VIEW MODEL         *
  // *******************************
  var ViewModel = function() {
    var self = this;
   
        // if google map is not displaying, alert the user
   /*   if (!map) {
        alert("Currently Google Maps is not available. Please try again later!");
        return;
      }  */
      
   // self.markers = ko.observableArray([]);
    //self.allLocations = ko.observableArray([]);

 //  self.map = ko.observable(map);
  //  fetchForsquare(self.allLocations, self.map, self.markers);

    // *******************************
    // *      SELECTED CATEGORY         *
    // *******************************
    this.categoryList = [];

    // dynamically retrieve categories to
    // create drop down list later
    initialLocation.map(location => {
      if (!this.categoryList.includes(location.category)){
        location.visible=true;
        this.categoryList.push(location.category);
      }
    });

    this.locationsArray = ko.observableArray(initialLocation);

    // Observable Array for drop down list
    this.categories = ko.observableArray(this.categoryList);
    // This will hold the selected value from drop down menu
    this.selectedCategory = ko.observable();

    /**
       * Filter function, return filtered location by
       * selected category from <select>
       */
    this.filteredLocation = ko.computed(() => {
      if (!this.selectedCategory()) {
        // No input found, return all location
        return this.locationsArray();
      } else {
        // input found, match location category to filter
        return ko.utils.arrayFilter(this.locationsArray(), location => {
          return location.category === this.selectedCategory();
        });
      } //.conditional
    }); //.filteredLocation
 

  }; //end view

  // *******************************
  // *        FUNCTIONS            *
  // *******************************
  function initialize() {
    // Constructor creates a new map - only center and zoom are required.
    var mapOptions = {
      center: new google.maps.LatLng(24.697285134978586, 46.685779094696045),
      zoom: 16
    };
    map= new google.maps.Map(document.getElementById("map"), mapOptions);

//showMarkers(initialLocation,map)
  }

  function showMarkers(locations , map){
        var markers=[];
 var bounds = new google.maps.LatLngBounds();

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
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
  }
  // get location data from foursquare
 /*function fetchForsquare(allthis.filteredLocation, map, markers) {
    var locationDataArr = [];
    var foursquareUrl = "";
    var location = [];
    for (var place in Model) {
      foursquareUrl =
        "https://api.foursquare.com/v2/venues/search" +
        "?client_id=2BIWS0KFSP1W12ARXFHNA20WHNGY0NMOAD3AFYM1ZGCFCF32" +
        "&client_secret=I2F4TTJ0HJOIAO2GCPP0T2NJBMMHFVMCLAQ4HIHF5U1JZCNG" +
        "&v=20130815" +
        "&m=foursquare" +
        "&ll=" +
        Model[place]["latlng"][0] +
        "," +
        Model[place]["latlng"][1] +
        "&query=" +
        Model[place]["name"] +
        "&intent=match";

      $.getJSON(foursquareUrl, function(data) {
        if (data.response.venues) {
          var item = data.response.venues[0];
          allthis.filteredLocation.push(item);
          location = {
            lat: item.location.lat,
            lng: item.location.lng,
            name: item.name,
            loc: item.location.address +
              " " +
              item.location.city +
              ", " +
              item.location.state +
              " " +
              item.location.postalCode
          };
          locationDataArr.push(location);
          placeMarkers(allinitialLocation, place, location, map, markers);
        } else {
          alert(
            "Something went wrong, Could not retreive data from foursquare. Please try again!"
          );
          return;
        }
      });
    }
  }*/

  // place marker for the result initialLocation on the map
 /*function placeMarkers(allLocations, place, data, map, markers) {
    var latlng = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      animation: google.maps.Animation.DROP,
      content: data.name + "<br>" + data.loc
    });

    // create infoWindow for each marker on the map
    var infoWindow = new google.maps.InfoWindow({
      content: marker.content
    });
    marker.infowindow = infoWindow;
    markers.push(marker);
    allLocations()[allLocations().length - 1].marker = marker;

    // show details info about location when user clicks on a marker
    google.maps.event.addListener(marker, "click", function() {
      // close the open infowindow
      for (var i = 0; i < markers().length; i++) {
        markers()[i].infowindow.close();
      }
      infoWindow.open(map, marker);
    });

    // toggle bounce when user clicks on a location marker on google map
    google.maps.event.addListener(marker, "click", function() {
      toggleBounce(marker);
    });
  } */

  // *******************************
  // *      ERROR Handling         *
  // *******************************

 /* function ErrorHandling() {
    alert(
      "Google Maps has failed to load. Please check your internet connection and try again."
    );
  }*/
ko.applyBindings(new ViewModel());
google.maps.event.addDomListener(window, 'load', map);
