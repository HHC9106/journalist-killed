// Set the dimensions of the canvas / graph
const margin = { top: 30, right: 20, bottom: 70, left: 35 },
    width = document.querySelector("#linechart").clientWidth - margin.left - margin.right,
    height = document.querySelector("#linechart").clientHeight - margin.top - margin.bottom;

const color = d3.scaleOrdinal(d3.schemeCategory10);

const countryDomain = ['Syria', 'Philippines', 'Iraq', 'Mexico', 'Pakistan', 'Colombia', 'India', 'Somalia', 'Russia', 'Afghanistan',
    'Israel and the Occupied Palestinian Territory', 'Brazil', 'Algeria', 'Honduras', 'Ukraine'];

const countryColors = {
    'Iraq': '#1f77b4',
    'Philippines': '#ff7f0e',
    'Syria': '#2ca02c',
    'Mexico': '#d62728',
    'Pakistan': '#9467bd',
    'Colombia': '#8c564b',
    'India': '#e377c2',
    'Somalia': '#7f7f7f',
    'Russia': '#bcbd22',
    'Afghanistan': '#17becf',
    'Israel and the Occupied Palestinian Territory': '#ff9896',
    'Brazil': '#aec7e8',
    'Algeria': '#ffbb78',
    'Honduras': '#98df8a',
    'Ukraine': '#c5b0d5'
};

const CountryCategoricalScale = d3.scaleOrdinal()
    .domain(countryDomain)
    .range(countryDomain.map(country => countryColors[country]));
// add designated color into range  

// Parse the date / time
var parseDate = d3.timeParse("%Y");

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var countsline = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.counts); });

// Adds the svg canvas
var svg = d3.select("#linechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Create a text element for displaying the country name
var countryName = svg.append("text")
    .attr("class", "country-name")
    .attr("x", 10)  // Adjust the x-coordinate as needed
    .attr("y", 10)  // Adjust the y-coordinate as needed
    .style("font-size", "14px")
    .style("fill", () => {
        // Use the color scale for the fill color
        return CountryCategoricalScale(countryDomain[0]); // Adjust as needed based on your initial country
    });

// Create a tooltip div
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// Function to create lines
function createLines(dataNest) {
    return svg.selectAll(".line")
        .data(dataNest)
        .enter().append("path")
        .attr("class", "line")
        .style("stroke", d => {
            if (countryDomain.includes(d.key)) {
                return CountryCategoricalScale(d.key);
            } else {
                return "darkgrey";
            }
        })
        .style("opacity", 0) // Set initial opacity
        .attr("d", d => countsline(d.value)) // Initial path without transition
        .each(function (d) {
            const totalLength = this.getTotalLength();
            d3.select(this)
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength);
        });
}

// Function to handle mouseover
function handleMouseOver(event, d) {
    const currentCountry = d.key;
    const countryColor = CountryCategoricalScale(currentCountry);

    // Show tooltip only for a specific country (e.g., Iraq)
    if (currentCountry === 'Philippines') {
        d3.select(this).transition()
            .duration(200)
            .style("opacity", 1)
            .style("padding", "30px");

        tooltip.transition()
        .duration(200)
        .style("opacity", 0.7);

        tooltip.html(`
        <strong>${currentCountry}</strong>
        <br>
        <img src="./image/2022_philippines_journalist_memorial.jpg" alt="${currentCountry}" width="400">
        <br>
        <em>Philippines Swiftly Investigates Journalists Killing</em>`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("color", countryColor);
    } else if (currentCountry === 'Syria') {
        d3.select(this).transition()
            .duration(200)
            .style("opacity", 1)
            .style("padding", "30px");
            
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.7);

        tooltip.html(`
    <strong>${currentCountry}</strong>
    <br>
    <img src="./image/syria_killed.jpg" alt="${currentCountry}" width="400">
    <br>
    <em>Two Western Journalists Killed in Syria Shelling</em>`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("color", countryColor);
    } else {
        d3.select(this).transition()
            .duration(200)
            .style("opacity", 1)
            .style("padding", "30px");

        tooltip.transition()
            .duration(200)
            .style("opacity", .7)
            .text(d.key)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("color", () => {
                if (countryDomain.includes(d.key)) {
                    return CountryCategoricalScale(d.key);
                } else {
                    return "grey";
                }
            });
    }
}
// Function to handle mouseout
function handleMouseOut() {
    d3.select(this).transition()
        .duration(500)
        .style("opacity", 0.7);

    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

// function animateLines(lines) {
//     lines.transition()
//         .duration(6000)
//         .style("opacity",d => d.key === 'Syria' ?.4 :0)
//         .attr("stroke-dashoffset", 0);
// }

function animateLines(lines, currentIndex) {
    const currentCountry = countryDomain[currentIndex];
    const currentLine = lines.filter(d => d.key === currentCountry);

    // Update the displayed country name and fill color
    countryName
        .text(currentCountry)
        .style("fill", () => {
            if (countryDomain.includes(currentCountry)) {
                return CountryCategoricalScale(currentCountry);
            } else {
                return "lightgrey";
            }
        });;

    currentLine.transition()
        .duration(3000)
        .style("opacity", 0.8)
        .attr("stroke-dashoffset", 0)
        .on("end", function () {
            // Schedule the next line to be animated after a delay
            if (currentIndex < countryDomain.length - 1) {
                setTimeout(() => animateLines(lines, currentIndex + 1), 1000); // Adjust the delay as needed
            } else {
                countryName.text("");

                const linesNotInDomain = lines.filter(d => !countryDomain.includes(d.key));
                linesNotInDomain.transition()
                    .duration(3000)
                    .style("opacity", 0.8)
                    .attr("stroke-dashoffset", 0)
            }
        });
}

// Get the data
d3.csv("./data/linechart_journalist.csv").then(function (data) {
    data.forEach(function (d) {
        d.year = parseDate(d.year);
        d.counts = +d.counts;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) { return d.counts; })]);

    // Group the entries by symbol
    const dataNest = Array.from(
        d3.group(data, d => d.country), ([key, value]) => ({ key, value })
    );

    // console.log(dataNest);
    // Create lines
    const lines = createLines(dataNest);

    const legendSpace = width / dataNest.length; // spacing for the legend

    // Add mouseover and mouseout events
    lines.on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    // Animate lines
    animateLines(lines, 0);

    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("color", "#eee");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("color", "#eee");
})