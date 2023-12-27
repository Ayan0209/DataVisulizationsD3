const width = 1350;
const height = 1000;
const margin = { top: 50, right: 60, bottom: 50, left: 150 };

const attributeOptions = [
  "BirthRate",
  "DeathRate",
  "LifeExpectancy",
  "PopulationGrowth",
  "TotalPopulation",
  "MobileCellSubs",
  "TelephoneLines",
  "AgriculturalLand",
  "RuralPopulation",
  "RuralPopulationGrowth",
  "SurfaceArea",
  "UrbanPopulationPercent",
];

const boxPlotAttributes = [
  "BirthRate",
  "DeathRate",
  "LifeExpectancy",
  "PopulationGrowth",
  "TotalPopulation",
  "MobileCellSubs",
  "TelephoneLines",
  "AgriculturalLand",
  "RuralPopulation",
  "RuralPopulationGrowth",
  "SurfaceArea",
  "UrbanPopulationPercent",
];

// Populate the attribute dropdown
const attributeDropdown = d3.select("#attribute-dropdown");

attributeDropdown
  .selectAll("option")
  .data(boxPlotAttributes)
  .enter()
  .append("option")
  .text((d) => d)
  .attr("value", (d) => d);


let selectedBoxPlotAttribute = "BirthRate";

const xDropdown = d3.select("#x-axis-dropdown");
const sizeDropdown = d3.select("#size-dropdown");

d3.csv('masterData.csv').then(masterData => {
  const distinctRegions = [...new Set(masterData.map(d => d['Region']))];

  const regionSelector = d3.select('#region-selector');
  distinctRegions.forEach(region => {
    const label = regionSelector.append('label');
    label.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'region-checkbox')
      .attr('value', region)
      .property('checked', true);
    label.append('span').text(region);
  });
});

const yearSlider = d3.select("#year-slider");
const selectedYearText = d3.select("#selected-year");

yearSlider.on("input", () => {
  const selectedYear = yearSlider.node().value;
  selectedYearText.text(selectedYear);
});

function selectAll() {
  d3.selectAll(".region-checkbox").property("checked", true);
}

function deselectAll() {
  d3.selectAll(".region-checkbox").property("checked", false);
}

let selectedXAttribute = "BirthRate";
let selectedSizeAttribute = "BirthRate";
let selectedYear = 1980;

const selectedSizeAttributeLabel = document.getElementById("selectedSizeAttributeLabel");
selectedSizeAttributeLabel.textContent = selectedSizeAttribute;

xDropdown
  .selectAll("option")
  .data(attributeOptions)
  .enter()
  .append("option")
  .text((d) => d)
  .attr("value", (d) => d);

sizeDropdown
  .selectAll("option")
  .data(attributeOptions)
  .enter()
  .append("option")
  .text((d) => d)
  .attr("value", (d) => d);

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("height", height)
  .attr("width", width);

let sizeKeySvg = d3
  .select("#key")
  .append("svg")
  .attr("height", 100)
  .attr("width", width);

