let carbonIntensity;

import barChart from "./bar.js";
import renderLegend from "./legend.js";
import { createContainer, drawPie } from "./pie.js";

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
/**
 * returns static carbon intensity factors
 * api.carbonintensity.org.uk/intensity/factors
 */

async function getCarbonIntensity() {
  try {
    const res = await fetch(
      "https://api.carbonintensity.org.uk/intensity/factors"
    );
    if (!res.ok) throw Error("response error", res);
    const { data } = await res.json();
    console.log("got carbon data");
    carbonIntensity = data[0];

    const adjustedData = Object.keys(carbonIntensity)
      .map((key) => {
        if (carbonIntensity[key]) {
          return {
            source: key,
            value: carbonIntensity[key],
          };
        }
      })
      .filter(Boolean);
    const legendKeys = [
      ...adjustedData.map((item) => item.source),
      "Zero Carbon Intensity Factors of Solar, Wind, Hydro, Nuclear not shown",
    ];
    renderBar(adjustedData, legendKeys);
  } catch (e) {}
}

export async function getLondonGridData() {
  try {
    const LONDON_REGION = 13;
    const res = await fetch(
      `https://api.carbonintensity.org.uk/regional/regionid/${LONDON_REGION}`
    );
    const { data } = await res.json();
    const fuelMix = data[0]?.data[0]?.generationmix;

    const pieData = fuelMix.map((item) => {
      return {
        name: item.fuel,
        value: item.perc,
      };
    });

    return pieData;

    if (!res.ok) throw Error(res);
  } catch (e) {}
}

async function initLondonGridChart() {
  const width = window.innerWidth;
  const height = 650;
  const svg = createContainer(width, height);
  const data = await getLondonGridData();
  drawPie(svg, data, width, height);

  setTimeout(async function loop() {
    const data = await getLondonGridData();
    drawPie(svg, data, width, height);
    // update every 15 minutes
    setTimeout(loop, 1000 * 60 * 15);
  }, 1000 * 60 * 15);
}

async function renderBar(data, legendKeys) {
  const chart = await barChart(data, {}, colors);
  document.querySelector(".chart-1").appendChild(chart);
  await renderLegend(legendKeys, "#chart1-legend", colors);
}

getCarbonIntensity();
initLondonGridChart();
