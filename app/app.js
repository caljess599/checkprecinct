var formEl = document.getElementById("form");
var displayResultsTable = document.getElementById("resultsTable");
var displayInstructionsTable = document.getElementById("instructTable")
var showClearButton = document.getElementById("clearBtn");
var showNoResults = document.getElementById("noResults");

// precinct addresses
var keyRecAddress = "https://www.google.ca/maps/place/Herman+Key+Jr+Recreation+Center/@38.029573,-78.4760128,17z/data=!4m15!1m8!3m7!1s0x89b386276fb967b7:0xd290d57ff8ec6ea8!2s800+E+Market+St,+Charlottesville,+VA+22902!3b1!8m2!3d38.029573!4d-78.4760128!16s%2Fg%2F11b8v72r_p!3m5!1s0x89b3889e9e13e28b:0x9e3acb2c2f9ee912!8m2!3d38.0297317!4d-78.475941!16s%2Fg%2F1tfqrtwt"
var clarkAddress = "https://www.google.ca/maps/place/Clark+Elementary+School/@38.0227909,-78.4744508,17z/data=!4m15!1m8!3m7!1s0x89b3889ffabe8595:0x175cec21d23c02d!2s1000+Belmont+Ave,+Charlottesville,+VA+22902!3b1!8m2!3d38.0227909!4d-78.4744508!16s%2Fg%2F11bw42lg6l!3m5!1s0x89b3889ff1cc83c7:0x8d48984531f39f8d!8m2!3d38.0227634!4d-78.4743442!16s%2Fm%2F076mjw1"
var carverAddress = "https://www.google.ca/maps/place/Carver+Recreation+Center/@38.0322512,-78.4868992,17z/data=!3m1!5s0x89b3863acc2505bf:0x945732ebb2d10b75!4m15!1m8!3m7!1s0x89b3863ace9cbb4d:0xbeea6151ebcf4132!2s233+4th+St+NW,+Charlottesville,+VA+22903!3b1!8m2!3d38.0322512!4d-78.4868992!16s%2Fg%2F11b8v4m6pj!3m5!1s0x89b386254655169b:0xe9ad5aa72fb34202!8m2!3d38.0321537!4d-78.487004!16s%2Fg%2F1tmqs7h1"
var venableAddress = "https://www.google.ca/maps/place/Venable+Elementary+School/@38.0385172,-78.4965487,17z/data=!4m15!1m8!3m7!1s0x89b3863638a5d70b:0x8bc8e30d018e6323!2s406+14th+St+NW,+Charlottesville,+VA+22903!3b1!8m2!3d38.0385172!4d-78.4965487!16s%2Fg%2F11c43tz15r!3m5!1s0x89b3863638d7ad43:0x258916bd1038a411!8m2!3d38.0385402!4d-78.4966733!16s%2Fm%2F0766mrv"
var jacksonViaAddress = "https://www.google.ca/maps/place/Jackson+Via+Elementary+School/@38.014141,-78.5038972,17z/data=!3m1!4b1!4m6!3m5!1s0x89b3867196f1e3df:0x83890429d3119ca7!8m2!3d38.014141!4d-78.5038972!16s%2Fm%2F076d7bk"
var johnsonAddress = "https://www.google.ca/maps/place/Johnson+Elementary+School/@38.0218941,-78.5062384,17z/data=!4m15!1m8!3m7!1s0x89b386691ec889a9:0x977c62f3d494ff5b!2s1645+Cherry+Ave,+Charlottesville,+VA+22903!3b1!8m2!3d38.0218941!4d-78.5062384!16s%2Fg%2F11c43zqh30!3m5!1s0x89b386691d775a35:0x268fbe8adc3becb3!8m2!3d38.021929!4d-78.506274!16s%2Fm%2F0767syd"
var bufordAddress = "https://www.google.ca/maps/place/Buford+Middle+School/@38.0270168,-78.497917,17z/data=!4m15!1m8!3m7!1s0x89b3863f78bd4d33:0x6d2b786e4b58f3c!2s1000+Cherry+Ave,+Charlottesville,+VA+22903!3b1!8m2!3d38.0270168!4d-78.497917!16s%2Fg%2F11c43ymbp0!3m5!1s0x89b3863f87c61035:0x61367e79b57db7bc!8m2!3d38.0264069!4d-78.4969929!16s%2Fm%2F03cpjz8"
var chsAddress = "https://www.google.ca/maps/place/Charlottesville+High+School/@38.0516655,-78.4746367,17z/data=!4m15!1m8!3m7!1s0x89b388787a8c0d7d:0x362604d7f8b76c1!2s1400+Melbourne+Rd,+Charlottesville,+VA+22901!3b1!8m2!3d38.0516655!4d-78.4746367!16s%2Fg%2F11jl_gxg76!3m5!1s0x89b387d7966dfff1:0xfffb3e9192a14eb!8m2!3d38.0528624!4d-78.4753177!16zL20vMGMxaDQ5"
var walkerAddress = "https://www.google.ca/maps/place/1699+Rose+Hill+Dr,+Charlottesville,+VA+22903/@38.0528895,-78.4859052,16z/data=!3m1!4b1!4m6!3m5!1s0x89b387d08da3aff3:0x1e9233413f22579b!8m2!3d38.0528853!4d-78.4833303!16s%2Fg%2F11cncgf8bh"

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
                precinctLinkedName = `Key Recreation Precinct (<a href="${keyRecAddress}" target="_blank">Google map</a>)</br>Herman Key Recreation Center`
                break;
              case "Summit/Clark":
                precinctLinkedName = `Clark Precinct (<a href="${clarkAddress}" target="_blank">Google map</a>)</br>Summit Elementary School Gym`
                break;
              case "Carver":
                precinctLinkedName = `Carver Precint (<a href="${carverAddress}" target="_blank">Google map</a>)</br>Carver Recreation Center`
                break;
              case "Trailblazer/Venable":
                precinctLinkedName = `Venable Precinct (<a href="${venableAddress}" target="_blank">Google map</a>)</br>Trailblazer Elementary School Gym`
                break;
              case "Jackson-Via":
                precinctLinkedName = `Jackson-Via Precinct (<a href="${jacksonViaAddress}" target="_blank">Google map</a>)</br>Jackson-Via Elementary School`
                break;
              case "Johnson":
                precinctLinkedName = `Johnson Precinct (<a href="${johnsonAddress}" target="_blank">Google map</a>)</br>Johnson Elementary School Cafeteria`
                break;
              case "Buford":
                precinctLinkedName = `Buford Precinct (<a href="${bufordAddress}" target="_blank">Google map</a>)</br>Buford Middle School Media Center`
                break;
              case "CHS":
                precinctLinkedName = `Charlottesville High Precinct (<a href="${chsAddress}" target="_blank">Google map</a>)</br>Charlottesville High School Cafeteria`
                break;
              case "Walker":
                precinctLinkedName = `Walker Precinct (<a href="${walkerAddress}" target="_blank">Google map</a>)</br>Walker Upper Elementary School Gym`
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
