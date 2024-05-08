/**
 * Assignment name: Project Mile Stone
 * Team 7
 * Group members: Adam, Albert, Hari, Hasitha
 * 
*/


let _data, spotifyBubbleChart, spotifyScatterPlot, ytScatterPlot,
    ytBarChart, artistNames, artistFilter, minStream = 0;
const dispatcher = d3.dispatch("filterArtist")

d3.csv("data/Updated_Data.csv").then(function(_data) {
    data = _data;
    const keys = [
        "Danceability",
        "Energy",
        "Loudness",
        "Speechiness",
        "Acousticness",
        "Instrumentalness",
        "Liveness",
        "Valence",
        "Tempo",
        "Views",
        "Likes"
    ];

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    //convert string into numbers
    data.forEach((d) =>{
        d.Danceability = parseFloat(d["Danceability"]);
        d.Energy = parseFloat(d["Energy"]);
        d.Loudness = parseFloat(d["Loudness"]);
        d.Speechiness = parseFloat(d["Speechiness"]);
        d.Acousticness = parseFloat(d["Acousticness"]);
        d.Instrumentalness = parseFloat(d["Instrumentalness"]);
        d.Liveness = parseFloat(d["Liveness"]);
        d.Tempo = parseFloat(d["Tempo"]);
        d.Views = +d["Views"]; //Does not need a float
        d.Likes = +d["Likes"]; //Does not need a float
        d.Stream = +d["Stream"]; //Does not need a float
        d.ratio = d.Likes/d.Views;
        //console.log(d.ratio)
    });

    
    // Check if any column is empty
    data = data.filter(function(d) {
        return (
            d.Danceability != null && d.Danceability !== '' &&
            d.Energy != null && d.Energy !== '' &&
            d.Loudness != null && d.Loudness !== '' &&
            d.Speechiness != null && d.Speechiness !== '' &&
            d.Acousticness != null && d.Acousticness !== '' &&
            d.Instrumentalness != null && d.Instrumentalness !== '' &&
            d.Liveness != null && d.Liveness !== '' &&
            d.Valence != null && d.Valence !== '' &&
            d.Tempo != null && d.Tempo !== '' &&
            d.Views != null && d.Views !== '' &&
            d.Likes != null && d.Likes !== '' &&
            d.Stream != null && d.Stream !== '' && d.Stream > 0 &&
            !isNaN(d.ratio)
        );
    });
    

    


    spotifyScatterPlot = new SpotifyScatterPlot(
        {parentElement: '#spotify-streams-to-metrics'}, data, colorScale
    );
    spotifyScatterPlot.updateVis();

    ytBarChart = new BarChart(
        {parentElement: '#youtube-views-and-likes-to-metrics'}, data, colorScale
    );
    ytBarChart.updateVis();

    ytScatterPlot = new YTScatterPlot(
        {parentElement: '#youtube-views-to-likes'}, data, colorScale
    )
    ytScatterPlot.updateVis();

    populateArtistDropdown(data);

    
});

function populateArtistDropdown(data) {
    artistNames = [...new Set(data.map(d => d.Artist))];
    artistNames.sort();
    
    const select = d3.select('#artist-select');
    select.selectAll('option')
        .data(artistNames)
        .enter()
        .append('option')
        .text(d => d)
        .attr('value', d => d);


    // Set the initial dropdown selection to the first artist in the list
    select.property('value', artistNames[0]);

    // Trigger a change event to automatically filter for the first artist
    select.dispatch('change');
}



d3.select('#artist-select').on('change', function() {
    // Get the selected artist from the dropdown
    const selectedArtist = d3.select(this).property('value');
    
    // Filter the data to include only entries for the selected artist
    const filteredData = data.filter(d => d.Artist === selectedArtist);
    
    // Update the SpotifyScatterPlot with the filtered data
    spotifyScatterPlot.updateData(filteredData);
    ytBarChart.updateData(filteredData);
    ytScatterPlot.updateData(filteredData);
});

d3.select('#x-axis-select').on('change', function(){
    const selectedXAxis = d3.select(this).property('value')
    spotifyScatterPlot.updateXAxis(selectedXAxis);
})

d3.select('#y-axis-select').on('change', function(){
    const selectedYAxis = d3.select(this).property('value')
    spotifyScatterPlot.updateYAxis(selectedYAxis);
})


d3.select('#views-filter').on('change', function() {
    // Get the value from the input element
    const filterValue = parseFloat(d3.select(this).property('value'));
    
    // Filter the data based on the input value (minimum views)
    const filteredData = data.filter(d => d.views >= filterValue);


    spotifyScatterPlot.updateData(filteredData);
    ytBarChart.updateData(filteredData);
    ytScatterPlot.updateData(filteredData);
})


function highlightSong(trackName) {
    d3.selectAll('.point, .bubbles, .bar')
        .style('opacity', 0.2); 
    d3.selectAll('.point, .bubbles, .bar')
        .filter(d => d.Track === trackName)
        .style('opacity', 1) 
        .style('stroke', 'white')
        .style('stroke-width', '2px');
}

function resetHighlight() {
    d3.selectAll('.point, .bubbles, .bar')
        .style('opacity', 1)
        .style('stroke', 'Black')
        .style('stroke-width', '1px');
}


