var formEl = document.getElementById("form");
var displayResultsTable = document.getElementById("resultsTable");
var displayInstructionsTable = document.getElementById("instructTable")
var showClearButton = document.getElementById("clearBtn");
var showNoResults = document.getElementById("noResults");

// precinct addresses
var keyRecAddress = "https://www.google.ca/maps/place/Herman+Key+Jr+Recreation+Center/@38.029573,-78.4760128,17z/data=!4m15!1m8!3m7!1s0x89b386276fb967b7:0xd290d57ff8ec6ea8!2s800+E+Market+St,+Charlottesville,+VA+22902!3b1!8m2!3d38.029573!4d-78.4760128!16s%2Fg%2F11b8v72r_p!3m5!1s0x89b3889e9e13e28b:0x9e3acb2c2f9ee912!8m2!3d38.0297317!4d-78.475941!16s%2Fg%2F1tfqrtwt"
var summitAddress = "https://www.google.ca/maps/place/Summit+Elementary+School+(formerly+Clark)/@38.0227909,-78.4744508,17z/data=!4m15!1m8!3m7!1s0x89b3889ffabe8595:0x175cec21d23c02d!2s1000+Belmont+Ave,+Charlottesville,+VA+22902!3b1!8m2!3d38.0227909!4d-78.4744508!16s%2Fg%2F11bw42lg6l!3m5!1s0x89b3889ff1cc83c7:0x8d48984531f39f8d!8m2!3d38.0227634!4d-78.4743442!16s%2Fm%2F076mjw1"
var carverAddress = "https://www.google.ca/maps/place/Carver+Recreation+Center/@38.0322512,-78.4868992,17z/data=!3m1!5s0x89b3863acc2505bf:0x945732ebb2d10b75!4m15!1m8!3m7!1s0x89b3863ace9cbb4d:0xbeea6151ebcf4132!2s233+4th+St+NW,+Charlottesville,+VA+22903!3b1!8m2!3d38.0322512!4d-78.4868992!16s%2Fg%2F11b8v4m6pj!3m5!1s0x89b386254655169b:0xe9ad5aa72fb34202!8m2!3d38.0321537!4d-78.487004!16s%2Fg%2F1tmqs7h1"
var trailblazerAddress = "https://www.google.ca/maps/place/Trailblazer+Elementary+School+(formerly+Venable)/@38.0385172,-78.4965487,17z/data=!4m15!1m8!3m7!1s0x89b3863638a5d70b:0x8bc8e30d018e6323!2s406+14th+St+NW,+Charlottesville,+VA+22903!3b1!8m2!3d38.0385326!4d-78.4965365!16s%2Fg%2F11c43tz15r!3m5!1s0x89b3863638d7ad43:0x258916bd1038a411!8m2!3d38.0385402!4d-78.4966733!16s%2Fm%2F0766mrv"
var jacksonViaAddress = "https://www.google.ca/maps/place/Jackson+Via+Elementary+School/@38.014141,-78.5038972,17z/data=!3m1!4b1!4m6!3m5!1s0x89b3867196f1e3df:0x83890429d3119ca7!8m2!3d38.014141!4d-78.5038972!16s%2Fm%2F076d7bk"
var talloaksAddress = "https://www.google.ca/maps/place/Johnson+Elementary+School/@38.0218941,-78.5062384,17z/data=!4m15!1m8!3m7!1s0x89b386691ec889a9:0x977c62f3d494ff5b!2s1645+Cherry+Ave,+Charlottesville,+VA+22903!3b1!8m2!3d38.0218941!4d-78.5062384!16s%2Fg%2F11c43zqh30!3m5!1s0x89b386691d775a35:0x268fbe8adc3becb3!8m2!3d38.021929!4d-78.506274!16s%2Fm%2F0767syd"
var cvillemiddleschoolAddress = "https://www.google.ca/maps/place/Charlottesville+Middle+School/@38.0263308,-78.5157362,15z/data=!4m10!1m2!2m1!1scharlottesville+middle+school!3m6!1s0x89b3872cb3f036d3:0xf43ae619cdb54767!8m2!3d38.0263308!4d-78.4966818!15sCh1jaGFybG90dGVzdmlsbGUgbWlkZGxlIHNjaG9vbJIBDW1pZGRsZV9zY2hvb2zgAQA!16s%2Fg%2F11xsf5ffnp?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
var chsAddress = "https://www.google.ca/maps/place/Charlottesville+High+School/@38.0516655,-78.4746367,17z/data=!4m15!1m8!3m7!1s0x89b388787a8c0d7d:0x362604d7f8b76c1!2s1400+Melbourne+Rd,+Charlottesville,+VA+22901!3b1!8m2!3d38.0516655!4d-78.4746367!16s%2Fg%2F11jl_gxg76!3m5!1s0x89b387d7966dfff1:0xfffb3e9192a14eb!8m2!3d38.0528624!4d-78.4753177!16zL20vMGMxaDQ5"
var walkerAddress = "https://www.google.ca/maps/place/1699+Rose+Hill+Dr,+Charlottesville,+VA+22903/@38.0528895,-78.4859052,16z/data=!3m1!4b1!4m6!3m5!1s0x89b387d08da3aff3:0x1e9233413f22579b!8m2!3d38.0528853!4d-78.4833303!16s%2Fg%2F11cncgf8bh"
// end old vars

