export default async function renderLegend(data, id, colors = [], rows = 4) {
  const legend = d3.select(id);
  legend.attr("width", window.innerWidth - 50);
  const marginLeft = 50;
  const colSpace = 220;
  legend
    .selectAll()
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      if (i < rows) {
        return marginLeft;
      } else if (i < rows * 2) {
        return marginLeft + colSpace;
      } else {
        return marginLeft + colSpace * 2;
      }
    })
    .attr("cy", function (d, i) {
      if (i < rows) {
        return 25 + i * 25;
      } else if (i < rows * 2) {
        return 25 + (i - rows) * 25;
      } else {
        return 25 + (i - rows * 2) * 25;
      }
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d, i) {
      return colors[i] || "black";
    });

  // create legend labels
  legend
    .selectAll("mylabels")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
      if (i < rows) {
        return marginLeft + 20;
      } else if (i < rows * 2) {
        return marginLeft + colSpace + 20;
      } else {
        return marginLeft + colSpace * 2 + 20;
      }
    })
    .attr("y", function (d, i) {
      if (i < rows) {
        return 25 + i * 25;
      } else if (i < rows * 2) {
        return 25 + (i - rows) * 25;
      } else {
        return 25 + (i - rows * 2) * 25;
      }
    })
    .style("fill", function (d) {
      return "#353839";
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
