export function createLineContainer(dataset, width, height) {
  let dimensions = {
    width: window.innerWidth - 50,
    height: 600,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  const wrapper = d3
    .select(".chart-3")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .classed("bounds", true)
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
    );

  const yAccessor = (d) => d.value;
  // const dateParser = d3.timeParse("%d/%m/%Y");
  const xAccessor = (d) => d.name;

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))
    .curve(d3.curveBasis);

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);
}

export function drawLineChart(svg, data, height, width) {
  const X = data.map((item) => item.name);
  const Y = data.map((item) => item.value);
  const I = d3.range(X.length);
  const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]); // data gaps
  const D = d3.map(data, defined);
  const xDomain = d3.extent(X);
  const yDomain = [0, d3.max(Y)];
  const margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
  const xType = d3.scaleLinear;
  const yType = d3.scaleLinear;
  const curve = d3.curveLinear;
  const xRange = [margins.left, width - margins.right];
  const yRange = [height - margins.bottom, margins.top];

  const yAccessor = (d) => d.value;
  const xAccessor = (d) => d.name;

  // const xScale = xType(xDomain, xRange);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([height, 0]);
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, width]);

  var x_axis = d3.axisBottom().scale(xScale);

  let yFormat;
  let yLabel;
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))
    .curve(d3.curveBasis);

  const line = svg
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "Red")
    .attr("stroke-width", 2);
  // const line = d3
  //   .line()
  //   .defined((i) => D[i])
  //   .curve(curve)
  //   .x((i) => xScale(X[i]))
  //   .y((i) => yScale(Y[i]));

  // svg
  //   .append("g")
  //   .attr("transform", `translate(0,${height - margins.bottom})`)
  //   .call(xAxis);

  // svg
  //   .append("g")
  //   .attr("transform", `translate(${margins.left},0)`)
  //   .call(yAxis)
  //   .call((g) => g.select(".domain").remove())
  //   .call((g) =>
  //     g
  //       .selectAll(".tick line")
  //       .clone()
  //       .attr("x2", width - margins.left - margins.right)
  //       .attr("stroke-opacity", 0.1)
  //   )
  //   .call((g) =>
  //     g
  //       .append("text")
  //       .attr("x", -margins.left)
  //       .attr("y", 10)
  //       .attr("fill", "currentColor")
  //       .attr("text-anchor", "start")
  //       .text(yLabel)
  //   );

  // const color = "currentColor"; // stroke color of line
  // const strokeLinecap = "round"; // stroke line cap of the line
  // const strokeLinejoin = "round"; // stroke line join of the line
  // const strokeWidth = 1.5; // stroke width of line, in pixels
  // const strokeOpacity = 1;

  // svg
  //   .append("path")
  //   .attr("fill", "none")
  //   .attr("stroke", color)
  //   .attr("stroke-width", strokeWidth)
  //   .attr("stroke-linecap", strokeLinecap)
  //   .attr("stroke-linejoin", strokeLinejoin)
  //   .attr("stroke-opacity", strokeOpacity)
  //   .attr("d", line(I));
}
