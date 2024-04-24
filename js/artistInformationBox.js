class artistInfo{

    constructor(_dispatcher){
        this.dispatcher = +dispatcher || null;
        this.initFilter();
    }
    // d3.select("#selectButton").on("change", function(d) {
    //     // recover the option that has been chosen
    //     var selectedOption = d3.select(this).property("value")
    //     // run the updateChart function with this selected option
    //     update(selectedOption)
    // })
    initFilter(){

        var selectedOption = d3.select(this).property("value")

        this.update(selectedOption)

    }
}