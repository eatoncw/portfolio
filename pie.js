const colors = [
  "#6b486b",
  "#a05d56",
  "#d0743c",
  "#3e4444",
  "#b5e7a0",
  "#b2ad7f",
  "#878f99",
  "#d64161",
  "#d5e1df",
  "#405d27",
];

export async function drawPie(svg, data, width, height) {
  const innerRadius = 0; // no donut
  const outerRadius = Math.min(width / 2, height) / 2 - 75;
  const labelRadius = innerRadius * 0.2 + outerRadius * 0.8; // center radius of labels
  const stroke = innerRadius > 0 ? "none" : "white"; // stroke separating widths
  const strokeWidth = 1; // width of stroke separating wedges
  const strokeLinejoin = "round"; // line join of stroke separating wedges
  const padAngle = stroke === "none" ? 1 / outerRadius : 0; // angular separation between wedges

  const N = data.map((item) => item.name);
  const V = data.map((item) => item.value);
  const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

  const names = new d3.InternSet(N);
  const color = d3.scaleOrdinal(names, colors);
  const format = ",";
  const formatValue = d3.format(format);
  const title = (i) => `${N[i]}\n${formatValue(V[i])}`;
  const arcs = d3
    .pie()
    .padAngle(padAngle)
    .sort(null)
    .value((i) => V[i])(I);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  const nonFossilFuels = ["biomass", "nuclear", "hydro", "solar", "wind"];
  const nonFossilFuelPercent = data.reduce((prev, curr) => {
    let percent = 0;
    if (nonFossilFuels.includes(curr.name)) {
      percent = curr.value;
    }
    return prev + percent;
  }, 0);

  const slices = svg
    .select(".slices")
    .selectAll("path")
    .data(arcs, (d) => d);

  const labels = svg
    .select(".labels")
    .selectAll("text")
    .data(arcs, (d) => d);

  const dots = svg
    .select(".dots")
    .selectAll("circle")
    .data(data, (d) => d);

  const keys = svg
    .select(".keys")
    .selectAll("text")
    .data(
      [
        ...data,
        {
          name: "Sum Domestic Non-Fossil Fuels",
          value: parseInt(nonFossilFuelPercent),
        },
      ],
      (d) => d
    );

  const t = svg.transition().duration(450);

  slices.join(
    (enter) => {
      enter.append("path").call((enter) =>
        enter
          .transition(t)
          .attr("d", arc)
          .attr("fill", function (d, i) {
            const c = color(N[d.data]);
            return c;
          })
          .attr("stroke", stroke)
          .attr("stroke-width", strokeWidth)
          .attr("stroke-linejoin", strokeLinejoin)
      );
    },
    (update) => {
      update
        .transition(t)
        .attr("d", arc)
        .attr("fill", function (d, i) {
          return color(N[d.data]);
        })
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin);
    }
  );

  labels
    .join("text")
    .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
    .selectAll("tspan")
    .data((d) => {
      const lines = `${title(d.data)}`.split(/\n/);
      return d.endAngle - d.startAngle > 0.25 ? lines.slice(1) : [];
    })
    .join("tspan")
    .attr("x", 0)
    .attr("y", (_, i) => `${i * 1.1}em`)
    .attr("font-weight", (_, i) => (i ? null : "bold"))
    .text((d) => {
      return d;
    });

  dots
    .join("circle")
    .attr("cx", function (d, i) {
      return 50;
    })
    .attr("cy", function (d, i) {
      return 40 * i - height / 3;
    })
    .attr("r", function (d) {
      return 7;
    })
    .attr("fill", function (d, i) {
      return colors[i];
    });

  keys
    .join("text")
    .attr("x", function (d, i) {
      if (i === data.length) {
        return 0;
      }
      return 70;
    })
    .attr("y", function (d, i) {
      if (i === data.length) {
        return 40 * i - height / 3 + 10;
      }
      return 40 * i - height / 3;
    })
    .style("fill", function (d) {
      return "#353839";
    })
    .text(function (d) {
      return `${d.name}:  ${d.value}%`;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("font-weight", (d, i) => {
      if (i === data.length) {
        return 900;
      }
    })
    .attr("font-size", (d, i) => {
      if (i === data.length) {
        return 16;
      }
    });

  svg.node();
}

export function createContainer(width, height) {
  const svg = d3
    .select(".chart-2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  svg
    .append("g")
    .classed("slices", true)
    .attr("transform", `translate(${-width / 4 + 50}, 0)`);
  svg
    .append("g")
    .classed("labels", true)
    .attr("transform", `translate(${-width / 4 + 50}, 0)`)
    .attr("font-family", "Aleo")
    .attr("font-size", 14)
    .attr("text-anchor", "middle");

  const legend = svg
    .append("g")
    .classed("legend", true)
    .attr("transform", `translate(0, 20)`);
  legend.append("g").classed("dots", true);
  legend.append("g").classed("keys", true);
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", (d, i) => {
      return -height / 2 + 20;
    })
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .text("Current Grid Electricity Sources in London");
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", (d, i) => {
      return -height / 2 + 40;
    })
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Updated every 15 min");

  svg
    .append("text")
    .attr("x", width / 4)
    .attr("y", (d, i) => {
      return height / 2 - 10;
    })
    .attr("text-anchor", "right")
    .style("font-size", "10px")
    .text("(source: https://api.carbonintensity.org.uk)");

  return svg;
}
