// Assuming you have SVG images for the maps
const usMapImage = 'https://www.pngall.com/wp-content/uploads/12/USA-Map-PNG.png';
const indiaMapImage = 'https://static.vecteezy.com/system/resources/thumbnails/012/806/697/small/doodle-freehand-drawing-of-india-map-free-png.png';

// Fixed width and height for SVG panels
const panelWidth = 600; // Adjust as needed
const panelHeight = 600; // Adjust as needed

const scroll = scroller();

function loadSection(sectionIndex){
  console.log(sectionIndex);
  if (sectionIndex === 0){
    loadSection1();
  } else if (sectionIndex === 1){
    loadSection2();
  } else if (sectionIndex === 2){
    loadSection3();
  } else if (sectionIndex === 3){
    loadSection4();
  } else if (sectionIndex === 4){
    loadSection5();
  } else if (sectionIndex === 5){
    loadSection6();
  }
}

function loadSection1() {
  // Load the US map
  d3.select('#usMap')
    .append('image')
    .attr('xlink:href', usMapImage)
    .attr('width', '100%')
    .attr('height', '100%');

  // Load the India map
  d3.select('#indiaMap')
    .append('image')
    .attr('xlink:href', indiaMapImage)
    .attr('width', '100%')
    .attr('height', '100%');

}

// Chart for GDP
// script.js