function updateChart(selectedXAttribute, selectedSizeAttribute, selectedRegions, selectedYear) {
  // Remove existing chart
  d3.selectAll(".circ").remove();
  d3.selectAll(".y-axis").remove();
  d3.selectAll(".x-axis").remove();
  d3.selectAll(".axis-label").remove();
  d3.selectAll(".tooltip").remove();
  d3.selectAll(".size-circle").remove();
  d3.selectAll(".size-label").remove();

  d3.csv("masterData.csv").then((data) => {
    data = data.filter((d) => +d.Year === selectedYear);
    data = data.filter((d) => selectedRegions.includes(d.Region));
    let regions = Array.from(new Set(data.map((d) => d.Region)));

    let yScale = d3
      .scaleBand()
      .domain(regions)
      .range([margin.top + 20, height - margin.bottom])
      .padding(1);

    let xDomain = d3.extent(data.map((d) => +d[selectedXAttribute]));
    xDomain[0] -= 0.5 * xDomain[0];
    xDomain[1] += 0.5 * xDomain[1];

    let xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);

    let color = d3.scaleOrdinal().domain(regions).range(d3.schemePaired);
    let deathRateDomain = d3.extent(data.map((d) => +d[selectedSizeAttribute]));
    let size = d3.scaleSqrt().domain(deathRateDomain).range([5, 30]);

    let sizeValues = d3.extent(data.map((d) => +d[selectedSizeAttribute]));
    let minSize = sizeValues[0];
    let maxSize = sizeValues[1];
    let meanSize = d3.mean(sizeValues);

    const circlePositions = [100, 200, 300]; // Adjust the x-positions as needed
    const circleRadii = [minSize, meanSize, maxSize];

    sizeKeySvg
      .selectAll(".size-circle")
      .data([minSize, meanSize, maxSize])
      .enter()
      .append("circle")
      .attr("class", "size-circle")
      .attr("cx", (d, i) => circlePositions[i])
      .attr("cy", 50)
      .attr("r", (d) => size(d))
      .attr("stroke", "black")
      .attr("fill", "lightgrey");

    sizeKeySvg
      .selectAll(".size-label")
      .data([minSize, meanSize, maxSize])
      .enter()
      .append("text")
      .attr("class", "size-label")
      .attr("x", (d, i) => circlePositions[i])
      .attr("y", 90)
      .text((d) => d.toFixed(2))
      .attr("text-anchor", "middle");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "lightgrey")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("display", "none");

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10));

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .text(selectedXAttribute);


    svg
      .selectAll(".circ")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circ")
      .attr("stroke", "black")
      .attr("fill", (d) => color(d.Region))
      .attr("r", (d) => size(d[selectedSizeAttribute]))
      .attr("cy", (d) => yScale(d.Region) + yScale.bandwidth() / 2)
      .attr("cx", (d) => xScale(d[selectedXAttribute]))
      .on("mouseenter", (event, d) => {
        const tooltipHtml = `<strong>Country:</strong> ${d.Country}<br><strong>Region:</strong> ${d.Region}<br><strong>${selectedXAttribute}:</strong> ${d[selectedXAttribute]}<br><strong>${selectedSizeAttribute}:</strong> ${d[selectedSizeAttribute]}`;
        tooltip
          .style("display", "block")
          .html(tooltipHtml)
          .style("left", (event.pageX + 10) + "px") 
          .style("top", (event.pageY - 40) + "px"); 
      })
      .on("mouseleave", () => { 
        tooltip.style("display", "none");
      });

    let simulation = d3
      .forceSimulation(data)
      .force(
        "x",
        d3
          .forceX((d) => {
            return xScale(d[selectedXAttribute]);
          })
          .strength(0.2)
      )
      .force(
        "y",
        d3
          .forceY(function (d) {
            return yScale(d.Region);
          })
          .strength(1)
      )
      .force(
        "collide",
        d3.forceCollide((d) => {
          return size(d[selectedSizeAttribute]);
        })
      )
      .alphaDecay(0)
      .alpha(0.3)
      .on("tick", tick);

    function tick() {
      d3.selectAll(".circ")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    }

    let init_decay = setTimeout(function () {
      console.log("start alpha decay");
      simulation.alphaDecay(0.1);
    }, 1000);

  });
}




let isPlaying = false; 
const playButton = d3.select("#play-button");
playButton.on("click", () => {
  selectedXAttribute = xDropdown.node().value;
  selectedSizeAttribute = sizeDropdown.node().value;
  const selectedRegions = d3.selectAll('.region-checkbox:checked').nodes().map(node => node.value);
  const selectedYear = parseInt(yearSlider.node().value);

  function updateChartYearly(year) {
    if (year <= 2013 && isPlaying) {
      updateChart(selectedXAttribute, selectedSizeAttribute, selectedRegions, year);
      yearSlider.node().value = year;
      selectedYearText.text(year);
      setTimeout(() => {
        updateChartYearly(year + 1);
      }, 1500); 
    }
  }

  if (isPlaying) {
    isPlaying = false;
    playButton.text("Play");
  } else {
    isPlaying = true;
    playButton.text("Pause");
    updateChartYearly(selectedYear); 
  }
});

// Initial chart rendering
updateChart("BirthRate", "BirthRate", ["North America", "Sub-Saharan Africa", "East Asia & Pacific", "South Asia", "Latin America & Caribbean", "Middle East & North Africa", "Europe & Central Asia"], selectedYear);
