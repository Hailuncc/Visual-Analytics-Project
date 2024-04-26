class BarChart {
    /** 
     * class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     * @param {d3.Scale}
     * @param {d3.Dispatcher}
    */
    constructor(_config, _data, _colorScale, _dispatcher) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 1200,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || {top: 25, right: 20, bottom: 80, left: 40},
        };
        this.data = _data;
        this.colorScale = _colorScale;
        this.dispatcher = _dispatcher || null;

        this.initVis();
    }
    
    /**
     * initialize the scales and axes and add svg and g elements
     * and text elements for the visualization
    */
    initVis() {
        let vis = this;

        // calculate inner chart size; margin specifies the space around the actual chart
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // add the svg element and define the size of drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // add group element that will contain the actual chart
        // adjust the position according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.1);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');
        
        // add axis title for Y
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '0.71em')
            .text('Likes-Views Ratio');

            vis.Artist = [...new Set(vis.data.map(d => d.Artist))];
    }
    updateData(filteredData) {
        // Update the data used for the plot
        this.data = filteredData;

        // Redraw the plot using the new data
        this.updateVis();
    }

    /**
     * prepare and update the data and scales before we render the chart
    */
    updateVis() {
        let vis = this;
        
        let averageRatio = d3.mean(data, d => d.ratio)
        
        

        vis.colorValue = d => d.Track;
        vis.xValue = d => d.Track;
        vis.yValue =  d => d.ratio;

        vis.data.sort((a, b) => d3.descending(vis.yValue(a), vis.yValue(b)));
        
        vis.xScale.domain(vis.data.map(vis.xValue));
        vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);
        vis.xScale.paddingInner(0.1).paddingOuter(0.1);

        vis.renderVis();
    }
    
    /**
     * bind data to visual elements
     */
    renderVis() {
        let vis = this;
        this.selectedClass = 'selected';

        //tooltip box
        this.tooltip = d3.select(vis.config.parentElement).append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('background', 'white')
            .style('border', 'solid 1px black')
            .style('padding', '5px')
            .style('position', 'absolute')
            .style('pointer-events', 'none');

        // add bars
        const bars = vis.chart.selectAll('.bar')
            .data(vis.data)
            .join('rect')
            .attr('class', function (d) {
                // console.log(averageRatio)        
                return "bar " + d.Artist;
            })
            .attr('x', d => vis.xScale(vis.xValue(d)))
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr('width', vis.xScale.bandwidth())
            .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
            .attr('fill', d => vis.colorScale(vis.colorValue(d)))

            
            .on('mouseover', function(event, d) {
                d3.selectAll('.bar').style('opacity', 0.2);
                d3.select(this).style('opacity', 1).style('stroke', 'black');
                vis.tooltip.transition().duration(200).style('opacity', 1);
                vis.tooltip.html(`Song: ${d.Track}<br>Ratio: ${vis.yValue(d).toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
                highlightSong(d.Track);
            })
            .on('mouseout', function() {
                d3.selectAll('.bar').style('opacity', 1).style('stroke', 'none');
                vis.tooltip.transition().duration(500).style('opacity', 0);
                resetHighlight();
            })
            

            

            
            .on('click', function(event, d) {
                //basic filter with global variable and function
                //const isSelected = cityFilter.includes(d.key); // check if current city is selected 
                if (isSelected) {
                    cityFilter = cityFilter.filter(f => f !== d.key);
                } else {
                    cityFilter.push(d.key);
                }
                filterData();
                d3.select(this).classed('active', !isSelected);

                const isSelected = d3.select(this).classed('active'); 
                d3.select(this).classed('active', !isSelected);

                // get the names of all selected cities
                const selectedCities = vis.chart.selectAll('.bar.active')
                    .data()
                    .map(k => k.key);
                
                // trigger filter event and pass array with the selected cities
                vis.dispatcher.call('filterCities', event, selectedCities);
            });
        
        vis.xAxisG.call(vis.xAxis);

        vis.xAxisG.selectAll('text')
        .attr('transform', 'rotate(90)')
        .attr('x', 10)
        .attr('y', -5)
        .style('text-anchor', 'start');

        vis.yAxisG.call(vis.yAxis);
    }
}