class SpotifyScatterPlot {
        /** 
         * class constructor with basic chart configuration
         * @param {Object}
         * @param {Array}
         * @param {d3.Scale}
        */
        constructor(_config, _data, _colorScale) {
            this.config = {
                parentElement: _config.parentElement,
                containerWidth: _config.containerWidth || 950,
                containerHeight: _config.containerHeight || 500,
                margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 60},
                tooltipPadding: _config.tooltipPadding || 15
            };
            this.data = _data;
            this.colorScale = _colorScale;
            this.initVis();
            this.pinned = null;

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
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
            vis.xScale = d3.scaleLinear()
                .range([0, vis.width]);
    
            vis.yScale = d3.scaleLinear()
                .range([vis.height, 0]);
    
            vis.xAxis = d3.axisBottom(vis.xScale)
                .ticks(6)
                .tickSize(-vis.height - 10)
                .tickPadding(10);
    
            vis.yAxis = d3.axisLeft(vis.yScale)
                .ticks(6)
                .tickSize(-vis.width - 10)
                .tickPadding(10);
    

            // append empty x-axis group and move it to the bottom of the chart
            vis.xAxisG = vis.chart.append('g')
                .attr('class', 'axis x-axis')
                .attr('transform', `translate(0,${vis.height})`);
    
            // append y-axis group
            vis.yAxisG = vis.chart.append('g')
                .attr('class', 'axis y-axis');
    
            vis.Artist = [...new Set(vis.data.map(d => d.Artist))];
            
            // add axis title for Y
            vis.svg.append('text')
                .attr('class', 'axis-title')
                .attr('x', 0)
                .attr('y', 25)
                .attr('dy', '0.71em')
                .text('Danceability');
    
            // add axis title for X
            vis.chart.append('text')
                .attr('class', 'axis-title')
                .attr('x', vis.width + 10)
                .attr('y', vis.height - 15)
                .attr('dy', '0.71em')
                .style('text-anchor', 'end')
                .text('Energy');
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
    
            vis.colorValue = d => d.Track;
            vis.xValue = d => d.Energy;
            vis.yValue = d => d.Danceability;
            vis.zValue = d => d.Stream;

            
            vis.zScale = d3.scaleLog()
            .domain([d3.min(vis.data, vis.zValue) - d3.min(vis.data, vis.zValue)/2, d3.max(vis.data, vis.zValue)/1.5])
                .range([0, 30])
            
            vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
            vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);


            vis.renderVis();
        }
    
        /**
         * bind data to visual elements
         */
        renderVis() {
            let vis = this;
            this.selectedClass = 'selected';

            // add cicrles

            // tooltip box
            this.tooltip = d3.select(vis.config.parentElement).append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0)
                .style('background', 'white')
                .style('border', 'solid 1px black')
                .style('padding', '5px')
                .style('position', 'absolute')
                .style('pointer-events', 'none');

            const bubbles = vis.chart
                .selectAll('.bubbles')
                .data(vis.data)
                .join('circle')
                .attr('class', 'bubbles')
                .attr('r', d => vis.zScale(vis.zValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('fill', d => vis.colorScale(vis.colorValue(d)))
                .on('mouseover', function(event, d) {
                    highlightSong(d.Track); // Highlight on hover
                    vis.tooltip.transition().duration(200).style('opacity', 1);
                    vis.tooltip.html(`Song: ${d.Track}<br>Streams: ${d.Stream}<br>Danceability: ${d.Danceability}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', function() {
                    if (!vis.pinned || vis.pinned.Track !== d.Track) {
                        resetHighlight(); 
                    }
                    vis.tooltip.transition().duration(500).style('opacity', 0);
                })
                .on('click', function(event, d) {
                    highlightSong(d.Track, true); 
                });
        

                
                
        
            vis.xAxisG
                .call(vis.xAxis)
                .call(g => g.select('.domain').remove()); // remove axis and only show the gridline
    
            vis.yAxisG
                .call(vis.yAxis)
                .call(g => g.select('.domain').remove()); // remove axis and only show the gridline
                
        }
    }