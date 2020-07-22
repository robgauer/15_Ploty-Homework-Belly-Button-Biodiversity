// 15 - Homework Interactive Visualizations and Dashboards
// Plot.ly Homework - Belly Button Biodiversity
// Plot.ly-Challenge
// Author:  Rob Gauer
// Date Due:  June 27, 2020
// ----------------------------------------------------
// Homework file structure reference information:
// Instructions:  README.md 
// File Name:  code/js/plots.js
// Dataset: data/samples.json
// HTML:  index.html
// Images:  images/ (%various images%)
// ----------------------------------------------------
//
//
// OVERVIEW
// In this assignment, you will build an interactive dashboard to explore the Belly Button Biodiversity dataset, 
// which catalogs the microbes that colonize human navels. The dataset reveals that a small handful of 
// microbial species (also called operational taxonomic units, or OTUs, in the study) were present
// in more than 70% of people, while the rest were relatively rare.

// Creating function for Data plotting (Bar, gauge, bubble)
function getPlot(id) {
    
    // Step 1: Plotly
    // Use the D3 library to read in samples.json.
    // Getting data from the json file
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        console.log(wfreq)
        //console.log(${wfreq})
        var wfreq = (`${wfreq}`)
        console.log(wfreq)
        
        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
  
        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log(samplevalues)
  
        // Get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        console.log(OTU_top)

        // Get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
        console.log(`OTU IDS: ${OTU_id}`)
    
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
        console.log(`Sample Values: ${samplevalues}`)
        console.log(`Id Values: ${OTU_top}`)
        
        // STEP 2: Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.
        // create trace variable for the plot
        var trace_bar = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'limegreen'},
            type:"bar",
            orientation: "h",
        };
  
        // create data variable
        var data_bar = [trace_bar];
  
        // create layout variable to set plots layout
        var layout_bar = {
            title: "<b>Top 10 Operational Taxonomic Units (OTU)</b>",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 30
            }
        };
          
        Plotly.newPlot("bar", data_bar, layout_bar);
        //console.log(`ID: ${samples.otu_ids}`)
        
        // STEP 3: Create a bubble chart that displays each sample.
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.
        var trace_bubble = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: "Earth"
            },
            text: samples.otu_labels
        };
  
        // set the layout for the bubble plot
        var layout_bubble = {
            title: "<b>Bacteria Cultures Per Sample</b>",
            margin: { t: 35},
            hovermode: "closest",                        
            xaxis:{title: "Operational Taxonomic Units (OTU) ID" },
            height: 500,
            width: 1200,            
        };
  
        // creating data variable 
        var data_bubble = [trace_bubble];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data_bubble, layout_bubble); 
    });            
  }  


// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("data/samples.json").then((data)=> {
        
        // STEP 5: Display each key-value pair from the metadata JSON object somewhere on the page.
        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // STEP 6: Update all of the plots any time that a new sample is selected.
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
        
        // BONUS: Build the Gauge Chart
        buildGauge(result.wfreq);
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// STEP 4: Display the sample metadata, i.e., an individual's demographic information.
// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

// Initialize the dashboard
init();



// ADVANCED CHALLENGE ASSIGNMENT (Optional)
// The following task is advanced and therefore optional.
// Adapt the Gauge Chart from <https://plot.ly/javascript/gauge-charts/> to plot the weekly washing frequency of the individual.
// You will need to modify the example gauge code to account for values ranging from 0 through 9.
// Update the chart whenever a new sample is selected.
// ----------------------------------------------------------------------------------------------------------------
// ********** Reference for same style gauge https://com2m.de/blog/technology/gauge-charts-with-plotly/ ***********
// ----------------------------------------------------------------------------------------------------------------

// BONUS - Belly Button Scrubs per Week.
// The Guage Chart
// Function to plot the gauge

function buildGauge(wfreq) {
    //Enter the washing frequency between 0 and 180
    var level = parseFloat(wfreq) * 20;
    console.log(wfreq)
    
    // Trig to calc meter point
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Create gauge pointer
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ';
    var pathX = String(x);
    var space = ' ';
    var pathY = String(y);
    var pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data_gauge = [
        
        // Gauge pointer
        { 
            type: "scatter",
            x: [0], 
            y: [0],
            marker: {size: 12, color:'850000'},
            showlegend: false,
            name: "Frequency",
            text: level,
            hoverinfo: "text+name"
        },
        
        // Gauge configuration-setup
        {   
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
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
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
        }
    ];

    // Gauge layout
    var layout_gauge = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            height: 550,
            width: 550,
            xaxis: {
                zeroline:false, 
                showticklabels:false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline:false,
                showticklabels:false,
                showgrid: false,
                range: [-1, 1]
            }
    };  

    // Plot the gauge
    var GAUGE = document.getElementById("gauge");
    Plotly.newPlot('gauge', data_gauge, layout_gauge);
}


// EOF