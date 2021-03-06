const spreadsheetId = '1HMaLArvKqkHUE_6OmMcVahum7sPGAX3JJUlwfCtVoL8'
const sheet = 'Camps'
let map;

fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheet}`)
    .then(res => res.text())
    .then(text => {
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const locationData = json.table.rows;
        const sensibleData = makeDataSensible(locationData);

        addMarkers(sensibleData);
        setNumberOfNights(sensibleData.length);
    })

// Transforms Google Sheet JSON data into an array of location objects
function makeDataSensible(data) {
    let betterData = [];

    for (const dataPoint of data) {
        const d = dataPoint.c;

        const newData = {
            time: d[0].v,
            position: {
                lat: d[1].v,
                lng: d[2].v,
            },
        };

        betterData.push(newData);
    }

    return betterData;
};

// Initialize and add the map
function initMap() {
    // The location of Uluru
    const salmon = { lat: 45.1758, lng: -113.8959 };

    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: salmon,
    });
}

// Iterates over the Google Sheet data and adds each location as a map marker
function addMarkers(locationData) {
    // Add the Markers
    for (const [i, location] of locationData.entries()) {
        const dayNumber = (i + 1).toString();

        new google.maps.Marker({
            position: location.position,
            label: dayNumber,
            map: map,
            title: location.time,
        });
    }
}

// Sets the number of nights in the HTML from Google Sheet data
function setNumberOfNights(numNights) {
    var nightElement = document.getElementById('night-number');
    nightElement.innerHTML = numNights.toString();
}