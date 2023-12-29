var formEl = document.getElementById("form");
var displayTable = document.getElementById("resultsTable");
var showClearButton = document.getElementById("clearBtn");

document.getElementById("clearBtn").addEventListener("click", function () {
  // hide the table
  showClearButton.hidden = true;
  displayTable.hidden = true;
});

formEl.addEventListener("submit", function (event) {
  var placeholder = document.getElementById("data-output");

  var output = "";
  var formData = new FormData(event.target);
  var address = {};
  formData.forEach(function (value, key) {
    address[key] = value;
  });

  console.log("Address data", address);

  var street_num = address.street_num;

  // alert if street number is blank

  // we need to handle 9 1/2 (and probably a lot of other exceptions, too)
  var street_name = address.street_name.toUpperCase();
  //var street_name = address.street_name.toUpperCase().split(" ")[0];

  // first API call; return JSON object
  const urlOuter = `https://gisweb.charlottesville.org/cvgisweb/rest/services/OpenData_1/MapServer/76/query?where=StreetName%20%3D%20'${street_name}'%20AND%20StreetNumber%20%3D%20'${street_num}'&outFields=FullAddress&outSR=4326&f=json`;

  let urlInner = "";

  const firstPromise = fetch(urlOuter)
    .then((responseO) => responseO.json())
    .then((responseBodyO) => {
      return responseBodyO.features;
    })
    .catch((err) => {
      console.error("Failed to fetch - " + urlOuter);
      console.error(err);
    });

  firstPromise.then((addresses) => {
    console.log("First promise:");
    console.log(addresses);
    let precinctLookups = addresses.map((address) => {
      // var address = addresses[0]
      var fullAddress = address.attributes.FullAddress;
      var geometry = address.geometry;
      var geox = geometry.x;
      var geoy = geometry.y;
      urlInner = `https://gisweb.charlottesville.org/arcgis/rest/services/OpenData_1/MapServer/12/query?where=1%3D1&outFields=PrecinctName,PrecinctNumber&geometry=${geox},${geoy},${geox},${geoy}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outSR=4326&f=json`;
      return fetch(urlInner)
        .then((responseI) => responseI.json())
        .then((responseBodyI) => {
          console.log("Making inner request:");
          var precinctDetails = responseBodyI.features[0];
          var precinctName = precinctDetails.attributes.PrecinctName;
          var precinctNumber = precinctDetails.attributes.PrecinctNumber;
          var precinct = `${precinctName} (${precinctNumber})`;
          address.attributes.Precinct = precinct;
          console.log("I'm going to return:");
          console.log(address);
          return address;
        })
        .catch((err) => {
          console.error("Failed to fetch - " + urlInner);
          console.error(err);
        });
    }); // end map loop
    Promise.all(precinctLookups).then((addresses) => {
      // All the 'return' operations will be executed when the .then is executed
      console.log("All the promises have been executed here:");
      console.log(addresses);
      let outputLoop = addresses.map((address) => {
        output += `
          <tr>
            <td> ${address.attributes.FullAddress}</td>
            <td> ${address.attributes.Precinct}<td>
          </tr>`;
      });

      displayTable.hidden = false;
      placeholder.innerHTML = output;
      showClearButton.hidden = false;
      return outputLoop;
    });
    console.log("Output out here");
  });
  formEl.reset();
  event.preventDefault();
});
