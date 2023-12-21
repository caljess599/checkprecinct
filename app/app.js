var formEl = document.getElementById("form");

document.getElementById("clearBtn").addEventListener("click", function () {
  var showResults = document.getElementById("results");
  var showAddress = document.getElementById("fullAddress");
  var showPrecinct = document.getElementById("precintName");

  showResults.innerText = "";
  showAddress.innerText = "";
  showPrecinct.innerText = "";
});

formEl.addEventListener("submit", function (event) {
  var formData = new FormData(event.target);
  var address = {};
  formData.forEach(function (value, key) {
    address[key] = value;
  });

  console.log("Address data", address);

  var street_num = address.street_num;
  var street_name = address.street_name;

  // var url = "https://gisweb.charlottesville.org/cvgisweb/rest/services/OpenData_1/MapServer/76/query?where=StreetNumber%20%3D%20'211'%20AND%20StreetName%20%3D%20'ALDERMAN'&outFields=FullAddress,ParcelIDNumber&outSR=4326&f=json";
  var url = `https://gisweb.charlottesville.org/cvgisweb/rest/services/OpenData_1/MapServer/76/query?where=StreetNumber%20%3D%20'${street_num}'%20AND%20StreetName%20%3D%20'${street_name.toUpperCase()}'&outFields=FullAddress,ParcelIDNumber&outSR=4326&f=json`;

  var responseAddressLookup = fetch(url);
  var showResults = document.getElementById("results");
  var showAddress = document.getElementById("fullAddress");
  var showPrecinct = document.getElementById("precintName");
  var showClearButton = document.getElementById("clearBtn");

  // first api call
  responseAddressLookup // this is the fetch response
    .then((response) => response.json()) // "response" is arbitrary name for responsePromise; .json() returns a promise that resolves with a JSON Object
    .then((data) => {
      // calling response.json() data and doing things with it
      console.log("Address request succeeded!");
      var features = data.features[0];
      var fullAddress = features.attributes.FullAddress;
      var geox = features.geometry.x;
      var geoy = features.geometry.y;
      console.log(fullAddress);
      console.log(geox);
      console.log(geoy);

      // if else should go here

      var url2 = `https://gisweb.charlottesville.org/arcgis/rest/services/OpenData_1/MapServer/12/query?where=1%3D1&outFields=PrecinctName,PrecinctNumber&geometry=${geox},${geoy},${geox},${geoy}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outSR=4326&f=json`;

      //second api call
      var responsePrecinctLookup = fetch(url2);

      responsePrecinctLookup // this is the fetch response
        .then((response) => response.json())
        .then((data) => {
          console.log("request succeeded with JSON response");
          var features = data.features[0];
          var precinctName = features.attributes.PrecinctName;
          var precinctNumber = features.attributes.PrecinctNumber;

          showResults.innerText = "Found address:";
          showAddress.innerText = fullAddress;
          showPrecinct.innerText = `${precinctName} (${precinctNumber})`;
          showClearButton.hidden = false;

          // handle error from responsePrecinctLookup
        })
        .catch(function (error) {
          showResults.innerText =
            "request failed, can't find precinct for address";
          console.log("request failed", error);
        });

      // handle error from responseAddressLookup
    })
    .catch(function (error) {
      showResults.innerText = "request failed, try another address";
      console.log("request failed", error);
    });

  formEl.reset();
  event.preventDefault();
});
