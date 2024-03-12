//   Register to get your Mapbox access token https://docs.mapbox.com/help/glossary/access-token/
//   Code from https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/ 

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5keTkxMDYxNCIsImEiOiJjbG5heGQ0YnAwN2hoMmxvMm1rbjR5aW9jIn0.HD5O5lWSWsJUMfKkW-WDaQ'

const bounds = [
    [-160, -38], // Southwest coordinates, 
    [180, 67] // Northeast coordinates, 
];

// https://www.mapbox.com/mapbox-gl-js/api/#map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',  // try your own, i.e. mapbox://styles/sauter/cksi9buw56sk918mkg9c58qjf
    center: [18.2812, 9.1021], // 9.1021° N, 18.2812° E
    zoom: 0,
    minZoom: 0,
    maxZoom: 5, // Set the maximum allowed zoom level
    maxBounds: bounds,
    pitch: 60,
})

const year = document.querySelector(".year")

const spike = (length, width = 7) => `M${-width / 2},0L0,${-length}L${width / 2},0`;

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


map.on('load', function () {
    // Initialize the SVG
    let svg = d3.select('#map').append('svg')
        .attr('width', map._container.clientWidth)
        .attr('height', map._container.clientHeight)
        .style('position', 'absolute');

    // Create a drop shadow filter
    svg.append('defs')
        .append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%')
        .append('feDropShadow')
        .attr('dx', 0)
        .attr('dy', 4)
        .attr('stdDeviation', 4)
        .attr('flood-color', 'rgba(0, 0, 0, 0.6)');

    // Add new source and layer
    map.addSource("polygon", {
        type: 'geojson',
        data: {
            type: "FeatureCollection",
            features: []
        },
    });

    map.addLayer({
        id: "polygon",
        type: 'fill',
        source: "polygon",
        layout: {},
        paint: {
            'fill-color': [
                'step',
                ['to-number', ['get', 'Score']],
                '#720026',
                50,
                '#d52941',
                60,
                '#fcd581',
                70,
                '#fff8e8',
                80,
                '#ffffff',
            ],
            'fill-opacity': 0.5,
        },
    });

    map.addLayer({
        id: "taiwan",
        type: 'fill',
        source: "taiwan",
        layout: {},
        paint: {
            'fill-color': '#ffffff',
            'fill-opacity': 0.6,
        },
    });


    d3.json('./vector/worldmap_centroid_deathyearcount.geojson')
        .then((geojson) => {

            let filteredYear = 0
            // Add slider
            const slider = document.getElementById('slider');
            // const sliderValue = document.getElementById('slider-value');


            // slider.style.opacity = 0
            // slider.style.opacity = 1
            slider.setAttribute('type', 'range');
            slider.setAttribute('min', '2013');
            slider.setAttribute('max', '2023');
            slider.setAttribute('step', '1');
            slider.setAttribute('value', '2013');

            updateDeath(filteredYear);

            slider.addEventListener('input', function () {
                filteredYear = parseInt(this.value);
                // sliderValue.innerHTML = yearToFilter; // or sliderValue.textContent = yearToFilter;
                year.innerHTML = this.value
                map.getSource("polygon").setData(`./vector/worldmap_freeIndex_${filteredYear}.geojson`)
                map.getSource("taiwan").setData(`./vector/taiwan.geojson`)
                updateDeath(filteredYear);
  

            });

            function updateDeath(year) {

                // Filter data for a specific year 
                let filteredData = geojson.features.filter(d => d.properties.year === year);

                // Define the projection function using Mapbox GL JS
                function projectPoint(lon, lat) {
                    let point = map.project(new mapboxgl.LngLat(lon, lat));
                    return [point.x, point.y];
                }


                // Remove existing SVG overlay
                svg.selectAll('*').remove();

                svg.selectAll('path')
                    .data(filteredData)
                    .enter()
                    .append('path')
                    .attr('transform', d => `translate(${projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1])})`)
                    .attr('d', d => spike((d.properties.counts) * 8))
                    .attr('fill', 'lightgrey')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 0.85)
                    .attr('fill-opacity', 0.85)
                    .style('filter', 'url(#drop-shadow)')
                    .on('mouseover', function (event, d) {
                        const tooltipText = `${d.properties.country}, ${d.properties.counts} death`;

                        // Show tooltip
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);

                        tooltip.html(tooltipText)
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on('mouseout', function () {
                        // Hide tooltip
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                ;
            }

            map.on('render', function () {
                updateDeath(filteredYear)
                // Reposition the SVG overlay when the map is resized
                map.on('resize', function () {
                    d3.select('#map svg')
                        .attr('width', map._container.clientWidth)
                        .attr('height', map._container.clientHeight);
                });
            })

        })
    map.addControl(new mapboxgl.NavigationControl());
});