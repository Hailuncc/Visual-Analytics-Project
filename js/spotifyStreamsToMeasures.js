class SpotifyBubbleChart {
        /** 
         * class constructor with basic chart configuration
         * @param {Object}
         * @param {Array}
         * @param {d3.Scale}
        */
        constructor(_config, _data, _colorScale) {
            this.config = {
                parentElement: _config.parentElement,
                containerWidth: _config.containerWidth || 600,
                containerHeight: _config.containerHeight || 500,
                margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 60},
                tooltipPadding: _config.tooltipPadding || 15
            };
            this.data = _data;
            this.colorScale = _colorScale;
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
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

            vis.x = d3.scaleLinear()
                .domain([0, 10000])
                .range([ 0, vis.width ]);
                
            vis.x.svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            vis.y = d3.scaleLinear()
                .domain([35, 90])
                .range([ vis.height, 0]);
                svg.append("g")
                .call(d3.axisLeft(y));

            vis.z = d3.scaleLinear()
                .domain([200000, 1310000000])
                .range([ 1, 40]);

        }
    

        updateVis() {
            let vis = this;
    
            


            vis.renderVis();
        }
    

        renderVis() {
            let vis = this;

            vis.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.gdpPercap); } )
                .attr("cy", function (d) { return y(d.lifeExp); } )
                .attr("r", function (d) { return z(d.pop); } )
                .style("fill", "#69b3a2")
                .style("opacity", "0.7")
                .attr("stroke", "black")

        }
    }