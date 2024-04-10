/**
 * Assignment name: Project Mile Stone
 * Team 7
 * Group members: Adam, Albert, Hari, Hasitha
 * 
*/


let _data, spotifyTreemap, spotifyScatterPlot, ytScatterPlot, ytbarChart;

d3.csv("data/Updated_Data.csv").then((_date) => {
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
    });

    data = data.filter(function (d) {
        return(
            d.Artist === "Joyner Lucas" && "Wu-Tang Clan"
        )
    });
    
    console.log("Hellow");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    spotifyTreeMap = new TreeMap(

    );
    spotifyScatterPlot = new SpotifyScatterPlot(

    );
    ytBarChart = new BarChart(

    );
    ytScatterPlot = new YTScatterPlot(
        {parentElement: '#youtube-views-and-likes-to-metrics'}, data, colorScale
    )
    YTScatterPlot.updateVis();
});