//begin new code

const layer76Url = "https://gisweb.charlottesville.org/cvgisweb/rest/services/OpenData_1/MapServer/76/query";
const addressInput = document.getElementById('address-input');
const suggestionsList = document.getElementById('suggestions-list');

// 1. Debounce function (prevents spamming the server)
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 2. Fetch function
async function fetchSuggestions(query) {
    if (!query || query.length < 2) {
        suggestionsList.innerHTML = '';
        return; 
    }

    // 1. Clean the input and split it into an array of words/numbers
    // The regular expression /\s+/ splits by one or more spaces
    const tokens = query.trim().split(/\s+/);

    // 2. Map each token into its own LIKE clause
    const sqlClauses = tokens.map(token => {
        // We strip out any single quotes the user might type (like in "O'Neill") 
        // to prevent SQL syntax errors
        const safeToken = token.replace(/'/g, '');
        return `UPPER(FullAddress) LIKE UPPER('%${safeToken}%')`;
    });

    // 3. Join them all together with AND
    const dynamicWhereClause = sqlClauses.join(' AND ');

    const params = new URLSearchParams({
        f: 'json',
        outFields: 'FullAddress',
        outSR: '4326',
        returnGeometry: 'true',
        resultRecordCount: '10', // Bumped to 10 to give a little more room for multi-unit buildings
        where: dynamicWhereClause
    });

    const fullUrl = `${layer76Url}?${params}`;
    console.log("Tokenized Query:", dynamicWhereClause); // Watch it build the query as you type!

    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            displaySuggestions(data.features);
        } else {
            suggestionsList.innerHTML = '<li>No matches found</li>'; 
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}

// 3. Display function
function displaySuggestions(features) {
    suggestionsList.innerHTML = ''; 

    features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature.attributes.FullAddress; 
        
      // Look up the address the user has selected
      li.addEventListener('click', async () => {
    
      // 1. Fill the input field and hide the dropdown
      document.getElementById('address-input').value = feature.attributes.FullAddress;
      suggestionsList.innerHTML = ''; 
    
    // 2. Grab the hidden coordinates
    const x = feature.geometry.x;
    const y = feature.geometry.y;
    
    console.log(`Looking up precinct for coordinates: ${x}, ${y}...`);
    
    // 3. Call your new function (using await because it's an API call)
    const precinctName = await getPrecinctName(x, y);
    
    if (precinctName) {
        console.log("Found Precinct:", precinctName);
        
        var precinctLinkedName = `${precinctName}`
        switch (precinctName) {
          case "Key Recreation":
            precinctLinkedName = `Key Recreation Precinct (<a href="${keyRecAddress}" target="_blank">Google map</a>)</br>Herman Key Recreation Center`
            break;
          case "Summit/Clark":
            precinctLinkedName = `Summit Precinct (<a href="${summitAddress}" target="_blank">Google map</a>)</br>Summit Elementary School Gym`
            break;
          case "Carver":
            precinctLinkedName = `Carver Precinct (<a href="${carverAddress}" target="_blank">Google map</a>)</br>Carver Recreation Center`
            break;
          case "Trailblazer/Venable":
            precinctLinkedName = `Trailblazer Precinct (<a href="${trailblazerAddress}" target="_blank">Google map</a>)</br>Trailblazer Elementary School Gym`
            break;
          case "Jackson-Via":
            precinctLinkedName = `Jackson-Via Precinct (<a href="${jacksonViaAddress}" target="_blank">Google map</a>)</br>Jackson-Via Elementary School`
            break;
          case "Tall Oaks/Johnson":
            precinctLinkedName = `Tall Oaks Precinct (formerly Johnson) (<a href="${talloaksAddress}" target="_blank">Google map</a>)</br>Tall Oaks Elementary School Cafeteria`
            break;
          case "CMS/Buford":
            precinctLinkedName = `Charlottesville Middle School Precinct (formerly Buford) (<a href="${cvillemiddleschoolAddress}" target="_blank">Google map</a>)</br>Charlottesville Middle School Media Center`
            break;
          case "CHS":
            precinctLinkedName = `Charlottesville High School Precinct (<a href="${chsAddress}" target="_blank">Google map</a>)</br>Charlottesville High School Cafeteria`
            break;
          case "Walker":
            precinctLinkedName = `Walker Precinct (<a href="${walkerAddress}" target="_blank">Google map</a>)</br>Walker Upper Elementary School Gym`
            break;
          default:
            precinctLinkedName = `${precinctName}`
        };

        // 4. Populate the table cells with the data
        document.getElementById('display-address').textContent = feature.attributes.FullAddress;
        document.getElementById('display-precinct').innerHTML = precinctLinkedName;
        
        // 4. Reveal the table!
        document.getElementById('results-container').style.display = 'block';
    } else {
        alert("Sorry, we couldn't find a Charlottesville precinct for that address.");
    }  
});

        suggestionsList.appendChild(li);
    });
}

