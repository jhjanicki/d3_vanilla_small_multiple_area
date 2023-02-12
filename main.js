const scaleFactor = 4;

let width = 1920 / scaleFactor;
let height = 1080 / scaleFactor;

const margin = {
    "top":(40+ 84) / scaleFactor,
    "left": (130 + 84) / scaleFactor,
    "bottom": (110 + 84) / scaleFactor,
    "right": 84 / scaleFactor
}

//group data
const regions = d3.group(data, d => d.area)

const xScale = d3.scaleLinear()
    .domain(d3.extent(data,d=>d.year))
    .range([0, width - margin.left - margin.right])

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.population_thousand)]) //use pop thousand otherwise hard to fit y axis labels
    .range([height - margin.bottom, 0]);

let xAxis = d3.axisBottom(xScale).tickFormat(d => d);
let yAxis = d3.axisLeft(yScale).ticks(5);

// Create an area generator
const areaGenerator = d3.area()
    .x(d=>xScale(d.year))
    .y0(yScale(0))
    .y1(d=>yScale(d.population_thousand))

const texture = textures
    .lines()
    .size(4)
    .strokeWidth(1)
    .stroke("#e34a33");
  
//Create an svg for each region
regions.forEach(function (region,key) {

    //to create a before / after area chart...
    const estimate = region.filter(d => d.year <= 2022)
    const projection = region.filter(d => d.year>=2022)

    //svg
    const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    svg.call(texture);

    if(key==="AFRICA"){ //first one add text to clarify unit
        svg.append("text").attr("x",width-20).attr("y",40).attr("text-anchor","end").attr("font-size",12).text("(unit: thousands)")
    }

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    //create two separate area charts
    g.append("path")
        .datum(estimate)
        .attr("fill", "#e34a33")
        .attr("d", areaGenerator)

    g.append("path")
        .datum(projection)
        .attr("fill", texture.url())
        .attr("d", areaGenerator)

    g.append("text")
        .attr("x",10)
        .attr("y",0)
        .attr("fill","black")
        .style("font-weight",700)
        .text(region[0].area)
})
