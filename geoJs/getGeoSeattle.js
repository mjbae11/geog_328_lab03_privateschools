// access to mapbox API
mapboxgl.accessToken = 'pk.eyJ1IjoibWpiYWUxMSIsImEiOiJjbGp3OGRuMHUwYmV0M2twZmJscWwxZHlpIn0.0SDusUkb8Bvmn_NkOseR3w';

// Map of seattle is placed in the center
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-122.3, 47.6],
    zoom: 10
});

let schools, seattle, table;

// fetches both geoJson data
async function geojsonFetch() {
    let response;
    response = await fetch('assets/Private_Schools_Seattle.geojson');
    schools = await response.json();
    response = await fetch('assets/zip-codes.geojson');
    seattle = await response.json();
};

geojsonFetch();


//load data to the map as new layers and table on the side.
map.on('load', function loadingData() {

    map.addSource('seattle', {
        type: 'geojson',
        data: seattle
    });

    map.addLayer({
        'id': 'seattle-layer',
        'type': 'fill',
        'source': 'seattle',
        'paint': {
            'fill-color': '#C3ECB2', // blue color fill
            'fill-opacity': 0.5
        }
    });
    
    map.addSource('schools', {
        type: 'geojson',
        data: schools
    });

    map.addLayer({
        'id': 'schools-layer',
        'type': 'circle',
        'source': 'schools',
        'paint': {
            'circle-radius': 4,
            'circle-stroke-width': 2,
            'circle-color': '#BF40BF',
            'circle-stroke-color': 'black'
        }
    });


    

    // GENERATING THE TABLE

    // selects the table element in the html page
    table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3;
    for (let i = 0; i < schools.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell1.innerHTML = schools.features[i].properties.OBJECTID;
        cell2.innerHTML = schools.features[i].properties.SCHOOL_ZIP;
        cell3.innerHTML = schools.features[i].properties.SCHOOL_WEBSITE;
    }
});



//sort the table
let btn = document.getElementsByTagName("button")[0];

btn.addEventListener('click', sortTable);


// define the function to sort table
function sortTable(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            //check if the two rows should switch place:
            if (x < y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// Toggle visibility of the side panel based on window width
function toggleSidePanel() {
    const sidePanel = document.getElementById('side-panel');
    if (window.innerWidth < 1024) {
        sidePanel.style.display = 'none';
    } else {
        sidePanel.style.display = 'block';
    }
}

// Event listener to toggle the side panel on page load and resize
window.addEventListener('DOMContentLoaded', toggleSidePanel);
window.addEventListener('resize', toggleSidePanel);