// Your existing D3 code for Section 1
function loadSection2() {
  console.log('Loading Section 2');
  // Assuming you have a file named 'GDP.csv' with the specified format
  d3.csv('data/GDP.csv').then(function (data) {
    // Extract data for India and US
    const indiaData = data.filter(d => d['Country Name'] === 'India')[0];
    const usData = data.filter(d => d['Country Name'] === 'United States')[0];

    // Extract years and GDP values
    const years = Object.keys(indiaData).slice(1); // Skip the 'Country Name' column
    const indiaGDP = years.map(year => +indiaData[year]);
    const usGDP = years.map(year => +usData[year]);

    // Create scales for India and US
    const indiaScale = d3.scaleLinear().domain([d3.min(indiaGDP), d3.max(indiaGDP)]).range([0, 100]);
    const usScale = d3.scaleLinear().domain([d3.min(usGDP), d3.max(usGDP)]).range([0, 100]);

    // Create bar chart for US
    const usChart = d3.select('#usGDPChart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    const usTooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    usChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('US GDP Timeline');

    usChart.append('g')
      .attr('transform', `translate(0, ${panelHeight - 20})`)
      .call(d3.axisBottom(d3.scaleBand().domain(years).range([0, panelWidth])).tickFormat(d => d.substring(2, 4)))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dy', '0.5em'); // Adjust vertical position

    usChart.selectAll('rect')
      .data(usGDP)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (panelWidth / usGDP.length))
      .attr('y', panelHeight - 25) // Set initial height to 25 for transition effect
      .attr('width', panelWidth / usGDP.length - 1)
      .attr('height', 0) // Set initial height to 0 for transition effect
      .attr('fill', 'blue')
      .transition()
      .duration(800) // Set the duration of the transition
      .delay((d, i) => i * 100) // Add delay for each bar
      .attr('y', d => panelHeight - usScale(d) - 25) // Adjusted y-position
      .attr('height', d => usScale(d));

    // Create bar chart for India
    const indiaChart = d3.select('#indiaGDPChart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    const indiaTooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);


    indiaChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('India GDP Timeline');

    indiaChart.append('g')
      .attr('transform', `translate(0, ${panelHeight - 20})`)
      .call(d3.axisBottom(d3.scaleBand().domain(years).range([0, panelWidth])).tickFormat(d => d.substring(2, 4)))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dy', '0.5em'); // Adjust vertical position

    indiaChart.append('g')
      .attr('transform', `translate(20, ${panelHeight - 125})`) // Move the y-axis to the left
      .call(d3.axisLeft(indiaScale).ticks(5));

    indiaChart.selectAll('rect')
      .data(indiaGDP)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (panelWidth / indiaGDP.length))
      .attr('y', panelHeight - 25) // Set initial height to 25 for transition effect
      .attr('width', panelWidth / indiaGDP.length - 1)
      .attr('height', 0) // Set initial height to 0 for transition effect
      .attr('fill', 'green')
      .transition()
      .duration(800) // Set the duration of the transition
      .delay((d, i) => i * 100) // Add delay for each bar
      .attr('y', d => panelHeight - indiaScale(d) - 25) // Adjusted y-position
      .attr('height', d => indiaScale(d));

    usChart.selectAll('rect')
      .on('mouseover', function (event, d) {
        // Show tooltip on hover
        usTooltip.transition()
          .duration(200)
          .style('opacity', .9);

        // Set tooltip content
        usTooltip.html(`Year: ${years[d]}<br/>GDP: $${usGDP[d]} Billion`)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        // Hide tooltip on mouseout
        usTooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    indiaChart.selectAll('rect')
      .on('mouseover', function (event, d) {
        // Show tooltip on hover
        indiaTooltip.transition()
          .duration(200)
          .style('opacity', .9);

        // Set tooltip content
        indiaTooltip.html(`Year: ${years[d]}<br/>GDP: $${indiaGDP[d]} Billion`)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        // Hide tooltip on mouseout
        indiaTooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  });
}

// Your existing D3 code for Section 2
function loadSection3() {
  // Chart for Literacy
  // Literacy rates for India and US
  const indiaLiteracyRate = 81;
  const usLiteracyRate = 79;

  // Create dataset for pie charts
  const literacyDataUS = [usLiteracyRate, 100 - usLiteracyRate];
  const literacyDataIndia = [indiaLiteracyRate, 100 - indiaLiteracyRate];

  // Colors for pie chart segments
  const pieColors = ['#4CAF50', '#ECECEC', '#2196F3', '#ECECEC']; // Green for India, Blue for US

  // Radius and center for pie charts
  const radius = Math.min(panelWidth, panelHeight) / 4;
  const center = [panelWidth / 2, panelHeight / 2]; // Center for US pie chart
  const indiaCenter = [(panelWidth / 4) * 3, panelHeight / 2]; // Center for India pie chart

  // ... (Previous code)

  // Create pie chart for US
  const usPieChart = d3.select('#usLiteracyChart')
    .attr('width', panelWidth)
    .attr('height', panelHeight)
    .append('g')
    .attr('transform', `translate(${center[0]}, ${center[1]})`);

  const usPie = d3.pie();
  const usArc = d3.arc().innerRadius(0).outerRadius(radius);

  // Calculate total for percentage calculation
  const usTotal = literacyDataUS.reduce((acc, value) => acc + value, 0);

  usPieChart.selectAll('path')
    .data(usPie(literacyDataUS))
    .enter()
    .append('path')
    .attr('d', usArc)
    .attr('fill', (d, i) => pieColors[i])
    .append('title') // Add tooltips
    .text((d, i) => `${Math.round((d.data / usTotal) * 100)}%`);

  // Add text labels with percentages
  usPieChart.selectAll('text')
    .data(usPie(literacyDataUS))
    .enter()
    .append('text')
    .attr('transform', d => `translate(${usArc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', 'black')
    .text(d => `${Math.round((d.data / usTotal) * 100)}%`);

  // Create pie chart for India
  const indiaPieChart = d3.select('#indiaLiteracyChart')
    .attr('width', panelWidth)
    .attr('height', panelHeight)
    .append('g')
    .attr('transform', `translate(${indiaCenter[0]}, ${indiaCenter[1]})`);

  const indiaPie = d3.pie();
  const indiaArc = d3.arc().innerRadius(0).outerRadius(radius);

  // Calculate total for percentage calculation
  const indiaTotal = literacyDataIndia.reduce((acc, value) => acc + value, 0);

  indiaPieChart.selectAll('path')
    .data(indiaPie(literacyDataIndia))
    .enter()
    .append('path')
    .attr('d', indiaArc)
    .attr('fill', (d, i) => pieColors[i])
    .append('title') // Add tooltips
    .text((d, i) => `${Math.round((d.data / indiaTotal) * 100)}%`);

  // Add text labels with percentages
  indiaPieChart.selectAll('text')
    .data(indiaPie(literacyDataIndia))
    .enter()
    .append('text')
    .attr('transform', d => `translate(${indiaArc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', 'black')
    .text(d => `${Math.round((d.data / indiaTotal) * 100)}%`);

}

// Your existing D3 code for Section 3
function loadSection4() {
  // Unemployment chart
  // Load unemployment data
  d3.csv('data/UnempRate.csv').then(function (data) {
    // Extract data for India and US
    const indiaUnemploymentData = data.filter(d => d['Country'] === 'India');
    const usUnemploymentData = data.filter(d => d['Country'] === 'United States');

    // Extract years and unemployment rates
    const yearsUnemployment = indiaUnemploymentData.map(d => +d['Year']);
    const indiaUnemploymentRates = indiaUnemploymentData.map(d => +d['UnempRate']);
    const usUnemploymentRates = usUnemploymentData.map(d => +d['UnempRate']);

    // Create scales for India and US
    const indiaUnemploymentScale = d3.scaleLinear().domain([d3.min(indiaUnemploymentRates), d3.max(indiaUnemploymentRates)]).range([0, panelHeight]);
    const usUnemploymentScale = d3.scaleLinear().domain([d3.min(usUnemploymentRates), d3.max(usUnemploymentRates)]).range([0, panelHeight]);

    // ... (Previous code)

    // Create line chart for US
    const usUnemploymentChart = d3.select('#usUnemploymentChart')
      .attr('width', panelWidth + 30) // Adjusted width to accommodate labels
      .attr('height', panelHeight);

    usUnemploymentChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('US Unemployment Rates (2013-2023)');

    usUnemploymentChart.append('g')
      .attr('transform', `translate(0, ${panelHeight - 20})`)
      .call(
        d3.axisBottom(d3.scaleBand().domain(yearsUnemployment.reverse()).range([0, panelWidth])).tickFormat(d => d)
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dy', '0.5em');

    usUnemploymentChart.append('g')
      .attr('transform', `translate(20, 0)`)
      .call(d3.axisLeft(usUnemploymentScale).ticks(5));

    usUnemploymentChart.append('path')
      .datum(usUnemploymentRates)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x((d, i) => i * (panelWidth / usUnemploymentRates.length) + 10) // Adjusted x-position
        .y(d => panelHeight - usUnemploymentScale(d) - 25) // Adjusted y-position
      );

    // Label each point with unemployment rates
    usUnemploymentChart.selectAll('text.point-label')
      .data(usUnemploymentRates)
      .enter()
      .append('text')
      .attr('class', 'point-label')
      .attr('x', (d, i) => i * (panelWidth / usUnemploymentRates.length) + 10)
      .attr('y', d => panelHeight - usUnemploymentScale(d) - 10)
      .text(d => d.toFixed(2));

    // Create line chart for India
    const indiaUnemploymentChart = d3.select('#indiaUnemploymentChart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    indiaUnemploymentChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('India Unemployment Rates (2013-2023)');

    indiaUnemploymentChart.append('g')
      .attr('transform', `translate(0, ${panelHeight - 20})`)
      .call(
        d3.axisBottom(d3.scaleBand().domain(yearsUnemployment.reverse()).range([0, panelWidth])).tickFormat(d => d)
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dy', '0.5em');

    indiaUnemploymentChart.append('g')
      .attr('transform', `translate(20, 0)`)
      .call(d3.axisLeft(indiaUnemploymentScale).ticks(5));

    indiaUnemploymentChart.append('path')
      .datum(indiaUnemploymentRates)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x((d, i) => i * (panelWidth / indiaUnemploymentRates.length))
        .y(d => panelHeight - indiaUnemploymentScale(d))
      );

    // Label each point with unemployment rates
    indiaUnemploymentChart.selectAll('text.point-label')
      .data(indiaUnemploymentRates)
      .enter()
      .append('text')
      .attr('class', 'point-label')
      .attr('x', (d, i) => i * (panelWidth / indiaUnemploymentRates.length) + 10)
      .attr('y', d => panelHeight - indiaUnemploymentScale(d) - 10)
      .text(d => d.toFixed(2));
  });
}

// Your existing D3 code for Section 4
function loadSection5() {
  // Chart for CO2 Emissions
  // Assuming you have a file named 'ghg-emissions.csv' with the specified format
  d3.csv('data/ghg-emissions.csv').then(function (data) {
    // Extract data for India and US
    const indiaCO2Data = data.filter(d => d['Country/Region'] === 'India')[0];
    const usCO2Data = data.filter(d => d['Country/Region'] === 'United States')[0];

    console.log("India CO2 Data", indiaCO2Data);
    console.log("US CO2 Data", usCO2Data);

    // Extract years and CO2 emission values
    const yearsCO2 = Object.keys(indiaCO2Data).slice(2); // Skip the 'Country/Region' and 'unit' columns
    let indiaCO2Emissions = yearsCO2.map(year => +indiaCO2Data[year]);
    let usCO2Emissions = yearsCO2.map(year => +usCO2Data[year]);

    // Create scales for India and US
    const indiaCO2Scale = d3.scaleLinear().domain([d3.min(indiaCO2Emissions), d3.max(indiaCO2Emissions)]).range([5, 50]);
    const usCO2Scale = d3.scaleLinear().domain([d3.min(usCO2Emissions), d3.max(usCO2Emissions)]).range([5, 50]);

    // Create bubble chart for US
    const usBubbleChart = d3.select('#usCO2Chart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    usBubbleChart.append('text')
      .attr('x', panelWidth / 2) // Adjusted x-position
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('US CO2 Emissions (1990-2020)');

    const usYearText = usBubbleChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', panelHeight - 30) // Adjusted y-position
      .attr('text-anchor', 'middle')
      .style('font-size', '12px');

    const usCO2Text = usBubbleChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', panelHeight - 15) // Adjusted y-position
      .attr('text-anchor', 'middle')
      .style('font-size', '12px');

    // Function to update bubbles, year text, and CO2 text for the US
    function updateUSBubbles(yearIndex) {
      const currentYear = yearsCO2[yearIndex];

      const usBubbles = usBubbleChart.selectAll('circle')
        .data([usCO2Emissions[yearIndex]], d => d); // Use an array with one data point for the current year

      usBubbles.enter()
        .append('circle')
        .attr('cx', panelWidth / 2)
        .attr('cy', panelHeight / 2) // Fixed y-position
        .attr('r', 0) // Start with radius 0
        .attr('fill', 'blue')
        .merge(usBubbles) // Merge enter and update selections
        .transition()
        .attr('r', d => usCO2Scale(d));

      usBubbles.exit().remove(); // Remove previous year's bubble

      // Update year text
      usYearText.text(`Year: ${currentYear}`);
      // Update CO2 text
      usCO2Text.text(`CO2 Emissions: ${usCO2Emissions[yearIndex]}`);
    }

    // Create bubble chart for India
    const indiaBubbleChart = d3.select('#indiaCO2Chart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    indiaBubbleChart.append('text')
      .attr('x', panelWidth / 2) // Adjusted x-position
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('India CO2 Emissions (1990-2020)');

    const indiaYearText = indiaBubbleChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', panelHeight - 30) // Adjusted y-position
      .attr('text-anchor', 'middle')
      .style('font-size', '12px');

    const indiaCO2Text = indiaBubbleChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', panelHeight - 15) // Adjusted y-position
      .attr('text-anchor', 'middle')
      .style('font-size', '12px');

    // Function to update bubbles, year text, and CO2 text for India
    function updateIndiaBubbles(yearIndex) {
      const currentYear = yearsCO2[yearIndex];

      const indiaBubbles = indiaBubbleChart.selectAll('circle')
        .data([indiaCO2Emissions[yearIndex]], d => d); // Use an array with one data point for the current year

      indiaBubbles.enter()
        .append('circle')
        .attr('cx', panelWidth / 2)
        .attr('cy', panelHeight / 2) // Fixed y-position
        .attr('r', 0) // Start with radius 0
        .attr('fill', 'green')
        .merge(indiaBubbles) // Merge enter and update selections
        .transition()
        .attr('r', d => indiaCO2Scale(d));

      indiaBubbles.exit().remove(); // Remove previous year's bubble

      // Update year text
      indiaYearText.text(`Year: ${currentYear}`);
      // Update CO2 text
      indiaCO2Text.text(`CO2 Emissions: ${indiaCO2Emissions[yearIndex]}`);
    }

    // Update bubbles, year text, and CO2 text for each year with a delay
    yearsCO2.forEach((year, i) => {
      setTimeout(() => {
        updateUSBubbles(i);
        updateIndiaBubbles(i);
      }, i * 2000);
    });
  });

}

// Your existing D3 code for Section 5
function loadSection6() {
  // Chart for Military Expenditure
  // Assuming you have a file named 'Military.csv' with the specified format
  d3.csv('data/Military.csv').then(function (data) {

    // Extract data for India and US
    const indiaMilitaryData = data.filter(d => d['Country'] === 'India')[1];
    const usMilitaryData = data.filter(d => d['Country'] === 'United States')[1];

    // Extract years and military expenditure values
    const yearsMilitary = Object.keys(indiaMilitaryData).filter(year => !isNaN(year)); // Skip the 'Country Name' and 'Indicator Name' columns
    const indiaMilitaryExpenditure = yearsMilitary.map(year => +indiaMilitaryData[year]);
    const usMilitaryExpenditure = yearsMilitary.map(year => +usMilitaryData[year]);
    console.log(yearsMilitary);
    // Create scales for India and US
    const indiaMilitaryScale = d3.scaleLinear().domain([d3.min(indiaMilitaryExpenditure), d3.max(indiaMilitaryExpenditure)]).range([5, 50]);
    const usMilitaryScale = d3.scaleLinear().domain([d3.min(usMilitaryExpenditure), d3.max(usMilitaryExpenditure)]).range([5, 50]);

    // Create line chart for US military expenditure
    const usMilitaryChart = d3.select('#usMilitaryExpenditureChart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    usMilitaryChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('US Military Expenditure (% of GDP)');

    usMilitaryChart.append('g')
      .attr('transform', `translate(0, ${panelHeight - 20})`)
      .call(d3.axisBottom(d3.scaleBand().domain(yearsMilitary).range([0, panelWidth])).tickFormat(d => d.substring(2, 4)))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dy', '0.5em'); // Adjust vertical position

    usMilitaryChart.append('path')
      .datum(usMilitaryExpenditure)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 3)
      .attr('d', d3.line()
        .x((d, i) => i * (panelWidth / usMilitaryExpenditure.length)+10)
        .y(d => panelHeight - usMilitaryScale(d) - 25) // Adjusted y-position
      );

    // Add circle points for each year's data point
    usMilitaryChart.selectAll('circle')
      .data(usMilitaryExpenditure)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => i * (panelWidth / usMilitaryExpenditure.length)+10)
      .attr('cy', d => panelHeight - usMilitaryScale(d) - 25) // Adjusted y-position
      .attr('r', 6)
      .attr('fill', 'blue');

    // Create line chart for India military expenditure
    const indiaMilitaryChart = d3.select('#indiaMilitaryExpenditureChart')
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    indiaMilitaryChart.append('text')
      .attr('x', panelWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('India Military Expenditure (% of GDP)');

    indiaMilitaryChart.append('g')
      .attr('transform', `translate(0, ${panelHeight - 20})`)
      .call(d3.axisBottom(d3.scaleBand().domain(yearsMilitary).range([0, panelWidth])).tickFormat(d => d.substring(2, 4)))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dy', '0.5em'); // Adjust vertical position

    indiaMilitaryChart.append('path')
      .datum(indiaMilitaryExpenditure)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 3)
      .attr('d', d3.line()
        .x((d, i) => i * (panelWidth / indiaMilitaryExpenditure.length)+10)
        .y(d => panelHeight - indiaMilitaryScale(d) - 25) // Adjusted y-position
      );

    // Add circle points for each year's data point
    indiaMilitaryChart.selectAll('circle')
      .data(indiaMilitaryExpenditure)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => i * (panelWidth / indiaMilitaryExpenditure.length)+10)
      .attr('cy', d => panelHeight - indiaMilitaryScale(d) - 25) // Adjusted y-position
      .attr('r', 6)
      .attr('fill', 'green');
  });

}
// Set the container (body in this case)
scroll.container(d3.select('body'));

// Attach a listener for the 'active' event
scroll.on('active', function (sectionIndex) {
  console.log(`Entering section ${sectionIndex + 1}`);
  // Load SVGs or perform other actions when entering a section
  loadSection(sectionIndex);
});

// Attach a listener for the 'progress' event
scroll.on('progress', function (sectionIndex, progress) {
  console.log(`In section ${sectionIndex + 1}, progress: ${progress}`);
  // You can use the progress value for animations or other effects
});

// Start the scroller
scroll();








