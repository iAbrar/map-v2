 
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
 console.log(initialLocation);
    for (var i = 0; i < initialLocation.length; i++) {
     
      addMarker(initialLocation[i]);
    }


  }

function addMarker(location) {
  console.log('hi');
  var gmarkers1 = [];
var markers1 = [];
var infowindow = new google.maps.InfoWindow({
    content: ''
});
    var category = location.category;
    var title = location.name;
    var pos = new google.maps.LatLng(location.lat, location.log);
    var content = "Hello";

    marker = new google.maps.Marker({
        title: title,
        position: pos,
        category: category,
        map: map
    });

    gmarkers1.push(marker);

    // Marker click listener
    google.maps.event.addListener(marker, 'click', (function (marker, content) {
        return function () {
            console.log('Gmarker 1 gets pushed');
            infowindow.setContent(content);
            infowindow.open(map, marker);
            map.panTo(this.getPosition());
            map.setZoom(15);
        }
    })(marker, content));
}

  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
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
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
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
