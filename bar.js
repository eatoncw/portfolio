// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart
export default async function barChart(data, {} = {}, colors = []) {
  const HEIGHT = 400;
  const width = window.innerWidth;
  const MARGIN_LEFT = 40;
  const MARGIN_RIGHT = 0;
  const MARGIN_TOP = 20;
  const MARGIN_BOTTOM = 30;
  const margins = {
    left: MARGIN_LEFT,
    right: MARGIN_RIGHT,
    top: MARGIN_TOP,
    bottom: MARGIN_BOTTOM,
  };

  // construct the main svg
  const svg = initChart(width, HEIGHT);
  const { Y, yScale, yFormat } = addYAxis(svg, data, HEIGHT, width, margins);
  const { X, xScale, I } = addXAxis(svg, data, width, HEIGHT, margins);
  const bars = addBars({
    svg,
    I,
    xScale,
    yScale,
    yFormat,
    X,
    Y,
    colors,
    HEIGHT,
  });

  // add main title
  addText(svg, HEIGHT, width);

  return svg.node();
}

function initChart(width, height) {
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  return svg;
}

function addYAxis(svg, data, height, width, margins) {
  const Y = data.map((item) => item.value);
  const yType = d3.scaleLinear;
  const yRange = [height - margins.bottom, margins.top];
  const yDomain = [0, d3.max(Y)];
  const yScale = yType(yDomain, yRange);
  const yFormat = null;
  const yLabel = "gCO2 / kWh";
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(height / 40, yFormat)
    .tickSizeInner(0);

  svg
    .append("g")
    .attr("transform", `translate(${margins.left},0)`)
    .call(yAxis)
    // grid lines x
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - margins.left - margins.right)
        .attr("stroke-opacity", 0.05)
    )
    .call((g) => {
      g.selectAll(".tick text").attr("transform", "translate(-5,0)");
    })
    // add y axis label
    .call((g) =>
      g
        .append("text")
        .attr("x", -margins.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    );
  return { yScale, yDomain, Y };
}

function addXAxis(svg, data, width, height, margins) {
  const X = data.map((item) => item.source);
  // Compute default domains, and unique the x-domain.
  // if (xDomain === undefined) xDomain = X;
  const xDomain = new d3.InternSet(X);
  const xRange = [margins.left, width - margins.right];
  const xPadding = 0.1;
  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickSizeInner(0);
  // Omit any data not present in the x-domain.
  const I = d3.range(X.length).filter((i) => xDomain.has(X[i]));
  // x axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margins.bottom})`)
    .call(xAxis)
    .call((g) => g.selectAll("text").remove())
    .call((g) => {
      g.selectAll("path").attr("opacity", 0);
    });
  return { X, xScale, xAxis, I };
}

function addBars({
  svg,
  I,
  xScale,
  yScale,
  yFormat,
  X,
  Y,
  colors,
  titles,
  height,
}) {
  const enterT = svg.transition().duration(5000);
  const bars = svg
    .append("g")
    .selectAll("rect")
    .data(I)
    .join((enter) => {
      enter
        .append("rect")
        .attr("x", (i) => {
          return xScale(X[i]);
        })
        .attr("y", yScale(0))
        .attr("height", 0)
        .attr("width", xScale.bandwidth())
        .attr("fill", function (d, i) {
          return colors[i] || "red";
        })
        .call((enter) => {
          enter
            .transition(enterT)
            .attr("height", (i) => yScale(0) - yScale(Y[i]))
            .attr("y", (i) => yScale(Y[i]));
        });
    });

  // Compute titles.
  if (titles === undefined) {
    const formatValue = yScale.tickFormat(100, yFormat);
    titles = (i) => `${X[i]}\n${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, (d) => d);
    const T = title;
    titles = (i) => T(O[i], i, data);
  }

  if (titles) bars.append("title").text(titles);
  return bars;
}

function addText(svg, height, width) {
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 16)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .text("Carbon Intensity Factors of the UK Electrical Grid");
  // add source
  svg
    .append("text")
    .attr("x", width - 15)
    .attr("y", height - 15)
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .text("(Source: https://carbonintensity.org.uk)");
}
