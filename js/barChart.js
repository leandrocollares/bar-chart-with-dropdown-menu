const margin = { top: 70, right: 100, bottom: 30, left: 200 },
      width = 1200 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom; 
      
const svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const wrapper = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');  
           
const xScale = d3.scaleLinear()
    .range([0, width]);

const yScale = d3.scaleBand()
    .rangeRound([height, 0])
    .padding(0.05);

d3.csv('data/results.csv').then(data => {
  data.forEach(d => {
    d.answers = +d.answers;
  });

  const nested_data = d3.nest()
      .key(function(d){
        return d.statement;
      })
      .entries(data)    

  const statementMenu = d3.select("#statementDropdown")
  statementMenu
    .append("select")
    .selectAll("option")        
      .data(nested_data)
      .enter()
      .append("option")
      .attr("value", function(d){
          return d.key;
      })
      .text(function(d){
          return d.key;
      })       

  xScale.domain([0,21]).nice();
  yScale.domain(data.map(d => d.anchor));

  const bars = wrapper.append('g'),
        anchorLabels = wrapper.append('g'),
        answerLabels = wrapper.append('g');

  const filteredData = data.filter(function(d){ 
    if (d.statement_id == 1){
      return d;
    } 
  })

  bars.selectAll('rect')
      .data(filteredData)
    .enter().append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.anchor))
      .attr('width', 0)
      .attr('height', yScale.bandwidth()) 
      .style('fill', '#3f9894')
      .transition()
      .duration(750)
      .attr('width', d => xScale(d.answers))
      
  anchorLabels.selectAll('text')
      .data(filteredData)
    .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', 0)
      .attr('y', d => yScale(d.anchor))
      .attr("dx", "-.8em")
      .attr("dy", "1.8em")
      .attr('text-anchor','end')
      .style('fill', '#333333')
      .text(d => d.anchor);

  answerLabels.selectAll('text')
      .data(filteredData)
    .enter().append('text')
      .attr('class', 'bar-label')
      .attr("x", d => xScale(d.answers) + 10)
      .attr("y", d => yScale(d.anchor))
      .attr("dx", "0.3em")
      .attr("dy", "1.8em")
      .attr('text-anchor','start')
      .style('fill', '#333333')
      .text(d => d.answers)
      .style('opacity', 0)
      .transition()
      .delay(750) 
      .duration(750)
      .style('opacity', 1)        

  const updateBarChart = (selectedStatement) => {
    const selectedData = data.filter(function(d){ 
      if (d.statement == selectedStatement){
        return d;
      } 
    })

    bars.selectAll('rect')
        .data(selectedData)
        .transition()
        .duration(750)
        .attr('width', d => xScale(d.answers)) 

    answerLabels.selectAll('text')
        .data(selectedData)
        .attr('class', 'bar-label')
        .attr("x", d => xScale(d.answers) + 10)
        .attr("y", d => yScale(d.anchor))
        .attr("dx", "0.3em")
        .attr("dy", "1.8em")
        .attr('text-anchor','start')
        .style('fill', '#333333')
        .text(d => d.answers)
        .style('opacity', 0)
        .transition()
        .delay(750) 
        .duration(750)
        .style('opacity', 1)   
  }

  statementMenu.on('change', function(){
    const currentStatement = d3.select(this).select("select").property("value");
    updateBarChart(currentStatement);
  });              
});
