/**
 * Assignment name: Project Mile Stone
 * Team 7
 * Group members: Adam, Albert, Hari, Hasitha
 * 
*/


let _data, spotifyTreemap, spotifyScatterPlot, ytScatterPlot, ytBarChart;

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

    data = data.filter(function (d) {
        return(
            d.Artist == "Joyner Lucas" || d.Artist == "Wu-Tang Clan"
        )
    });
    

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // spotifyTreeMap = new SpotifyTreeMap(
    //     {parentElement: '#spotify-streams-to-measures'}, data, colorScale
    // );
    // spotifyTreeMap.updateVis();

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
    const artistNames = [...new Set(data.map(d => d.Artist))];
    const select = d3.select('#artist-select');
    select.selectAll('option')
        .data(artistNames)
        .enter()
        .append('option')
        .text(d => d)
        .attr('value', d => d);
}