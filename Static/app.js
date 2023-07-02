// Set the api url as a constant
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Build a function called buildMetadata that takes in a parameter called sample
function buildMetadata(sample) {
  // Use d3 to pull in the data
  d3.json(url).then(data => {
    // Create a reference point to an array that takes in the id key equal to the sample parameter
    let metadata = data.metadata.filter(obj => obj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use Object.entries to add each key-value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // Call buildGauge function and pass the washing frequency as an argument
    buildGauge(metadata.wfreq);
  });
}

// Build a function called buildCharts that takes in a parameter called sample
function buildCharts(sample) {
  // Use d3 to pull in the data
  d3.json(url).then(data => {
    // Create a reference point to an array that takes in the id key equal to the sample parameter
    let samples = data.samples.filter(obj => obj.id == sample)[0];

    // Create reference points for samples key
    let otuIds = samples.otu_ids;
    let otuLabels = samples.otu_labels;
    let sampleValues = samples.sample_values;

    // BAR CHART
    // Create reference point yticks equal to a slice(0,10) of otu_ids in reverse order
    let yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    // Create reference point called barData and define: y, x slice (0,10), text slice (0,10), type "bar", orientation: "h"
    let barData = [
      {
        y: yticks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    // Create reference point called barLayout and define: title"Name Chart", margin: { t: 30, l: 150 }
    let barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };

    // Use Plotly.newPlot and fill in parameters with defined objects above
    Plotly.newPlot("bar", barData, barLayout);

    // BUBBLE CHART
    // Create and define parameters for bubbleLayout: title, margin{ t: 0 }, hovermode "closest", xaxis { title: "OTU ID" }, margin { t: 30}
    let bubbleLayout = {
      title: "OTU ID",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    // Create and define bubbleData parameters: x: otu_ids, y, text, mode, marker: {size:, color:, colorscale: "Earth"}
    let bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      }
    ];

    // Use Plotly.newPlot and fill in parameters with defined objects above
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Build the Gauge Chart
function buildGauge(washingFreq) {
  // Trig to calculate meter point
  var degrees = 180 - (washingFreq * 20),
    radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: create a triangle to represent the washing frequency
  var mainPath = "M -.0 -0.025 L .0 0.025 L ",
    pathX = String(x),
    space = " ",
    pathY = String(y),
    pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 14, color: "850000" },
      showlegend: false,
      name: "scrubs",
      text: washingFreq,
      hoverinfo: "text+name"
    },
    {
      values: [
        50 / 9,
        50 / 9,
        50 / 9,
         50 / 9,
        50 / 9,
        50 / 9,
        50 / 9,
        50 / 9,
        50 / 9,
        50
      ],
      rotation: 90,
      text: [
        "8-9",
        "7-8",
        "6-7",
        "5-6",
        "4-5",
        "3-4",
        "2-3",
        "1-2",
        "0-1",
        ""
      ],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: [
        "8-9",
        "7-8",
        "6-7",
        "5-6",
        "4-5",
        "3-4",
        "2-3",
        "1-2",
        "0-1",
        ""
      ],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  Plotly.newPlot("gauge", data, layout);
}

// Create a function called init to populate the page with initial data
function init() {
  // Use d3 to pull in the data
  d3.json(url).then(data => {
    // Create a reference point to the dropdown select element
    let dropdown = d3.select("#selDataset");

    // Use forEach to loop through each name
    data.names.forEach(name => {
      // Append an option element for each name
      dropdown
        .append("option")
        .text(name)
        .property("value", name);
    });

    // Use the first sample from the list to build the initial plots
    let initialSample = data.names[0];
    buildCharts(initialSample);
    buildMetadata(initialSample);
  });
}

// Create a function called optionChanged that takes in a newSample parameter
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