// 4. The Event Listener
if (addressInput) {
    addressInput.addEventListener('input', debounce((e) => {
        console.log("1. User typed:", e.target.value); // Tracker
        fetchSuggestions(e.target.value);
    }, 300));
} else {
    console.error("CRITICAL ERROR: Could not find the input field in the HTML.");
}


document.addEventListener('click', function(event) {
    const wrapper = document.querySelector('.autocomplete-wrapper');
    const suggestionsList = document.getElementById('suggestions-list');
    
    // If the click was NOT inside our wrapper, clear the list
    if (wrapper && !wrapper.contains(event.target)) {
        suggestionsList.innerHTML = '';
    }
});

// async function to get the Precinct Name from the selected address

async function getPrecinctName(x, y) {
    // Using your established Layer 12 endpoint
    const precinctLayerUrl = "https://gisweb.charlottesville.org/arcgis/rest/services/OpenData_1/MapServer/12/query";

    const params = new URLSearchParams({
        f: 'json',
        geometry: `${x},${y}`,
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*', // Or specify the exact field you mapped previously, e.g., 'Precinct'
        returnGeometry: 'false'
    });

    try {
        const response = await fetch(`${precinctLayerUrl}?${params}`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const attributes = data.features[0].attributes;
            console.log("Layer 12 Precinct data returned:", attributes);
            
            // Adjust this to match whatever field name Layer 12 uses
            return attributes.PrecinctName; 
        } else {
            console.warn("Address is outside Charlottesville city limits / no precinct found.");
            return null; 
        }
    } catch (error) {
        console.error('Error fetching precinct:', error);
        return null;
    }
}
