// Set the dimensions of the canvas / graph
const margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = document.querySelector("#nameDisplay").clientWidth - margin.left - margin.right,
    height = document.querySelector("#nameDisplay").clientHeight - margin.top - margin.bottom;

const svg = d3.select("#nameDisplay")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load CSV data
d3.csv("./data/Journalists Killed between 1992 and 2023.csv").then(data => {
    // Extract names from the CSV data
    const names = data.map(d => d.fullName);

    const shuffledNames = shuffleArray(names);

    // Display names column by column
    displayNames(shuffledNames);
});

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayNames(names) {
    // Set up the grid layout parameters
    const columns = 7; // Adjust the number of columns
    const cellWidth = window.innerWidth / columns;
    const cellHeight = 30; // Adjust the cell height as needed
    const duration = 1200; // Adjust the duration of each animation
    const namesPerGroup = 7; // Adjust the number of names per group

    // Display names in groups
    for (let i = 0; i < names.length; i += namesPerGroup) {
        // Display each name in the group
        for (let j = 0; j < namesPerGroup; j++) {
            const index = i + j;
            if (index < names.length) {
                const col = j;
                const row = Math.floor(i / columns);

                const text = svg.append("text")
                    .attr("x", col * cellWidth + cellWidth / 2)
                    .attr("y", row * cellHeight + cellHeight / 1)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr('fill', '#eeee')
                    .style("font-size", "12px") // Adjust the font size
                    .style("font-family", "Times New Roman, serif") // Set font family
                    .style("text-transform", "uppercase") // Force uppercase
                    .style("opacity", 0)
                    .style("text-shadow", '1px 1px 1px #3333')
                    .text(names[index]);

                // Animate the opacity to make the names appear gradually
                text.transition()
                    .delay(i / namesPerGroup * duration)
                    .duration(duration)
                    .style("opacity", 0.8);
            }
        }
    }
};