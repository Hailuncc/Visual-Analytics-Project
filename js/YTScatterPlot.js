/**
 * Assignment name: Project Mile Stone
 * Team 7
 * Group members: Adam, Albert, Hari, Hasitha
 * 
*/

class YTScatterPlot {
        /** 
         * class constructor with basic chart configuration
         * @param {Object}
         * @param {Array}
         * @param {d3.Scale}
        */
        constructor(_config, _data, _colorScale) {
            this.config = {
                parentElement: _config.parentElement,
                containerWidth: _config.containerWidth || 1200,
                containerHeight: _config.containerHeight || 650,
                margin: _config.margin || {top: 65, right: 20, bottom: 20, left: 60},
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
                .tickSize(0)
                .tickPadding(10);
    
            vis.yAxis = d3.axisLeft(vis.yScale)
                .ticks(6)
                .tickSize(0)
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
                .style('fill', 'white')
                .text('Likes');
    
            // add axis title for X
            vis.chart.append('text')
                .attr('class', 'axis-title')
                .attr('x', vis.width + 10)
                .attr('y', vis.height - 15)
                .attr('dy', '0.71em')
                .style('text-anchor', 'end')
                .style('fill', 'white')
                .text('Views');
        }
        //update the data for the chosen artist
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
    
            vis.colorValue = d => [d.Track, d.Artist];
            vis.xValue = d => d.Views;
            vis.yValue = d => d.Likes;

            
            
            vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
            vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

            
            vis.renderVis();
        }
    
        /**
         * bind data to visual elements
         */
        renderVis() {
            let vis = this;

            const tooltip = d3
              .select(vis.config.parentElement)
              .append("div")
              .attr("class", "tooltip")
              .style("opacity", 0)
              .style("background", "white")
              .style("border", "solid 1px black")
              .style("padding", "5px")
              .style("position", "absolute")
              .style("pointer-events", "none")
              .style("color", "black");

            // add circles
            const bubbles = vis.chart
                .selectAll('.point')
                .data(vis.data)
                .join('circle')
                .attr('class', 'point')
                .attr('r', 10)
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('fill', d => vis.colorScale(vis.colorValue(d)))
                .on('mouseover', function(event, d) {
                    highlightSong(d.Track); 
                    tooltip.transition().duration(200).style('opacity', 1);
                    tooltip.html(`Song: ${d.Track}<br>Likes: ${d.Likes}<br>Views: ${d.Views}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', function() {
                    resetHighlight();  // Reset all highlights
                    tooltip.transition().duration(500).style('opacity', 0);
                });
        
            //draw axis
            vis.xAxisG.call(vis.xAxis)
            vis.yAxisG.call(vis.yAxis)

        }
    }