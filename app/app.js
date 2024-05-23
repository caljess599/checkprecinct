var formEl = document.getElementById("form");
var displayResultsTable = document.getElementById("resultsTable");
var displayInstructionsTable = document.getElementById("instructTable")
var showClearButton = document.getElementById("clearBtn");
var showNoResults = document.getElementById("noResults");

// precinct addresses
var clarkAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Clark%20Precinct%20(102)%20%2D%20Clark%20Elementary%20School%20Gym%20%2D%C2%A0"
var keyRecAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Key%20Recreation%20Precinct%20(101)%20%2D%20Herman%20Key%20Recreation%20Center"
var carverAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Carver%20Precinct%20(201)%20%2D%20Carver%20Recreation%20Center"
var venableAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Venable%20Precinct%20(202)%20%2D%20Venable%20Elementary%20School%20Gym%C2%A0"
var jacksonViaAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Jackson%2DVia%20(301)%20%2D%20Jackson%2DVia%20Elementary%20School%C2%A0"
var johnsonAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Johnson%20Precinct%20(302)%20%2D%20Johnson%20Elementary%20School%20Cafeteria"
var bufordAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Buford%20Precinct%20(303)%20%C2%A0%2D%20Buford%20Middle%20School%20Media%20Center"
var chsAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Charlottesville%20High%20Precinct%20(401)%20%2D%20Charlottesville%20High%20School%20Cafeteria%C2%A0"
var walkerAddress = "https://www.charlottesville.gov/454/Polling-Places#:~:text=Walker%20Precinct%20(402)%20%2D%20Walker%20Upper%20Elementary%20School%20Gym"

document.getElementById("clearBtn").addEventListener("click", function() {
  // hide the table
  showClearButton.hidden = true;
  displayResultsTable.hidden = true;
});

formEl.addEventListener("submit", function(event) {
  var tableResults = document.getElementById("data-output");
  var output = "";
  var formData = new FormData(event.target);
  var address = {};
  formData.forEach(function(value, key) {
    address[key] = value;
  });

  //console.log("Address data", address);

  var street_num = address.street_num;
  // TO DO alert if street number is blank
  var street_name = address.street_name.toUpperCase();

  // first API call
  const urlOuter = `https://gisweb.charlottesville.org/cvgisweb/rest/services/OpenData_1/MapServer/76/query?where=StreetName%20%3D%20'${street_name}'%20AND%20StreetNumber%20%3D%20'${street_num}'&outFields=FullAddress&outSR=4326&f=json`;
  let urlInner = "";

  const addressLookup = fetch(urlOuter)
    .then((responseO) => responseO.json())
    .then((responseBodyO) => {
      return responseBodyO.features;
    })
    .catch((err) => {
      console.error("Failed to fetch - " + urlOuter);
      console.error(err);
    });

  // call the initial address lookup
  addressLookup.then((addresses) => {
    // define the function that will lookup the precinct for each address
    let precinctLookups = addresses.map((address) => {
      var geometry = address.geometry;
      var geox = geometry.x;
      var geoy = geometry.y;
      urlInner = `https://gisweb.charlottesville.org/arcgis/rest/services/OpenData_1/MapServer/12/query?where=1%3D1&outFields=PrecinctName,PrecinctNumber&geometry=${geox},${geoy},${geox},${geoy}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outSR=4326&f=json`;
      return fetch(urlInner)
        .then((responseI) => responseI.json())
        .then((responseBodyI) => {
          var precinctDetails = responseBodyI.features[0];
          var precinctName = precinctDetails.attributes.PrecinctName;
          //var precinctNumber = precinctDetails.attributes.PrecinctNumber;
          //var precinct = `${precinctName} (${precinctNumber})`;
          var precinctLinkedName = `${precinctName}`
            switch (precinctName) {
              case "Key Recreation":
                precinctLinkedName = `<a href="${keyRecAddress}" target="_blank">Key Recreation Precinct</a></br>Herman Key Recreation Center`
                break;
              case "Clark":
                precinctLinkedName = `<a href="${clarkAddress}" target="_blank">Clark Precinct</a>`
                break;
              case "Carver":
                precinctLinkedName = `<a href="${carverAddress}" target="_blank">Carver Precinct</a>`
                break;
              case "Venable":
                precinctLinkedName = `<a href="${venableAddress}" target="_blank">Venable Precinct</a>`
                break;
              case "Jackson-Via":
                precinctLinkedName = `<a href="${jacksonViaAddress}" target="_blank">Jackson-Via Precinct</a>`
                break;
              case "Johnson":
                precinctLinkedName = `<a href="${johnsonAddress}" target="_blank">Johnson Precinct</a>`
                break;
              case "Buford":
                precinctLinkedName = `<a href="${bufordAddress}" target="_blank">Buford Precinct</a>`
                break;
              case "CHS":
                precinctLinkedName = `<a href="${chsAddress}" target="_blank">Charlottesville High Precinct</a>`
                break;
              case "Walker":
                precinctLinkedName = `<a href="${walkerAddress}" target="_blank">Walker Precinct</a>`
                break;
              default:
                precinctLinkedName = `${precinctName}`
            }

          // add the precinct to the existing attributes array
          address.attributes.Precinct = precinctLinkedName;
          return address;
        })
        .catch((err) => {
          console.error("Failed to fetch - " + urlInner);
          console.error(err);
        });
    }); // end map loop

    // Now call precinctLookups wth Promise.all
    // The promises are al completed before .then is called here
    Promise.all(precinctLookups).then((addresses) => {
      // use another loop to create the display table
      if (addresses.length > 0) {
        let outputLoop = addresses.map((address) => {
          output += `
              <tr>
                <td>${address.attributes.FullAddress}</td>
                <td>${address.attributes.Precinct}</td>
              </tr>`;
        });
        displayResultsTable.hidden = false;
        tableResults.innerHTML = output;
        showNoResults.innerHTML = "";
        showClearButton.hidden = false;
      } else {
        output = `
          	<p>No match found for ${street_num} ${street_name}</p>
           	`;
        showNoResults.innerHTML = output;
        showClearButton.hidden = true;
      } // end if statement for addresses length
      return outputLoop;
    });
  });
  formEl.reset();
  event.preventDefault();
});
