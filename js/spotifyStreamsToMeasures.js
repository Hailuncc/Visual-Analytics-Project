class SpotifyTreeMap {
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
            
                  // stratify the data: reformatting for d3.js
            vis.root = d3.stratify()
            .id(d => d.Track)   // Name of the entity (column name is Track in csv)
            .parentId(d => d.Artist)   // Name of the parent (column name is Artist in csv)
            (data)
            // vis.root.sum(function(d) { return +d.Energy })   // Compute the numeric value for each entity\

            d3.treemap().size([this.width, this.height])
            .padding(4)

            //vis.root.sum(d => d.Energy)
        }
    

        updateVis() {
            let vis = this;
    
            


            vis.renderVis();
        }
    

        renderVis() {
            let vis = this;

            // vis.svg.selectAll("rect")
            //     .data(vis.svg.root.leaves())
            //     .join("rect")
            //     .attr('x', function(d) {return d.x0})
            //     .attr('y', function (d) { return d.y0; })
            //     .attr('width', function (d) { return d.x1 - d.x0; })
            //     .attr('height', function (d) { return d.y1 - d.y0; })
            //     .style("stroke", "black")
            //     .style("fill", "#69b3a2");
        }
    }